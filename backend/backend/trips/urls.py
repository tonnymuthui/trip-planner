from django.urls import path
from .views import create_trip

urlpatterns = [
    path('create_trip/', create_trip, name='create_trip'),
]