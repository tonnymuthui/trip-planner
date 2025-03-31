"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin

from django.http import HttpResponse
from django.urls import path, include
# from rest_framework.routers import DefaultRouter
from trips.views import SignupView, LoginView, TripViewSet, LogEntryViewSet  
from rest_framework_simplejwt.views import (
    TokenObtainPairView,  
    TokenRefreshView, 
    TokenVerifyView,
)

# router = DefaultRouter()
# router.register(r'trips', TripViewSet)
# router.register(r'logentries', LogEntryViewSet)

def home(request):
    return HttpResponse("Welcome to the Trip Planner API!")

urlpatterns = [
    path("", home),
    path('admin/', admin.site.urls),
    path('api/signup/', SignupView.as_view(), name='signup'),
    path('api/login/', LoginView.as_view(), name='login'), 
    path('auth/', include('dj_rest_auth.urls')), 
    path('auth/registration/', include('dj_rest_auth.registration.urls')),
    path('api/', include('trips.urls')),
    # path('api/', include(router.urls)),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    # path('api/auth/', include('rest_auth.urls')),
]