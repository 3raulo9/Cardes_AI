from django.db import models
from django.contrib.auth.models import User

class Category(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="categories")  # Ensures categories belong to a user
    name = models.CharField(max_length=255)
    color = models.CharField(max_length=7, default="#FFFFFF")  # HEX color format

    def __str__(self):
        return self.name

class CardSet(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="cardsets")  # Ensures card sets belong to a user
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, null=True)
    category = models.ForeignKey(
        Category, on_delete=models.CASCADE, related_name="sets", null=True, blank=True
    )  # 🛠️ Changed to CASCADE so deleting a category deletes all related sets

    def __str__(self):
        return self.name

class Card(models.Model):
    card_set = models.ForeignKey(
        CardSet, related_name="cards", on_delete=models.CASCADE
    )  # 🛠️ Ensured deleting a set deletes all its cards
    term = models.CharField(max_length=255)
    term_image = models.ImageField(upload_to="cards/images/", null=True, blank=True)
    definition = models.TextField()
    definition_image = models.ImageField(upload_to="cards/images/", null=True, blank=True)

    def __str__(self):
        return self.term

class Chat(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

class Message(models.Model):
    chat = models.ForeignKey(Chat, related_name='messages', on_delete=models.CASCADE)
    sender = models.CharField(max_length=50)  # 'user' or 'system'
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
