# waterlogged/models.py
from django.db import models
from datetime import datetime
from django.contrib.auth.models import User
from .metadata_capture import get_exif, get_geotagging, get_metadata

# Create your models here.
class Image(models.Model):
    flood_date = models.DateTimeField(default = datetime.now, blank = True)
    pre_post = models.BooleanField(default = True) #True is for post, False is for pre
    longitude = models.FloatField(default = 0.0)
    latitude = models.FloatField(default = 0.0)
    address = models.CharField(max_length = 300, default = '')
    user_uploaded = models.IntegerField(default = 0)
    pair_index = models.IntegerField(default = 0)
    approved_by_admin = models.BooleanField(default = False)
    pair_approved_by_admin = models.BooleanField(default = False)
    flood_height = models.FloatField(default = 0.0)
    source = models.CharField(max_length = 300, default = '')
    pair_attempted = models.BooleanField(default = False) 
    blob_name = models.CharField(max_length = 300, default = '')
    user_id_of_upload = models.IntegerField(default = 0)
    Maps_URL = models.CharField(max_length = 300, default = '')

    def _str_(self):
        return self.id

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    phone_number = models.CharField(max_length = 11, default = '', unique=True)
    is_admin = models.BooleanField(default = False)
    approved_by_admin = models.BooleanField(default = False)
    banned = models.BooleanField(default = False)

    def _str_(self):
        return self.id
