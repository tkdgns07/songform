import datetime
import calendar
from .models import wakeup_calendar_value, labor_calendar_value

def calandersetup(model):
    today = datetime.datetime.now()
    
    current_year = today.year
    current_month = today.month
    
    next_year = current_year + 1 if current_month == 12 else current_year
    next_month = 1 if current_month == 12 else current_month + 1
    
    if model == 'wakeup':
        wakeup_calendar_value.objects.all().delete()
        makecalendar(current_year, current_month, wakeup_calendar_value)
        makecalendar(next_year, next_month, wakeup_calendar_value)

    elif model == 'labor':
        labor_calendar_value.objects.all().delete()
        makecalendar(current_year, current_month, labor_calendar_value)
        makecalendar(next_year, next_month,labor_calendar_value)
    
    elif model == 'all':
        wakeup_calendar_value.objects.all().delete()
        makecalendar(current_year, current_month, wakeup_calendar_value)
        makecalendar(next_year, next_month, wakeup_calendar_value)
        
        labor_calendar_value.objects.all().delete()
        makecalendar(current_year, current_month, labor_calendar_value)
        makecalendar(next_year, next_month,labor_calendar_value)





def makecalendar(current_year, current_month, model):
    start_weekday1, vaild_day = calendar.monthrange(current_year, current_month)
    
    weekdays = [1, 2, 3, 4, 5, 6, 0]
    
    start_weekday = weekdays[start_weekday1]
    
    days = start_weekday + vaild_day + 1
    
    while start_weekday != 0:
        day_record = model(year = current_year, month = current_month, day = 0)
        day_record.save()
        start_weekday -= 1
    
    for day in range(1, vaild_day+1):
        day_record = model(year = current_year, month = current_month, day = day)
        day_record.save()
        
    if days >= 35:
        for i in range(43-days):
            day_record = model(year = current_year, month = current_month, day = 0)
            day_record.save()
    else:
        for i in range(36-days):
            day_record = model(year = current_year, month = current_month, day = 0)
            day_record.save()