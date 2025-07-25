from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Category, CardSet,Chat, Card, Message
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer


class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'color', 'user']
        extra_kwargs = {'user': {'read_only': True}}  # Ensures user is auto-assigned


class CardSetSerializer(serializers.ModelSerializer):
    class Meta:
        model = CardSet
        fields = ["id", "name", "description", "category", "user"]
        extra_kwargs = {'user': {'read_only': True}}  # Ensures user is auto-assigned



class CardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Card
        fields = [
            "id",
            "card_set",
            "term",
            "term_image",
            "definition",
            "definition_image",
        ]
        extra_kwargs = {'user': {'read_only': True}}  # Ensures user is auto-assigned



class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ["id", "sender", "content", "timestamp"]

class ChatSessionListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chat
        fields = ['id', 'title', 'user', 'created_at', 'updated_at']
        read_only_fields = ['user'] # User will be set from request

class ChatSessionDetailSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True) # Nested messages

    class Meta:
        model = Chat
        fields = ['id', 'title', 'user', 'created_at', 'updated_at', 'messages']
        read_only_fields = ['user']
        
class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True, required=True, style={"input_type": "password"}
    )
    confirm_password = serializers.CharField(
        write_only=True, required=True, style={"input_type": "password"}
    )

    class Meta:
        model = User
        fields = ["username", "email", "password", "confirm_password"]

    def validate(self, data):
        if data["password"] != data["confirm_password"]:
            raise serializers.ValidationError("Passwords do not match.")

        if User.objects.filter(username=data["username"]).exists():
            raise serializers.ValidationError("Username already exists.")

        if User.objects.filter(email=data["email"]).exists():
            raise serializers.ValidationError("Email already exists.")

        return data

    def create(self, validated_data):
        validated_data.pop(
            "confirm_password"
        )  # Remove confirm_password before creating the user
        user = User.objects.create_user(**validated_data)
        return user
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)  # Get the default token data
        data.pop('refresh', None)  # Remove refresh token safely
        return data