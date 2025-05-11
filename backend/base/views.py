# backend/base/views.py

import logging
import os
import time
import tempfile
import random
import requests # For calling external APIs like Gemini, ElevenLabs
from dotenv import load_dotenv

from django.core.cache import cache
from django.http import JsonResponse, FileResponse, StreamingHttpResponse
from django.contrib.auth.models import User
from django.utils.decorators import method_decorator
from django.conf import settings

from rest_framework import status, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken

from google.auth.transport import requests as google_requests_lib # Renamed to avoid conflict
from google.oauth2 import id_token

# Assuming decorators.py is in the same 'base' app directory
# If not, adjust the import path accordingly.
# from .decorators import log_request, require_permissions, class_log_request

from .models import Chat, Message, Category, CardSet, Card
from .serializers import (
    CategorySerializer,
    CardSetSerializer,
    CardSerializer,
    UserRegistrationSerializer,
    MessageSerializer,
    ChatSessionListSerializer,
    ChatSessionDetailSerializer,
    MyTokenObtainPairSerializer # Make sure this is defined in your serializers.py
)

# Load environment variables
load_dotenv()
logger = logging.getLogger(__name__)

# Fetch API Keys from .env
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
ELABS_API_KEY = os.getenv("ELABS_API_KEY")
VOICE_ID = os.getenv("VOICE_ID")
# GOOGLE_CLIENT_ID is usually accessed via settings.GOOGLE_CLIENT_ID

# --- Existing Authentication and Registration Views ---

