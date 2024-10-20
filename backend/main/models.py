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
