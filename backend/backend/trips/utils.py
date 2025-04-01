
import requests
import time
from decimal import Decimal

def geocode_location(location_text):
    """
    Geocode a location string to (latitude, longitude) using Nominatim API
    """
    if not location_text or location_text.lower() == 'unknown':
        return None, None
        
    try:
        
        time.sleep(1)
        
        
        response = requests.get(
            'https://nominatim.openstreetmap.org/search',
            params={
                'q': location_text,
                'format': 'json',
                'limit': 1
            },
            headers={'User-Agent': 'YourAppName'}
        )
        
        data = response.json()
        
        if data and len(data) > 0:
            lat = Decimal(data[0]['lat'])
            lon = Decimal(data[0]['lon'])
            return lat, lon
            
    except Exception as e:
        print(f"Geocoding error for '{location_text}': {str(e)}")
    
    return None, None



from django.db.models.signals import pre_save
from django.dispatch import receiver
from .models import Trip, LogEntry

@receiver(pre_save, sender=Trip)
def geocode_trip_locations(sender, instance, **kwargs):
    """Geocode trip start and destination locations if needed"""
    
    if not instance.start_latitude or not instance.start_longitude:
        lat, lon = geocode_location(instance.start_location)
        if lat and lon:
            instance.start_latitude = lat
            instance.start_longitude = lon
    
    if not instance.destination_latitude or not instance.destination_longitude:
        lat, lon = geocode_location(instance.destination)
        if lat and lon:
            instance.destination_latitude = lat
            instance.destination_longitude = lon

@receiver(pre_save, sender=LogEntry)
def geocode_log_locations(sender, instance, **kwargs):
    """Geocode log entry locations if needed"""
    if instance.location and (not instance.latitude or not instance.longitude):
        lat, lon = geocode_location(instance.location)
        if lat and lon:
            instance.latitude = lat
            instance.longitude = lon