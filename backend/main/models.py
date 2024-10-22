from django.db import models

# Create your models here.
class wakeup_calendar_value(models.Model):
    year = models.IntegerField()
    month = models.IntegerField()
    day = models.IntegerField()
    student = models.CharField(max_length=10, default='None')
    music_url = models.CharField(max_length=150, default='None')

class labor_calendar_value(models.Model):
    year = models.IntegerField()
    month = models.IntegerField()
    day = models.IntegerField()
    student = models.CharField(max_length=10, default='None')
    music_url = models.CharField(max_length=150, default='None')
    
class studentInfo(models.Model):
    id = models.CharField(max_length=4, primary_key=True)
    name = models.CharField(max_length=100)
    grade = models.IntegerField()
    birthday = models.CharField(max_length=10, blank=True, null=True)