from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import wakeup_calendar_value, labor_calendar_value, studentInfo
from .serializers import WakeUpCalendarValueSerializer, LaborCalendarValueSerializer, StudentInfoSerializer
from django.shortcuts import render
from .cron_task import calandersetup

class WakeUpCalendarValueViewSet(viewsets.ModelViewSet):
    queryset = wakeup_calendar_value.objects.all()  # 기본 쿼리셋 정의
    serializer_class = WakeUpCalendarValueSerializer
    
    @action(detail=False, methods=['get'], url_path='get')
    def render_wabor(self, request):
        all_entries = wakeup_calendar_value.objects.all()
        
        serializer = WakeUpCalendarValueSerializer(all_entries, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    @action(detail=False, methods=['post'], url_path='update-calendar')
    def update_wcalendar_value(self, request):
        year = request.data.get('year')
        month = request.data.get('month')
        day = request.data.get('day')
        
        try:
            calendar_entry = wakeup_calendar_value.objects.get(year=year, month=month, day=day)
        except wakeup_calendar_value.DoesNotExist:
            return Response({'error': 'Calendar entry not found.', 'request_data': request.data}, status=status.HTTP_404_NOT_FOUND)

        serializer = WakeUpCalendarValueSerializer(calendar_entry, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'errors': serializer.errors, 'request_data': request.data}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['delete'], url_path='delete-calendar')
    def delete_wcalendar_value(self, request):
        year = request.data.get('year')
        month = request.data.get('month')
        day = request.data.get('day')
        
        try:
            calendar_entry = wakeup_calendar_value.objects.get(year=year, month=month, day=day)
        except wakeup_calendar_value.DoesNotExist:
            return Response({'error': 'Calendar entry not found.', 'request_data': request.data}, status=status.HTTP_404_NOT_FOUND)
        
        calendar_entry.student = 'None'
        calendar_entry.music_url = 'None'
        calendar_entry.save()
        
        return Response({'message': 'Calendar entry updated successfully.'}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], url_path='update-ncalendar')
    def update_wcalendar_value(self, request):
        year = request.data.get('year')
        month = request.data.get('month')
        day = request.data.get('day')
        
        try:
            calendar_entry = wakeup_calendar_value.objects.get(year=year, month=month, day=day)
        except wakeup_calendar_value.DoesNotExist:
            return Response({'error': 'Calendar entry not found.', 'request_data': request.data}, status=status.HTTP_404_NOT_FOUND)

        serializer = WakeUpCalendarValueSerializer(calendar_entry, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'errors': serializer.errors, 'request_data': request.data}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['delete'], url_path='delete-ncalendar')
    def delete_wcalendar_value(self, request):
        year = request.data.get('year')
        month = request.data.get('month')
        day = request.data.get('day')
        
        try:
            calendar_entry = wakeup_calendar_value.objects.get(year=year, month=month, day=day)
        except wakeup_calendar_value.DoesNotExist:
            return Response({'error': 'Calendar entry not found.', 'request_data': request.data}, status=status.HTTP_404_NOT_FOUND)
        
        calendar_entry.student = 'None'
        calendar_entry.music_url = 'None'
        calendar_entry.save()
        
        return Response({'message': 'Calendar entry updated successfully.'}, status=status.HTTP_200_OK)
