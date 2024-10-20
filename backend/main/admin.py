from django.contrib import admin
from .models import wakeup_calendar_value, labor_calendar_value

# Register your models here.
admin.site.register(wakeup_calendar_value)
admin.site.register(labor_calendar_value)