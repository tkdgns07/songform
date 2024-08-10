from django.shortcuts import render
from rest_framework import viewsets
from .models import calendar_value
from .cron import calandersetup
from .serializers import CalendarValueSerializer

class CalendarValueViewSet(viewsets.ModelViewSet):
    queryset = calendar_value.objects.all()
    serializer_class = CalendarValueSerializer

def render4test(request):
    calandersetup()
    render_value = calendar_value.objects.all()
    result = {'result' : render_value}
    return render(request, 'home.html', result)