from .cron_task import calandersetup

def MonthlyCalendarSetupJob():
    calandersetup('all')