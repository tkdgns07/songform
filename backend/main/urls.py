from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CalendarValueViewSet

router = DefaultRouter()
router.register(r'calendar-values', CalendarValueViewSet)

urlpatterns = [
    path('', include(router.urls)),
]