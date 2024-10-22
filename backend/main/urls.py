# urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import WakeUpCalendarValueViewSet, GetStudentInfo, LaborCalendarValueViewSet

router = DefaultRouter()
router.register(r'student-values', GetStudentInfo, basename='student')
router.register(r'wcalendar-values', WakeUpCalendarValueViewSet, basename='wcalendar')
router.register(r'lcalendar-values', LaborCalendarValueViewSet, basename='lcalendar')

urlpatterns = [
    path('', include(router.urls)),  # 라우터가 모든 등록된 뷰셋의 URL을 자동으로 매핑
]
