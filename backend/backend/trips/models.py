from django.db import models
from django.contrib.auth.models import User
from django.utils.timezone import now

class Trip(models.Model):
    trip_id = models.CharField(max_length=10, unique=True, default="0000")
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)  
    start_location = models.CharField(max_length=255, default="Unknown")
    start_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    start_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    destination = models.CharField(max_length=255, default="Unknown")
    destination_latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    destination_longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    miles_driving_today = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    total_mileage_today = models.DecimalField(max_digits=10, decimal_places=2, default=0.0)
    carrier_name = models.CharField(max_length=255, default="Unknown")
    main_office_address = models.TextField(default="Unknown")
    home_terminal_address = models.TextField(default="Unknown")
    truck_trailer_info = models.TextField(default="Unknown")
    created_at = models.DateTimeField(auto_now_add=True)  # Track submission date
    
    def __str__(self):
        return f"Trip by {self.user.username} on {self.created_at.date()}"

class LogEntry(models.Model):
    trip = models.ForeignKey(Trip, related_name="logs", on_delete=models.CASCADE)
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    duty_status = models.CharField(max_length=50)
    location = models.CharField(max_length=255, blank=True, null=True)
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    remarks = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.duty_status} ({self.start_time} - {self.end_time})"
