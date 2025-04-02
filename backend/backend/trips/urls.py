from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import create_trip, TripReportView, TripLogsView, TripViewSet, LogEntryViewSet, UserInfoView, ComplianceSummaryView
from .utils import geocode_location

router = DefaultRouter()
router.register(r'trips', TripViewSet)
router.register(r'logentries', LogEntryViewSet)

urlpatterns = [
    path('create_trip/', create_trip, name='create_trip'),
    path('', include(router.urls)),
    path("geocode/", geocode_location, name="geocode"),
    
    path('trips/<str:trip_id>/report/', TripReportView.as_view(), name='trip_report'), 
    path('trip-logs/<str:trip_id>/logs/', TripLogsView.as_view(), name='trip_logs'),
    path('user/', UserInfoView.as_view(), name='user_info'),
    path('compliance-summary/', ComplianceSummaryView.as_view(), name='compliance_summary')
]