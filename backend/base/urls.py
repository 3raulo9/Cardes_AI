# base/urls.py
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .views import *

urlpatterns = [
    # JWT token authentication
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),

    # Custom views
    path('register/', register, name='register_user'),
    path('gemini/', GeminiView.as_view(), name='gemini_view'),
    path('text-to-speech/', TextToSpeechView.as_view(), name='text_to_speech_view'),
    path('chat-history/', ChatHistoryView.as_view(), name='chat_history'),
]
