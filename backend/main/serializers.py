# myapp/serializers.py

from rest_framework import serializers
from .models import wakeup_calendar_value, labor_calendar_value

class WakeUpCalendarValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = wakeup_calendar_value
        fields = '__all__'

class LaborCalendarValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = labor_calendar_value
        fields = '__all__'
