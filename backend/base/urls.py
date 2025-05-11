# base/urls.py
from django.urls import path
# from rest_framework_simplejwt.views import TokenRefreshView # If you use refresh tokens explicitly
from .views import (
    MyTokenObtainPairView,
    register,
    # GeminiView, # Consider removing if ChatMessageCreateView replaces its chat function
    TextToSpeechView,
    SlowTextToSpeechView,
    # ChatHistoryView, # This will be replaced by new views
    CategoryListCreateView,
    CategoryDetailView,
    CardSetListCreateView,
    CardSetDetailView,
    CardListCreateView,
    CardDetailView,
    google_login,
    google_register,

    # New Chat views
    ChatSessionListCreateView,
    ChatSessionDetailView,
    ChatMessageCreateView,
)

urlpatterns = [
    # Auth
    path("login/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("register/", register, name="register_user"),
    path("google-login/", google_login, name="google_login"),
    path("google-register/", google_register, name="google_register"),

    # New Chat History Endpoints
    path('chats/', ChatSessionListCreateView.as_view(), name='chat-session-list-create'),
    path('chats/<int:session_id>/', ChatSessionDetailView.as_view(), name='chat-session-detail'),
    path('chats/<int:session_id>/messages/', ChatMessageCreateView.as_view(), name='chat-message-create'),

    # Your existing TTS and Card/Category endpoints
    # path("gemini/", GeminiView.as_view(), name="gemini_view"), # Keep if used for non-chat purposes
    path("text-to-speech/", TextToSpeechView.as_view(), name="text_to_speech_view"),
    path("text-to-speech-slow/", SlowTextToSpeechView.as_view(), name="text_to_speech_slow"),

    path("categories/", CategoryListCreateView.as_view(), name="category-list-create"),
    path("categories/<int:pk>/", CategoryDetailView.as_view(), name="category-detail"),
    path("cardsets/", CardSetListCreateView.as_view(), name="cardset-list-create"),
    path("cardsets/<int:pk>/", CardSetDetailView.as_view(), name="cardset-detail"),
    path("cards/", CardListCreateView.as_view(), name="card-list-create"),
    path("cards/<int:pk>/", CardDetailView.as_view(), name="card-detail"),

    # Remove or comment out old chat history if replaced
    # path("chat-history/", ChatHistoryView.as_view(), name="chat_history"),
]