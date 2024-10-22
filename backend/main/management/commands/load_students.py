import csv
from django.core.management.base import BaseCommand
from main.models import studentInfo

class Command(BaseCommand):
    help = 'Load student data from CSV file into the database'

    def handle(self, *args, **kwargs):
        with open('/Users/sanghun/Documents/wakechan/backend/main/management/commands/students_info.csv', newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                student_id = row['id']
                student, created = studentInfo.objects.update_or_create(
                    id=student_id,
                    defaults={
                        'name': row['name'],
                        'grade': int(row['grade']),
                        'birthday': row['birthday'] if row['birthday'] else None,
                    }
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f"Student {student_id} created."))
                else:
                    self.stdout.write(self.style.SUCCESS(f"Student {student_id} updated."))