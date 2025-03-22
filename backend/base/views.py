import logging
import os
import time
import tempfile
import random  # 🔹 Used for random rate-limit messages
import requests
from dotenv import load_dotenv
from django.core.cache import cache  # 🔹 Cache to store per-user cooldowns

from django.http import JsonResponse, FileResponse
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator

from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView

# Custom imports from your project
from .decorators import log_request, require_permissions, class_log_request
from .models import Chat, Message, Category, CardSet, Card
from .serializers import CategorySerializer, CardSetSerializer, CardSerializer, UserRegistrationSerializer
from google.auth.transport import requests as google_requests
from google.oauth2 import id_token
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from django.http import StreamingHttpResponse, JsonResponse
from pydub import AudioSegment
import io

@api_view(['POST'])
@permission_classes([AllowAny])
def google_login(request):
    """
    Verify the Google ID token from the frontend, fetch or create the user,
    and return a JWT access token for your application.
    """
    token = request.data.get('token')
    if not token:
        return Response({"error": "No token provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # 1. Verify the token with Google's library
        idinfo = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID
        )

        # 2. Extract user info
        email = idinfo.get('email')
        first_name = idinfo.get('given_name', '')
        last_name = idinfo.get('family_name', '')

        if not email:
            return Response({"error": "Google token is missing email."}, status=status.HTTP_400_BAD_REQUEST)

        # 3. Find or create a user with this email.
        matching_users = User.objects.filter(email=email)
        if matching_users.count() == 0:
            # No user exists, create one
            user = User.objects.create_user(
                username=email,  # or another unique scheme
                email=email,
                first_name=first_name,
                last_name=last_name
            )
            created = True
        elif matching_users.count() == 1:
            # Exactly one user with this email
            user = matching_users.first()
            created = False
        else:
            # Multiple users with the same email → unify them or delete duplicates
            user = matching_users.first()
            # Option 1: Delete duplicates
            for dup in matching_users[1:]:
                dup.delete()
            created = False

        # 4. Generate JWT token (access token) for the user
        refresh = RefreshToken.for_user(user)

        # 5. Return the token to the frontend
        return Response({
            "accessToken": str(refresh.access_token),
            "message": "User logged in or registered via Google successfully."
        }, status=status.HTTP_200_OK)

    except ValueError:
        # Token verification failed
        return Response({"error": "Invalid Google token."}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([AllowAny])
def google_register(request):
    """
    Verify the Google ID token from the frontend, register a new user if one doesn't exist,
    or log in an existing user, then return a JWT access token.
    """
    token = request.data.get('token')
    if not token:
        return Response({"error": "No token provided."}, status=status.HTTP_400_BAD_REQUEST)

    try:
        # Verify the token using Google's library.
        idinfo = id_token.verify_oauth2_token(
            token,
            google_requests.Request(),
            settings.GOOGLE_CLIENT_ID
        )

        # Extract user info from the token.
        email = idinfo.get('email')
        first_name = idinfo.get('given_name', '')
        last_name = idinfo.get('family_name', '')

        if not email:
            return Response({"error": "Google token is missing email."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if a user with this email already exists.
        matching_users = User.objects.filter(email=email)
        if matching_users.count() == 0:
            # No user exists, create a new one.
            user = User.objects.create_user(
                username=email,  # Using email as username; adjust if needed.
                email=email,
                first_name=first_name,
                last_name=last_name
            )
            message = "User registered via Google successfully."
        elif matching_users.count() == 1:
            # Exactly one user exists; we'll log them in.
            user = matching_users.first()
            message = "User logged in via Google successfully."
        else:
            # Multiple users found; keep the first and delete duplicates.
            user = matching_users.first()
            for dup in matching_users[1:]:
                dup.delete()
            message = "User logged in via Google successfully (duplicates removed)."

        # Generate JWT token (access token) for the user.
        refresh = RefreshToken.for_user(user)

        # Return the token and message.
        return Response({
            "accessToken": str(refresh.access_token),
            "message": message
        }, status=status.HTTP_200_OK)

    except ValueError:
        # Token verification failed.
        return Response({"error": "Invalid Google token."}, status=status.HTTP_401_UNAUTHORIZED)

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
    @method_decorator(log_request)  # ✅ Ensure proper indentation here
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        response.data.pop('refresh', None)  # Remove refresh token safely
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




logger = logging.getLogger(__name__)


# List of random "slow down" messages if a user calls too quickly
RATE_LIMIT_MESSAGES = [
    "You're going too fast! Try again in a few seconds.",
    "Hold on! You're sending messages too quickly. Try again in 5-10 seconds.",
    "Slow down! The AI needs a moment to respond properly.",
    "Too many requests! Give it a few seconds before trying again.",
    "Patience, my friend! Wait a little before sending another message."
]

# List of random messages if the user has reached the free usage limit
FREE_LIMIT_MESSAGES = [
    "You have reached your free limit. Please buy premium for more requests.",
    "That’s all for free requests! Upgrade to premium to continue.",
    "Your free-plan requests are maxed out. Purchase premium for more.",
    "No more freebies—please consider buying premium for unlimited use."
]


class GeminiView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        user_id = user.id
        logger.info(f"User {user.username} permissions: {user.get_all_permissions()}")

        # -----------------------------------------------------------------
        # 0. If user is a superuser, SKIP ALL LIMITS (usage + cooldown).
        # -----------------------------------------------------------------
        if user.is_superuser:
            logger.info(f"User {user.username} is superuser; skipping rate limits.")
            return self._call_gemini_api(request)

        # ----------------------
        # 1. Check usage limit
        # ----------------------
        max_requests = 4
        current_usage = cache.get(f"gemini_request_count_{user_id}", 0)

        if current_usage >= max_requests:
            limit_message = random.choice(FREE_LIMIT_MESSAGES)
            logger.warning(f"User {user.username} exceeded the free usage limit.")
            return Response({"text": limit_message}, status=status.HTTP_200_OK)
            # ↑ We use 200 instead of 403 to avoid a front-end error

        cache.set(f"gemini_request_count_{user_id}", current_usage + 1, None)
        # If you want a daily reset, add timeout=86400 for 24 hours

        # Make sure we have valid user input
        user_input = request.data.get("message", "")
        if not user_input:
            return Response({"error": "No message provided"}, status=status.HTTP_400_BAD_REQUEST)

        # -------------------------------
        # 2. Check short-term cooldown
        # -------------------------------
        last_request_time = cache.get(f"gemini_cooldown_{user_id}")
        COOLDOWN_TIME = 10  # 10 seconds

        if last_request_time:
            time_since_last_request = time.time() - last_request_time
            if time_since_last_request < COOLDOWN_TIME:
                warning_message = random.choice(RATE_LIMIT_MESSAGES)
                logger.warning(f"User {user.username} is sending requests too quickly.")
                return Response({"text": warning_message}, status=status.HTTP_200_OK)

        cache.set(f"gemini_cooldown_{user_id}", time.time(), timeout=COOLDOWN_TIME)

        # ---------------------
        # 3. Call Gemini API
        # ---------------------
        return self._call_gemini_api(request)

    def _call_gemini_api(self, request):
        """
        Helper function that calls the external Gemini API.
        """
        user_input = request.data.get('message', '')
        if not user_input:
            return Response({"error": "No message provided"}, status=status.HTTP_400_BAD_REQUEST)

        API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-002:generateContent"
        google_api_key = os.getenv("GOOGLE_API_KEY")  # or settings.GOOGLE_API_KEY

        try:
            response = requests.post(
                f"{API_URL}?key={google_api_key}",
                headers={"Content-Type": "application/json"},
                json={"contents": [{"parts": [{"text": user_input}]}]}
            )

            # If external API says "Too Many Requests," return "slow down" message
            if response.status_code == 429:
                warning_message = random.choice(RATE_LIMIT_MESSAGES)
                logger.warning(f"User {request.user.username} hit Gemini API rate limits.")
                return Response({"text": warning_message}, status=status.HTTP_200_OK)

            response.raise_for_status()
            response_json = response.json()

            text_response = (
                response_json
                .get("candidates", [{}])[0]
                .get("content", {})
                .get("parts", [{}])[0]
                .get("text", "No response")
            )

            return Response({"text": text_response}, status=status.HTTP_200_OK)

        except requests.RequestException as e:
            logger.error(f"Error calling Gemini API: {str(e)}")
            return Response(
                {"text": "The AI is currently unavailable. Please try again later."},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

# Path to the local "freelimit.mp3" file
FREELIMIT_MP3_PATH = os.path.join(settings.BASE_DIR, 'base', 'static', 'freelimit.mp3')

# Max total requests across both endpoints
MAX_REQUESTS = 4

def handle_usage_limit(request):
    """
    Checks a shared usage limit across both TTS endpoints.
    - If user is superuser => No limit.
    - If user (non-superuser) has >= MAX_REQUESTS => return freelimit.mp3
    - Otherwise increment usage by 1.
    """
    user = request.user
    if user.is_superuser:
        logger.info(f"User {user.username} is superuser; skipping limit checks.")
        return None  # Means "go ahead, no limit"

    # We store a shared key so that calls to normal & slow TTS add up together
    cache_key = f"tts_usage_count_{user.id}"
    current_usage = cache.get(cache_key, 0)

    if current_usage >= MAX_REQUESTS:
        # Return the freelimit.mp3 file
        logger.warning(f"User {user.username} exceeded the TTS usage limit.")
        try:
            return FileResponse(open(FREELIMIT_MP3_PATH, 'rb'), as_attachment=True, filename="freelimit.mp3")
        except FileNotFoundError:
            logger.error("freelimit.mp3 not found on the server.")
            return JsonResponse({"error": "freelimit.mp3 not found."}, status=500)

    # Increment usage
    cache.set(cache_key, current_usage + 1, None)
    return None  # Means "continue"


class TextToSpeechView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        logger.info(f"User {user.username} called TextToSpeechView.")

        # -- 1. Check usage limit (shared) --
        limit_response = handle_usage_limit(request)
        if limit_response is not None:
            return limit_response  # either freelimit.mp3 or error

        # -- 2. Normal TTS logic if not limited --
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
            }
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


class SlowTextToSpeechView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        user = request.user
        logger.info(f"User {user.username} called SlowTextToSpeechView.")

        # -- 1. Check usage limit (shared) --
        limit_response = handle_usage_limit(request)
        if limit_response is not None:
            return limit_response  # either freelimit.mp3 or error

        # -- 2. Slow TTS logic if not limited --
        text = request.data.get("text")
        if not text:
            return JsonResponse({"error": "Text is required"}, status=400)

        url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
        headers = {
            "xi-api-key": ELABS_API_KEY,
            "Content-Type": "application/json",
            "Accept": "audio/mpeg",
        }
        data = {
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": 0.3,
                "similarity_boost": 0.5,
                "style": 0.5,
                "use_speaker_boost": False,
                "speed": 0.7
            }
        }

        try:
            response = requests.post(url, json=data, headers=headers, stream=True)
            response.raise_for_status()

            return StreamingHttpResponse(response.raw, content_type="audio/mpeg")

        except requests.exceptions.HTTPError as http_err:
            logger.error(f"HTTP error occurred: {http_err}")
            return JsonResponse({"error": f"HTTP error: {http_err}"}, status=response.status_code)
        except Exception as e:
            logger.error(f"Error generating audio: {e}")
            return JsonResponse({"error": "Error generating the audio"}, status=500)
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
