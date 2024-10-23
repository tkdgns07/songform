import datetime
import calendar
from .models import wakeup_calendar_value, labor_calendar_value

def calandersetup():
    today = datetime.datetime.now()

    current_year = today.year
    current_month = today.month
    
    last_year = current_year - 1 if current_month == 1 else current_year
    last_month = 12 if current_month == 1 else current_month - 1

    next_year = current_year + 1 if current_month == 12 else current_year
    next_month = 1 if current_month == 12 else current_month + 1
    
    
    wakeup_calendar_value.objects.filter(year=last_year, month=last_month).delete()
    makecalendar(next_year, next_month, wakeup_calendar_value)

def makecalendar(current_year, current_month, model):
    start_weekday, vaild_day = calendar.monthrange(current_year, current_month)
        
    start_weekday += 1
    
    days = start_weekday + vaild_day
    
    while start_weekday != 0:
        day_record = model(year = current_year, month = current_month, day = 0)
        day_record.save()
        start_weekday -= 1
    
    for day in range(1, vaild_day+1):
        day_record = model(year = current_year, month = current_month, day = day)
        day_record.save()
        
    if days > 35:
        for i in range(43-days):
            day_record = model(year = current_year, month = current_month, day = 0)
            day_record.save()
    else:
        for i in range(35-days):
            day_record = model(year = current_year, month = current_month, day = 0)
            day_record.save()