class LaborCalendarValueViewSet(viewsets.ModelViewSet):
    queryset = labor_calendar_value.objects.all()  # 기본 쿼리셋 정의
    serializer_class = LaborCalendarValueSerializer

    @action(detail=False, methods=['get'], url_path='get')
    def render_labor(self, request):
        all_entries = labor_calendar_value.objects.all()
        
        serializer = LaborCalendarValueSerializer(all_entries, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], url_path='update-calendar')
    def update_lcalendar_value(self, request):
        year = request.data.get('year')
        month = request.data.get('month')
        day = request.data.get('day')
        
        try:
            calendar_entry = labor_calendar_value.objects.get(year=year, month=month, day=day)
        except labor_calendar_value.DoesNotExist:
            return Response({'error': 'Calendar entry not found.', 'request_data': request.data}, status=status.HTTP_404_NOT_FOUND)

        serializer = LaborCalendarValueSerializer(calendar_entry, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'errors': serializer.errors, 'request_data': request.data}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['delete'], url_path='delete-calendar')
    def delete_lcalendar_value(self, request):
        year = request.data.get('year')
        month = request.data.get('month')
        day = request.data.get('day')
        
        try:
            calendar_entry = labor_calendar_value.objects.get(year=year, month=month, day=day)
        except labor_calendar_value.DoesNotExist:
            return Response({'error': 'Calendar entry not found.', 'request_data': request.data}, status=status.HTTP_404_NOT_FOUND)
        
        calendar_entry.student = 'None'
        calendar_entry.music_url = 'None'
        calendar_entry.save()
        
        return Response({'message': 'Calendar entry updated successfully.'}, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], url_path='update-ncalendar')
    def update_lcalendar_value(self, request):
        year = request.data.get('year')
        month = request.data.get('month')
        day = request.data.get('day')
        
        try:
            calendar_entry = labor_calendar_value.objects.get(year=year, month=month, day=day)
        except labor_calendar_value.DoesNotExist:
            return Response({'error': 'Calendar entry not found.', 'request_data': request.data}, status=status.HTTP_404_NOT_FOUND)

        serializer = LaborCalendarValueSerializer(calendar_entry, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response({'errors': serializer.errors, 'request_data': request.data}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['delete'], url_path='delete-ncalendar')
    def delete_lcalendar_value(self, request):
        year = request.data.get('year')
        month = request.data.get('month')
        day = request.data.get('day')
        
        try:
            calendar_entry = labor_calendar_value.objects.get(year=year, month=month, day=day)
        except labor_calendar_value.DoesNotExist:
            return Response({'error': 'Calendar entry not found.', 'request_data': request.data}, status=status.HTTP_404_NOT_FOUND)
        
        calendar_entry.student = 'None'
        calendar_entry.music_url = 'None'
        calendar_entry.save()
        
        return Response({'message': 'Calendar entry updated successfully.'}, status=status.HTTP_200_OK)


class GetStudentInfo(viewsets.ModelViewSet):
    serializer_class = StudentInfoSerializer
    
    @action(detail=False, methods=['post'], url_path='get-student')
    def get_student(self, request):
        student_id = request.data.get('id', None)  # request에서 'id'를 가져옴
        
        if student_id is None:
            return Response({'error': 'ID parameter is missing'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Django ORM을 사용하여 학생 정보를 조회
            student = studentInfo.objects.get(id=student_id)
        except studentInfo.DoesNotExist:
            return Response({'error': 'Student not found', 'id': student_id}, status=status.HTTP_404_NOT_FOUND)
        
        # Serializer로 학생 정보 직렬화
        serializer = StudentInfoSerializer(student)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @action(detail=False, methods=['post'], url_path='update-student')
    def update_student(self, request):
        student_id = request.data.get('id', None)
        new_birthday = request.data.get('birthday', None)
        
        if student_id is None or new_birthday is None:
            return Response({'error': 'ID and birthday fields are required'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            # Django ORM을 사용하여 학생을 조회
            student = studentInfo.objects.get(id=student_id)
        except studentInfo.DoesNotExist:
            return Response({'error': 'Student not found', 'id': student_id}, status=status.HTTP_404_NOT_FOUND)
        
        # birthday 값을 업데이트하고, Serializer를 사용하여 데이터 검증 후 저장
        serializer = StudentInfoSerializer(student, data={'birthday': new_birthday}, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


def render4test_wakeup(request):
    calandersetup('wakeup')
    render_value = wakeup_calendar_value.objects.all()
    result = {'result': render_value}
    return render(request, 'home.html', result)

def render4test_labor(request):
    calandersetup('labor')
    render_value = labor_calendar_value.objects.all()
    result = {'result': render_value}
    return render(request, 'home.html', result)
