# waterlogged/serializers.py

from rest_framework import serializers
from .models import Image, Profile
from django.contrib.auth.models import User
from .metadata_capture import get_exif, get_geotagging, get_metadata

class ImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Image
        fields = '__all__'

        def create(self, validate_data):
            return Image.objects.create(**validate_data)

        def update(self, instance, validate_data):
            instance.blob_name = validate_data.get('blob_name', instance.blob_name)
            instance.flood_date = validate_data.get('flood_date', instance.flood_date)
            instance.pre_post = validate_data.get('pre_post', instance.pre_post)
            instance.longitude = validate_data.get('longitude', instance.longitude)
            instance.latitude = validate_data.get('latitude', instance.latitude)
            instance.address = validate_data.get('address', instance.address)
            instance.user_uploaded = validate_data.get('user_uploaded', instance.user_uploaded)
            instance.approved_by_admin = validate_data.get('approved_by_admin', instance.approved_by_admin)
            instance.pair_approved_by_admin = validate_data.get('pair_approved_by_admin', instance.pair_approved_by_admin)
            instance.flood_height = validate_data.get('flood_height', instance.flood_height)
            instance.source = validate_data.get('source', instance.source)
            instance.user_id_of_upload = validate_data.get('user_id_of_upload', instance.user_id_of_upload)
            instance.Maps_URL = validate_data.get('Maps_URL', instance.Maps_URL)


            instance.save()
            return instance

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username')

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('id', 'phone_number', 'is_admin', 'user')

    def update_profile(self, profile, data):

        if "username" in data:
            profile.user.username = data["username"]
        
        if "phone_number" in data:
            profile.phone_number = data["phone_number"]

        if "is_admin" in data:
            profile.is_admin = data["is_admin"]

        if "password" in data:
            profile.user.set_password(data["password"])

        if "approved_by_admin" in data:
            profile.approved_by_admin = data["approved_by_admin"]
        
        if "banned" in data:
            profile.banned = data["banned"]

        profile.user.save()
        profile.save()

        return profile

    def create_object(self, username, password, phone_number, is_admin, approved_by_admin):
        user = User.objects.create_user(username = username, password=password)
        return Profile.objects.create(phone_number=phone_number, is_admin=is_admin,approved_by_admin=approved_by_admin, user=user)

