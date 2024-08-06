import logging
from django.http import JsonResponse, FileResponse
from django.views import View
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import JSONParser
from rest_framework import status
import requests
import os
from rest_framework_simplejwt.authentication import JWTAuthentication
import tempfile
from django.contrib.auth.models import User
from scipy import stats
from dotenv import load_dotenv
from django.utils.decorators import method_decorator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.decorators import api_view, permission_classes
from .decorators import log_request, require_permissions, class_log_request
from .models import *
from .serializers import *

logger = logging.getLogger(__name__)
GOOGLE_API_KEY =os.getenv('GOOGLE_API_KEY')
ELABS_API_KEY = os.getenv('ELABS_API_KEY')
VOICE_ID = os.getenv('VOICE_ID')

class MyTokenObtainPairView(TokenObtainPairView):
    @method_decorator(log_request)
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        logger.info(f"Token obtained for {request.data.get('username')}, status code: {response.status_code}")
        return response

@api_view(['POST'])
@log_request
def register(request):
    try:
        user = User.objects.create_user(
            username=request.data['username'],
            email=request.data['email'],
            password=request.data['password']
        )
        user.is_active = True
        user.is_staff = True
        user.save()
        logger.info(f"User {user.username} registered successfully.")
        return Response("New user created", status=201)
    except Exception as e:
        logger.error(f"Error during user registration: {e}")
        return Response({"error": str(e)}, status=500)

@class_log_request
# @method_decorator(require_permissions(['IsAuthenticated']), name='post')
class GeminiView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        logger.info(f"User {user.username} permissions: {user.get_all_permissions()}")
        user_input = request.data.get('message', '')
        if not user_input:
            return Response({"error": "No message provided"}, status=status.HTTP_400_BAD_REQUEST)

        chat, created = Chat.objects.get_or_create(user=request.user)
        Message.objects.create(chat=chat, sender='user', content=user_input)

        try:
            response = requests.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GOOGLE_API_KEY}",
                headers={"Content-Type": "application/json"},
                json={"contents": [{"parts": [{"text": user_input}]}]}
            )
            if response.status_code != 200:
                return Response({"error": f"API request failed with status {response.status_code}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            response_json = response.json()
            text_response = response_json.get("candidates", [])[0].get("content", {}).get("parts", [])[0].get("text", "No response")

            Message.objects.create(chat=chat, sender='system', content=text_response)

            return Response({"text": text_response})
        except requests.RequestException as e:
            logger.error(f"Error: {str(e)}")
            return Response({"error": f"HTTP error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@class_log_request
# @method_decorator(require_permissions(['base.chat']), name='post')
class TextToSpeechView(APIView):
    permission_classes = [IsAuthenticated]


    def post(self, request):
        user = request.user
        logger.info(f"User {user.username} permissions: {user.get_all_permissions()}")
        text = request.data.get('text')
        if not text:
            return JsonResponse({'error': 'Text is required'}, status=400)

        url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
        headers = {
            'xi-api-key': ELABS_API_KEY,
            'Content-Type': 'application/json',
            'Accept': 'audio/mpeg',
        }
        data = {
            'text': text,
            'model_id': 'eleven_multilingual_v2',
            'voice_settings': {
                'stability': 0.5,
                'similarity_boost': 0.5
            },
            'languages': [
                {
                    'language_id': "fr-FR",
                    'name': "French Voiceover"
                }
            ]
        }

        logger.debug(f"Headers: {headers}")
        logger.debug(f"Data: {data}")

        try:
            response = requests.post(url, json=data, headers=headers, stream=True)
            logger.debug(f"Response status: {response.status_code}")
            response.raise_for_status()

            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp3')
            with open(temp_file.name, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    if chunk:
                        f.write(chunk)
            temp_file.close()

            return FileResponse(open(temp_file.name, 'rb'), as_attachment=True, filename='audio.mp3')
        except requests.exceptions.HTTPError as http_err:
            logger.error(f"HTTP error occurred: {http_err}")
            return JsonResponse({'error': f"HTTP error: {http_err}"}, status=response.status_code)
        except Exception as e:
            logger.error(f"Error generating audio: {e}")
            return JsonResponse({'error': 'Error generating the audio'}, status=500)
        
class ChatHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        chat = Chat.objects.filter(user=request.user).first()
        if not chat:
            return Response({"error": "No chat history found"}, status=status.HTTP_404_NOT_FOUND)
        
        messages = chat.messages.all().order_by('timestamp')
        message_data = [{"id": msg.id, "sender": msg.sender, "content": msg.content, "timestamp": msg.timestamp} for msg in messages]
        return Response({"messages": message_data})

    def post(self, request):
        """
        Create a new chat or add a message to an existing chat.
        """
        chat, created = Chat.objects.get_or_create(user=request.user)
        if not created:
            # Optionally: return a response indicating a chat already exists.
            return Response({"message": "Chat already exists"}, status=status.HTTP_200_OK)
        return Response({"message": "New chat created"}, status=status.HTTP_201_CREATED)

    def put(self, request):
        """
        Update a specific message in the chat.
        """
        chat = Chat.objects.filter(user=request.user).first()
        if not chat:
            return Response({"error": "No chat found"}, status=status.HTTP_404_NOT_FOUND)

        message_id = request.data.get("message_id")
        new_content = request.data.get("content")

        try:
            message = chat.messages.get(id=message_id)
            message.content = new_content
            message.save()
            return Response({"message": "Message updated"}, status=status.HTTP_200_OK)
        except Message.DoesNotExist:
            return Response({"error": "Message not found"}, status=status.HTTP_404_NOT_FOUND)
