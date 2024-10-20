from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import wakeup_calendar_value, labor_calendar_value
from .serializers import WakeUpCalendarValueSerializer, LaborCalendarValueSerializer
from django.shortcuts import render
from .cron_task import calandersetup

class CalendarValueViewSet(viewsets.ModelViewSet):
    queryset = wakeup_calendar_value.objects.all()
    serializer_class = WakeUpCalendarValueSerializer
    
    @action(detail=False, methods=['get'], url_path='wakeup')
    def render_wabor(self, request):
        all_entries = wakeup_calendar_value.objects.all()
        
        serializer = WakeUpCalendarValueSerializer(all_entries, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    

    @action(detail=False, methods=['post'], url_path='update-wcalendar')
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

    @action(detail=False, methods=['delete'], url_path='delete-wcalendar')
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

    @action(detail=False, methods=['get'], url_path='labor')
    def render_labor(self, request):
        all_entries = labor_calendar_value.objects.all()
        
        serializer = LaborCalendarValueSerializer(all_entries, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    @action(detail=False, methods=['post'], url_path='update-lcalendar')
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

    @action(detail=False, methods=['delete'], url_path='delete-lcalendar')
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
