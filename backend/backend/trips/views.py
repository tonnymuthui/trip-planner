

# Create your views here.

from rest_framework.decorators import api_view, permission_classes, action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status, viewsets, generics
from .models import Trip, LogEntry
from django.contrib.auth import authenticate
from .serializers import TripSerializer, LogEntrySerializer, TripDetailSerializer
from rest_framework_simplejwt.tokens import RefreshToken
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
            refresh = RefreshToken.for_user(user)  # ✅ Generate JWT tokens correctly
            return Response({
                "message": "Login successful",
                "authToken": str(refresh.access_token),  
                "refreshToken": str(refresh),
            }, status=status.HTTP_200_OK)

        return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_trip(request):
    print("=== DEBUGGING create_trip ===")
    print("Incoming data:", request.data)

    user = request.user  
    today = date.today()

    # Check if a trip already exists for today
    existing_trip = Trip.objects.filter(user=user, created_at__date=today).first()

    if existing_trip:
        print("Trip exists. Updating instead of creating a new one.")
        serializer = TripSerializer(existing_trip, data=request.data, partial=True)  # Allow partial updates
    else:
        serializer = TripSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(user=user)
        return Response(serializer.data, status=status.HTTP_200_OK if existing_trip else status.HTTP_201_CREATED)

    print(" VALIDATION ERRORS:", serializer.errors)
    return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)





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
        print("Received trip logs data:", request.data)  # Debugging
        trip = get_object_or_404(Trip, trip_id=trip_id, user=request.user)
        logs = LogEntry.objects.filter(trip=trip)
        serializer = LogEntrySerializer(logs, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, trip_id):  # 🚀 ADDING POST METHOD
        trip = get_object_or_404(Trip, trip_id=trip_id, user=request.user)
        print("Incoming data:", request.data)
        
        log_data = request.data  # Ensure this is a list of dictionaries

        # Iterate over each log entry and update the trip field
        for log in log_data:
            log["trip"] = trip.id # ✅ Correct way to assign trip ID to each log entry

        serializer = LogEntrySerializer(data=log_data, many=True)  # ✅ `many=True` is needed!

        if serializer.is_valid():
            serializer.save()  # Save all logs at once
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        
        print("Validation errors:", serializer.errors)  # Debugging
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        
class TripViewSet(viewsets.ModelViewSet):
    queryset = Trip.objects.all()
    serializer_class = TripSerializer
    lookup_field = 'trip_id'  # Use trip_id instead of id for lookups
    
    def get_serializer_class(self):
        if self.action == 'retrieve':
            return TripDetailSerializer
        return TripSerializer
    
    # Optional: Filter trips by the current user
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            return Trip.objects.filter(user=user).order_by('-created_at')
        return Trip.objects.none()
    
    @action(detail=True, methods=['get'], url_path='logs')
    def get_logs(self, request, trip_id=None):
        """Get all log entries for a specific trip using trip_id"""
        trip = self.get_object()  # This will use trip_id for lookup
        logs = LogEntry.objects.filter(trip=trip).order_by('start_time')
        serializer = LogEntrySerializer(logs, many=True)
        return Response(serializer.data)

class LogEntryViewSet(viewsets.ModelViewSet):
    queryset = LogEntry.objects.all()
    serializer_class = LogEntrySerializer
    
    # Filter log entries by trip_id
    def get_queryset(self):
        queryset = LogEntry.objects.all().order_by('start_time')
        trip_id = self.request.query_params.get('trip_id', None)
        if trip_id:
            queryset = queryset.filter(trip__trip_id=trip_id)  # Note the trip__trip_id syntax
        return queryset