import logging
from django.http import JsonResponse, FileResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
import requests
import os
import tempfile
from django.contrib.auth.models import User
from dotenv import load_dotenv
from django.utils.decorators import method_decorator
from rest_framework.decorators import api_view, permission_classes
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from .decorators import log_request, require_permissions, class_log_request
from .models import Chat, Message
from .serializers import *


from rest_framework import generics, permissions
from .models import Category, CardSet, Card
from .serializers import CategorySerializer, CardSetSerializer, CardSerializer

# 🛠️ List & Create Categories
class CategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Automatically set the user

# 🛠️ Retrieve, Update & Delete Category (with Safe Deletion of Sets & Cards)
class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)

    def destroy(self, request, *args, **kwargs):
        category = self.get_object()

        # 🛠️ Manually delete related CardSets and Cards
        sets = CardSet.objects.filter(category=category)
        for card_set in sets:
            Card.objects.filter(card_set=card_set).delete()  # Delete all Cards in this set
            card_set.delete()  # Delete the CardSet

        category.delete()  # Finally, delete the category

        return Response({"message": "Category and all its related sets and cards deleted."}, status=status.HTTP_204_NO_CONTENT)

# CardSet Views
class CardSetListCreateView(generics.ListCreateAPIView):
    serializer_class = CardSetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CardSet.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)  # Ensure user is set automatically


class CardSetDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CardSetSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CardSet.objects.filter(user=self.request.user)

class CardListCreateView(generics.ListCreateAPIView):
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        card_set_id = self.request.query_params.get('card_set')  # Get `setId` from request
        if card_set_id:
            return Card.objects.filter(card_set=card_set_id)  # 🛠️ Filter by `card_set`
        return Card.objects.none()  # 🛠️ Return empty if no set ID provided

class CardDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Card.objects.filter(card_set__user=self.request.user)

# Load environment variables
load_dotenv()

# Logger for debugging
logger = logging.getLogger(__name__)

# Fetch from .env
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
ELABS_API_KEY = os.getenv('ELABS_API_KEY')
VOICE_ID = os.getenv('VOICE_ID')

# Custom JWT token view to remove refresh token
class MyTokenObtainPairView(TokenObtainPairView):
    @method_decorator(log_request)
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        response.data.pop('refresh', None)  # Remove refresh token from response
        logger.info(f"Token obtained for {request.data.get('username')}, status code: {response.status_code}")
        return response

@api_view(['POST'])
@log_request
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        logger.info(f"User {serializer.validated_data['username']} registered successfully.")
        return Response({"message": "User registered successfully"}, status=status.HTTP_201_CREATED)
    else:
        logger.warning(f"Registration failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Chat application
@class_log_request
class GeminiView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        logger.info(f"User {user.username} permissions: {user.get_all_permissions()}")
        user_input = request.data.get('message', '')  # Input message

        if not user_input:
            return Response({"error": "No message provided"}, status=status.HTTP_400_BAD_REQUEST)

        chat, created = Chat.objects.get_or_create(user=request.user)
        Message.objects.create(chat=chat, sender='user', content=user_input)  # Save message in db

        try:
            response = requests.post(
                f"https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key={GOOGLE_API_KEY}",
                headers={"Content-Type": "application/json"},
                json={"contents": [{"parts": [{"text": user_input}]}]}
            )
            response.raise_for_status()

            response_json = response.json()
            text_response = response_json.get("candidates", [{}])[0].get("content", {}).get("parts", [{}])[0].get("text", "No response")

            Message.objects.create(chat=chat, sender='system', content=text_response)

            return Response({"text": text_response})
        except requests.RequestException as e:
            logger.error(f"Error: {str(e)}")
            return Response({"error": f"HTTP error occurred: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@class_log_request
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

        try:
            response = requests.post(url, json=data, headers=headers, stream=True)
            response.raise_for_status()

            temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.mp3')
            with open(temp_file.name, 'wb') as f:
                for chunk in response.iter_content(chunk_size=8192):
                    f.write(chunk)

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
        chat, created = Chat.objects.get_or_create(user=request.user)
        if not created:
            return Response({"message": "Chat already exists"}, status=status.HTTP_200_OK)
        return Response({"message": "New chat created"}, status=status.HTTP_201_CREATED)

    def put(self, request):
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
