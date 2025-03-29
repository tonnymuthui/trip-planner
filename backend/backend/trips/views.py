

# Create your views here.

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Trip, LogEntry
from django.contrib.auth import authenticate
from .serializers import TripSerializer, LogEntrySerializer

from rest_framework.views import APIView
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny
from datetime import date
from django.shortcuts import get_object_or_404
from rest_framework.generics import RetrieveAPIView


class SignupView(APIView):
    permission_classes = [AllowAny]
    def post(self, request):
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        if not username or not email or not password:
            return Response({"error": "All fields are required."}, status=status.HTTP_400_BAD_REQUEST)

        if User.objects.filter(username=username).exists():
            return Response({"error": "Username already exists."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        token, _ = Token.objects.get_or_create(user=user)

        return Response({"message": "User created successfully", "token": token.key}, status=status.HTTP_201_CREATED)

class LoginView(APIView):
    permission_classes = [AllowAny]  # ✅ Allow login without authentication

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)

        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({"message": "Login successful", "token": token.key}, status=status.HTTP_200_OK)

        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)


@api_view(['POST'])

@permission_classes([IsAuthenticated])  
def create_trip(request):
    user = request.user  
    today = date.today()

    # Check if a trip for today already exists for this user
    if Trip.objects.filter(user=user, created_at__date=today).exists():
        return Response({"error": "You have already submitted a trip for today."}, status=status.HTTP_400_BAD_REQUEST)

    # Attach the user to the trip before saving
    request.data['user'] = user.id  # Ensure the user is assigned

    serializer = TripSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(user=user)  # Save trip with user association
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class TripReportView(RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = TripSerializer

    def get(self, request, trip_id):
        try:
            trip = Trip.objects.get(trip_id=trip_id, user=request.user)
        except Trip.DoesNotExist:
            return Response({"error": "Trip not found."}, status=status.HTTP_404_NOT_FOUND)

        log_entries = LogEntry.objects.filter(trip=trip).order_by("start_time")

        log_data = [
            {
                "start_time": log.start_time.isoformat(),
                "end_time": log.end_time.isoformat(),
                "duty_status": log.duty_status,
                "location": log.location,
                "remarks": log.remarks,
            }
            for log in log_entries
        ]

        return Response(
            {
                "trip_details": TripSerializer(trip).data,
                "log_entries": log_data,
            },
            status=status.HTTP_200_OK,
        )

class TripDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, trip_id):
        trip = get_object_or_404(Trip, trip_id=trip_id, user=request.user)
        serializer = TripSerializer(trip)
        return Response(serializer.data, status=status.HTTP_200_OK)

class TripLogsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, trip_id):
        trip = get_object_or_404(Trip, trip_id=trip_id, user=request.user)
        logs = LogEntry.objects.filter(trip=trip)
        serializer = LogEntrySerializer(logs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)