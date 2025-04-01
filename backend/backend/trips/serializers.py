#serializers
from rest_framework import serializers
from .models import Trip, LogEntry

class TripSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)

    
    class Meta:
        model = Trip
        fields = '__all__'
       


class LogEntrySerializer(serializers.ModelSerializer):
    trip = serializers.PrimaryKeyRelatedField(queryset=Trip.objects.all(), required=True)
    
    class Meta:
        model = LogEntry
        fields = '__all__'

    def create(self, validated_data):
        return super().create(validated_data)


class TripDetailSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)

    logs = LogEntrySerializer(many=True, read_only=True)
    
    class Meta:
        model = Trip
        fields = [
            'id', 'trip_id', 'user', 
            'start_location', 'start_latitude', 'start_longitude',
            'destination', 'destination_latitude', 'destination_longitude',
            'miles_driving_today', 'total_mileage_today', 'carrier_name', 
            'main_office_address', 'home_terminal_address', 
            'truck_trailer_info', 'created_at', 'logs'
        ]