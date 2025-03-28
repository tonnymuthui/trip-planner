# Generated by Django 5.1.7 on 2025-03-28 01:04

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('trips', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveField(
            model_name='trip',
            name='current_cycle_hours',
        ),
        migrations.RemoveField(
            model_name='trip',
            name='current_location',
        ),
        migrations.RemoveField(
            model_name='trip',
            name='dropoff_location',
        ),
        migrations.RemoveField(
            model_name='trip',
            name='pickup_location',
        ),
        migrations.AddField(
            model_name='trip',
            name='carrier_name',
            field=models.CharField(default='Unknown', max_length=255),
        ),
        migrations.AddField(
            model_name='trip',
            name='destination',
            field=models.CharField(default='Unknown', max_length=255),
        ),
        migrations.AddField(
            model_name='trip',
            name='home_terminal_address',
            field=models.TextField(default='Unknown'),
        ),
        migrations.AddField(
            model_name='trip',
            name='main_office_address',
            field=models.TextField(default='Unknown'),
        ),
        migrations.AddField(
            model_name='trip',
            name='miles_driving_today',
            field=models.DecimalField(decimal_places=2, default='0.0', max_digits=10),
        ),
        migrations.AddField(
            model_name='trip',
            name='start_location',
            field=models.CharField(default='Unknown', max_length=255),
        ),
        migrations.AddField(
            model_name='trip',
            name='total_mileage_today',
            field=models.DecimalField(decimal_places=2, default='0.0', max_digits=10),
        ),
        migrations.AddField(
            model_name='trip',
            name='trip_id',
            field=models.CharField(default='Unknown', max_length=4, unique=True),
        ),
        migrations.AddField(
            model_name='trip',
            name='truck_trailer_info',
            field=models.TextField(default='Unknown'),
        ),
        migrations.AddField(
            model_name='trip',
            name='user',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.CreateModel(
            name='LogEntry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('start_time', models.DateTimeField()),
                ('end_time', models.DateTimeField()),
                ('duty_status', models.CharField(max_length=50)),
                ('location', models.CharField(blank=True, max_length=255, null=True)),
                ('remarks', models.TextField(blank=True, null=True)),
                ('trip', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='logs', to='trips.trip')),
            ],
        ),
    ]
