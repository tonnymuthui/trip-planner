from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import create_trip, TripReportView, TripLogsView, TripViewSet, LogEntryViewSet
from .utils import geocode_location

router = DefaultRouter()
router.register(r'trips', TripViewSet)
router.register(r'logentries', LogEntryViewSet)

urlpatterns = [
    path('create_trip/', create_trip, name='create_trip'),
    path('', include(router.urls)),
    path("geocode/", geocode_location, name="geocode"),
    # path('trips/', TripViewSet.as_view({'get': 'list'}), name='trip_view'),
    path('trips/<str:trip_id>/report/', TripReportView.as_view(), name='trip_report'), 
    path('trips/<str:trip_id>/logs/', TripLogsView.as_view(), name='trip_logs'),
]