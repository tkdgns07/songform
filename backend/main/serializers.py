# myapp/serializers.py

from rest_framework import serializers
from .models import calendar_value

class CalendarValueSerializer(serializers.ModelSerializer):
    class Meta:
        model = calendar_value
        fields = '__all__'
