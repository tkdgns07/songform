# Generated by Django 5.1 on 2024-10-06 23:41

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0001_initial'),
    ]

    operations = [
        migrations.RenameModel(
            old_name='calendar_value',
            new_name='labor_calendar_value',
        ),
    ]