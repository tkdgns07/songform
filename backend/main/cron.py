import datetime
import calendar
from .models import calendar_value

def calandersetup():
    calendar_value.objects.all().delete()
    
    today = datetime.datetime.now()
    
    current_year = today.year
    current_month = today.month
        
    start_weekday1, vaild_day = calendar.monthrange(current_year, current_month)
    
    weekdays = [1, 2, 3, 4, 5, 6, 0]
    
    start_weekday = weekdays[start_weekday1]
    
    days = start_weekday + vaild_day + 1
    
    while start_weekday != 0:
        day_record = calendar_value(year = current_year, month = current_month, day = 0)
        day_record.save()
        start_weekday -= 1
    
    for day in range(1, vaild_day+1):
        day_record = calendar_value(year = current_year, month = current_month, day = day)
        day_record.save()
        
    if days >= 35:
        for i in range(43-days):
            day_record = calendar_value(year = current_year, month = current_month, day = 0)
            day_record.save()
    else:
        for i in range(36-days):
            day_record = calendar_value(year = current_year, month = current_month, day = 0)
            day_record.save()