@api_view(["POST"])
@permission_classes([AllowAny])
def google_login(request):
    token = request.data.get("token")
    if not token:
        return Response(
            {"error": "No token provided."}, status=status.HTTP_400_BAD_REQUEST
        )
    try:
        idinfo = id_token.verify_oauth2_token(
            token, google_requests_lib.Request(), settings.GOOGLE_CLIENT_ID
        )
        email = idinfo.get("email")
        first_name = idinfo.get("given_name", "")
        last_name = idinfo.get("family_name", "")

        if not email:
            return Response(
                {"error": "Google token is missing email."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Use get_or_create for cleaner user handling
        user, created = User.objects.get_or_create(
            email=email,
            defaults={'username': email, 'first_name': first_name, 'last_name': last_name}
        )
        # Update names if user already existed but names changed in Google profile
        if not created and (user.first_name != first_name or user.last_name != last_name or user.username != email):
            user.first_name = first_name
            user.last_name = last_name
            user.username = email # Ensure username is also updated if it was different
            user.save()

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "accessToken": str(refresh.access_token),
                "message": "User logged in or registered via Google successfully.",
            },
            status=status.HTTP_200_OK,
        )
    except ValueError as e:
        logger.error(f"Google token verification failed: {e}")
        return Response(
            {"error": "Invalid Google token."}, status=status.HTTP_401_UNAUTHORIZED
        )
    except Exception as e:
        logger.error(f"An unexpected error occurred during Google login: {e}")
        return Response(
            {"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )


@api_view(["POST"])
@permission_classes([AllowAny])
def google_register(request):
    # This function is very similar to google_login if get_or_create is used.
    # You might consider consolidating them or ensuring distinct logic if needed.
    return google_login(request) # Effectively, registration is handled by login if user doesn't exist


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer # Use your custom serializer
    # If you have decorators:
    # @method_decorator(log_request)
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        # The custom serializer should handle removing the refresh token
        logger.info(
            f"Token obtained for {request.data.get('username')}, status code: {response.status_code}"
        )
        return response


@api_view(["POST"])
# @log_request # If you use this decorator
@permission_classes([AllowAny])
def register(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        logger.info(
            f"User {serializer.validated_data['username']} registered successfully."
        )
        return Response(
            {"message": "User registered successfully"}, status=status.HTTP_201_CREATED
        )
    else:
        logger.warning(f"Registration failed: {serializer.errors}")
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --- Existing Category, CardSet, Card Views ---
class CategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Category.objects.filter(user=self.request.user)
    # Your custom destroy logic for Category can remain if needed,
    # or rely on model's on_delete=models.CASCADE if set up correctly.

class CardSetListCreateView(generics.ListCreateAPIView):
    serializer_class = CardSetSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return CardSet.objects.filter(user=self.request.user)
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CardSetDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CardSetSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return CardSet.objects.filter(user=self.request.user)

class CardListCreateView(generics.ListCreateAPIView):
    serializer_class = CardSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        card_set_id = self.request.query_params.get("card_set")
        if card_set_id:
            # Ensure the card_set belongs to the user
            if CardSet.objects.filter(id=card_set_id, user=self.request.user).exists():
                return Card.objects.filter(card_set_id=card_set_id)
            return Card.objects.none() # Card set not found or doesn't belong to user
        # If you want to list all cards for a user (not typical without a set context):
        # return Card.objects.filter(card_set__user=self.request.user)
        return Card.objects.none()
    def perform_create(self, serializer):
        # Add validation: ensure the card_set_id in payload belongs to the request.user
        card_set_id = serializer.validated_data.get('card_set').id
        if not CardSet.objects.filter(id=card_set_id, user=self.request.user).exists():
            raise serializers.ValidationError("Invalid card_set or permission denied.")
        serializer.save()


class CardDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CardSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Card.objects.filter(card_set__user=self.request.user)


# ---- CHAT HISTORY AND MESSAGING VIEWS ----

class ChatSessionListCreateView(generics.ListCreateAPIView):
    serializer_class = ChatSessionListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Chat.objects.filter(user=self.request.user).order_by('-updated_at')

    def perform_create(self, serializer):
        # Title can be optional at creation, will be set by first message
        serializer.save(user=self.request.user)

class ChatSessionDetailView(generics.RetrieveAPIView):
    serializer_class = ChatSessionDetailSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_url_kwarg = 'session_id' # Ensure this matches your URL conf (e.g., <int:session_id>)

    def get_queryset(self):
        return Chat.objects.filter(user=self.request.user)


# --- Helper for Gemini API Call ---
RATE_LIMIT_MESSAGES = [
    "You're going too fast! Try again in a few seconds.",
    "Hold on! You're sending messages too quickly. Try again in 5-10 seconds.",
    "Slow down! The AI needs a moment to respond properly.",
]
FREE_LIMIT_MESSAGES = [
    "You have reached your free usage limit for this feature.",
    "Upgrade to premium to continue using this feature.",
]

def _call_gemini_api_with_history(prompt_history, api_key):
    """
    Calls the Gemini API with a history of messages.
    prompt_history should be a list of dicts:
    e.g., [{'role': 'user', 'parts': [{'text': 'Hello'}]}, {'role': 'model', 'parts': [{'text': 'Hi!'}]}]
    """
    # Use the v1beta endpoint for more features like system instructions if needed,
    # or v1 for general use. Flash is faster, Pro is more capable.
    API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent"
    # API_URL = "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro-latest:generateContent"

    MAX_RETRIES = 3
    BASE_BACKOFF = 2  # seconds

    payload = {
        "contents": prompt_history,
        # Optional: Add generationConfig for temperature, max tokens, etc.
        # "generationConfig": {
        #     "temperature": 0.7,
        #     "topP": 1.0,
        #     "maxOutputTokens": 2048,
        # },
        # Optional: Add safetySettings
        # "safetySettings": [
        #     {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        #     {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_MEDIUM_AND_ABOVE"},
        #     # ... other settings
        # ]
    }

    for attempt in range(MAX_RETRIES):
        try:
            resp = requests.post(
                f"{API_URL}?key={api_key}",
                headers={"Content-Type": "application/json"},
                json=payload,
                timeout=45  # Increased timeout
            )
        except requests.RequestException as e:
            logger.error(f"Gemini API Network error on attempt {attempt + 1}: {e}")
            if attempt < MAX_RETRIES - 1:
                time.sleep(BASE_BACKOFF * (2 ** attempt))
                continue
            return f"Sorry, I couldn't reach the AI service due to a network issue: {e}"

        if resp.status_code == 200:
            try:
                data = resp.json()
                candidates = data.get("candidates", [])
                if candidates and candidates[0].get("content") and candidates[0]["content"].get("parts"):
                    text_parts = candidates[0]["content"]["parts"]
                    # Concatenate if multiple parts, usually just one for text
                    full_text = "".join(part.get("text", "") for part in text_parts)
                    return full_text if full_text else "I received an empty response from the AI."

                # Check for blocked prompt
                prompt_feedback = data.get("promptFeedback")
                if prompt_feedback and prompt_feedback.get("blockReason"):
                    reason = prompt_feedback["blockReason"]
                    details = prompt_feedback.get("safetyRatings")
                    logger.warning(f"Gemini API blocked prompt: {reason}. Details: {details}")
                    return f"My apologies, I cannot respond to that due to content restrictions ({reason})."
                
                logger.error(f"Unexpected Gemini API response structure: {data}")
                return "I received an unexpected response from the AI."
            except (ValueError, KeyError, IndexError, TypeError) as e: # Added TypeError
                logger.error(f"Error parsing Gemini response: {e}. Response: {resp.text[:500]}")
                return "Sorry, I had trouble understanding the AI's response."

        elif resp.status_code == 429: # Rate limit / Quota exceeded
            logger.warning(f"Gemini API quota hit (429) on attempt {attempt + 1}. Response: {resp.text[:200]}")
            if attempt < MAX_RETRIES - 1:
                retry_after_str = resp.headers.get("Retry-After")
                wait_time = BASE_BACKOFF * (2 ** attempt)
                if retry_after_str and retry_after_str.isdigit():
                    wait_time = max(wait_time, int(retry_after_str))
                logger.info(f"Retrying Gemini call after {wait_time} seconds.")
                time.sleep(wait_time)
                continue
            return random.choice(RATE_LIMIT_MESSAGES) # Or "AI service is currently busy."

        else: # Other errors
            logger.error(f"Gemini API error {resp.status_code} on attempt {attempt + 1}. Body: {resp.text[:200]}")
            if attempt < MAX_RETRIES - 1:
                time.sleep(BASE_BACKOFF * (2 ** attempt))
                continue
            return f"Sorry, I encountered an error trying to reach the AI service (Code: {resp.status_code})."
            
    return "The AI service seems to be unavailable after multiple retries."


class ChatMessageCreateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id, format=None):
        user = request.user
        try:
            chat_session = Chat.objects.get(pk=session_id, user=user)
        except Chat.DoesNotExist:
            return Response({"error": "Chat session not found or access denied."}, status=status.HTTP_404_NOT_FOUND)

        # --- Rate Limiting & Usage Limits (Adapt as needed) ---
        if not user.is_superuser:
            # Example: Max 50 messages per session for free tier
            MAX_MESSAGES_SESSION_FREE = 50
            if chat_session.messages.count() >= MAX_MESSAGES_SESSION_FREE:
                logger.warning(f"User {user.username} exceeded message limit for session {session_id}.")
                return Response({"error": random.choice(FREE_LIMIT_MESSAGES)}, status=status.HTTP_403_FORBIDDEN)

            # Example: Cooldown of 3 seconds between messages in a session
            COOLDOWN_SECONDS = 3
            cache_key_cooldown = f"chat_msg_cooldown_{user.id}_{session_id}"
            last_request_time = cache.get(cache_key_cooldown)
            if last_request_time:
                if time.time() - last_request_time < COOLDOWN_SECONDS:
                    logger.warning(f"User {user.username} sending messages too quickly for session {session_id}.")
                    return Response({"error": random.choice(RATE_LIMIT_MESSAGES)}, status=status.HTTP_429_TOO_MANY_REQUESTS)
            cache.set(cache_key_cooldown, time.time(), timeout=COOLDOWN_SECONDS + 2)
        # --- End Rate Limiting ---

        user_message_content = request.data.get('content')
        if not user_message_content or not user_message_content.strip():
            return Response({"error": "Message content cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Save user's message
        user_message = Message.objects.create(
            chat=chat_session,
            sender='user',
            content=user_message_content.strip()
        )
        user_message_serializer = MessageSerializer(user_message)

        # 2. Prepare history for Gemini
        messages_qs = chat_session.messages.order_by('timestamp').all() # Includes the new user message
        gemini_prompt_history = []
        for msg in messages_qs:
            # Gemini expects 'user' for user messages and 'model' for AI's previous responses
            role = "model" if msg.sender == "ai" else "user"
            gemini_prompt_history.append({'role': role, 'parts': [{'text': msg.content}]})

        # 3. Get AI response
        # Ensure GOOGLE_API_KEY is available
        if not GOOGLE_API_KEY:
            logger.error("GOOGLE_API_KEY is not configured.")
            return Response({"error": "AI service configuration error."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        ai_response_content = _call_gemini_api_with_history(gemini_prompt_history, GOOGLE_API_KEY)

        # 4. Save AI's message
        ai_message = Message.objects.create(
            chat=chat_session,
            sender='ai',
            content=ai_response_content
        )
        ai_message_serializer = MessageSerializer(ai_message)

        # 5. Update chat session's updated_at timestamp and try to set title if it's the first user message
        chat_session.save() # This will trigger updated_at and also title logic in Chat.save()

        return Response({
            "user_message": user_message_serializer.data,
            "ai_message": ai_message_serializer.data
        }, status=status.HTTP_201_CREATED)


# --- Existing TextToSpeech Views ---
# Path to the local "freelimit.mp3" file
FREELIMIT_MP3_PATH = os.path.join(settings.BASE_DIR, "base", "static", "freelimit.mp3") # Make sure this path is correct
MAX_TTS_REQUESTS = 4 # Example limit

def handle_tts_usage_limit(request):
    user = request.user
    if user.is_superuser:
        return None

    cache_key = f"tts_usage_count_{user.id}"
    current_usage = cache.get(cache_key, 0)

    if current_usage >= MAX_TTS_REQUESTS:
        logger.warning(f"User {user.username} exceeded the TTS usage limit.")
        if not os.path.exists(FREELIMIT_MP3_PATH):
            logger.error(f"CRITICAL: freelimit.mp3 not found at {FREELIMIT_MP3_PATH}")
            return JsonResponse({"error": "Usage limit audio feedback is unavailable."}, status=500)
        try:
            return FileResponse(open(FREELIMIT_MP3_PATH, "rb"), as_attachment=True, filename="freelimit.mp3")
        except Exception as e:
            logger.error(f"Error serving freelimit.mp3: {e}")
            return JsonResponse({"error": "Error providing usage limit feedback."}, status=500)

    cache.set(cache_key, current_usage + 1, timeout=None) # Persists, or set a timeout (e.g., 24*60*60 for daily)
    return None

class TextToSpeechView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        limit_response = handle_tts_usage_limit(request)
        if limit_response:
            return limit_response

        text = request.data.get("text")
        if not text:
            return JsonResponse({"error": "Text is required"}, status=400)
        if not ELABS_API_KEY or not VOICE_ID:
            logger.error("ElevenLabs API Key or Voice ID is not configured.")
            return JsonResponse({"error": "TTS service configuration error."}, status=500)

        url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
        headers = {"xi-api-key": ELABS_API_KEY, "Content-Type": "application/json", "Accept": "audio/mpeg"}
        data = {"text": text, "model_id": "eleven_multilingual_v2", "voice_settings": {"stability": 0.5, "similarity_boost": 0.5}}

        try:
            response = requests.post(url, json=data, headers=headers, stream=True, timeout=20)
            response.raise_for_status()
            # Using StreamingHttpResponse is generally better for audio files
            return StreamingHttpResponse(response.iter_content(chunk_size=8192), content_type="audio/mpeg")
        except requests.exceptions.HTTPError as http_err:
            logger.error(f"ElevenLabs HTTP error: {http_err} - {response.text}")
            return JsonResponse({"error": f"TTS service error: {http_err}"}, status=response.status_code)
        except Exception as e:
            logger.error(f"Error generating audio with ElevenLabs: {e}")
            return JsonResponse({"error": "Error generating the audio"}, status=500)

class SlowTextToSpeechView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        limit_response = handle_tts_usage_limit(request)
        if limit_response:
            return limit_response

        text = request.data.get("text")
        if not text:
            return JsonResponse({"error": "Text is required"}, status=400)
        if not ELABS_API_KEY or not VOICE_ID:
            logger.error("ElevenLabs API Key or Voice ID is not configured.")
            return JsonResponse({"error": "TTS service configuration error."}, status=500)

        url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}"
        headers = {"xi-api-key": ELABS_API_KEY, "Content-Type": "application/json", "Accept": "audio/mpeg"}
        data = {"text": text, "model_id": "eleven_multilingual_v2", "voice_settings": {"stability": 0.3, "similarity_boost": 0.5, "style": 0.5, "use_speaker_boost": False, "speed": 0.7}}

        try:
            response = requests.post(url, json=data, headers=headers, stream=True, timeout=20)
            response.raise_for_status()
            return StreamingHttpResponse(response.iter_content(chunk_size=8192), content_type="audio/mpeg")
        except requests.exceptions.HTTPError as http_err:
            logger.error(f"Slow TTS ElevenLabs HTTP error: {http_err} - {response.text}")
            return JsonResponse({"error": f"TTS service error: {http_err}"}, status=response.status_code)
        except Exception as e:
            logger.error(f"Error generating slow audio with ElevenLabs: {e}")
            return JsonResponse({"error": "Error generating the slow audio"}, status=500)


# Remove or comment out the old GeminiView if ChatMessageCreateView replaces its primary function for chat.
# If GeminiView was used for non-chat related Gemini calls, you might need to keep it or refactor its logic.
# class GeminiView(APIView):
# ... your old GeminiView code ...

# Remove or comment out the old ChatHistoryView as its functionality is now covered by
# ChatSessionListCreateView, ChatSessionDetailView, and ChatMessageCreateView.
# class ChatHistoryView(APIView):
# ... your old ChatHistoryView code ...