from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

# Simple homepage response
def home(request):
    return JsonResponse({"message": "Welcome to Cardes AI Backend!"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('base.urls')),
    path('', home),  # ✅ Add this line for root route
]
