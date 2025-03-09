# base/urls.py
from django.urls import path, include
from rest_framework_simplejwt.views import TokenRefreshView
from .views import *
from .views import (
    CategoryListCreateView,
    CategoryDetailView,
    CardSetListCreateView,
    CardSetDetailView,
    CardListCreateView,
    CardDetailView,
)

urlpatterns = [
    # JWT token authentication
    path("login/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    # Custom views
    path("register/", register, name="register_user"),
    path("gemini/", GeminiView.as_view(), name="gemini_view"),
    path("text-to-speech/", TextToSpeechView.as_view(), name="text_to_speech_view"),
    path("chat-history/", ChatHistoryView.as_view(), name="chat_history"),
    path("categories/", CategoryListCreateView.as_view(), name="category-list-create"),
    path("categories/<int:pk>/", CategoryDetailView.as_view(), name="category-detail"),
    path(
        "categories/<int:pk>/", CategoryDetailView.as_view(), name="category-detail"
    ),  # 🛠️ DELETE endpoint
    # Card Sets
    path("cardsets/", CardSetListCreateView.as_view(), name="cardset-list-create"),
    path("cardsets/<int:pk>/", CardSetDetailView.as_view(), name="cardset-detail"),
    # Cards
    path("cards/", CardListCreateView.as_view(), name="card-list-create"),
    path("cards/<int:pk>/", CardDetailView.as_view(), name="card-detail"),
    path("google-login/", google_login, name="google_login"),
    path("google-register/", google_register, name="google_register"),

]
