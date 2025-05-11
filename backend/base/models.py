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

class Chat(models.Model): # This will be our "Chat Session"
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="chats") # related_name is good
    title = models.CharField(max_length=100, blank=True, null=True) # For displaying on /chats page
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) # To sort by recent activity

    def __str__(self):
        return self.title or f"Chat {self.id} with {self.user.username}"

    def save(self, *args, **kwargs):
        # Auto-generate a title from the first message if not set
        if not self.title and self.pk: # Check if instance is saved and has messages
            first_message = self.messages.order_by('timestamp').first()
            if first_message:
                # Take first 5-7 words of the first USER message as title
                if first_message.sender == 'user':
                     self.title = ' '.join(first_message.content.split()[:7])
                     if len(first_message.content.split()) > 7:
                        self.title += "..."
        super().save(*args, **kwargs)

    class Meta:
        ordering = ['-updated_at'] # Show most recently updated chats first

class Message(models.Model):
    chat = models.ForeignKey(Chat, related_name='messages', on_delete=models.CASCADE)
    # Ensure sender choices are clear for user vs. AI
    SENDER_CHOICES = [
        ('user', 'User'),
        ('ai', 'AI'),
    ]
    sender = models.CharField(max_length=10, choices=SENDER_CHOICES) # Changed max_length
    content = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_sender_display()} in Chat {self.chat.id}: {self.content[:30]}"

    class Meta:
        ordering = ['timestamp'] # Messages within a chat should be chronological