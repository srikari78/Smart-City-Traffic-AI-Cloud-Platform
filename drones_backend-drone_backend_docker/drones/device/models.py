from django.db import models

# Create your models here.
class Device(models.Model):
    id = models.AutoField(primary_key=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    timestamp = models.DateTimeField(auto_now=True)
    altitude = models.FloatField()
    dist_id = models.CharField(max_length=12)
    video_url = models.URLField(blank=True, null=True)  
    status = models.CharField(max_length=15)

    
    class Meta:
        db_table = 'drones'