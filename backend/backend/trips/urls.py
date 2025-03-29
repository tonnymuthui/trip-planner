from django.urls import path
from .views import create_trip, TripReportView, TripLogsView

urlpatterns = [
    path('create_trip/', create_trip, name='create_trip'),
    path('trips/<str:trip_id>/report/', TripReportView.as_view(), name='trip_report'), 
    path('trips/<str:trip_id>/logs/', TripLogsView.as_view(), name='trip_logs'),
]