# image/views.py

from rest_framework.response import Response
from rest_framework import generics, status, filters
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from django.core.serializers.json import DjangoJSONEncoder
from django.contrib.auth.models import User
from django.http import HttpResponse, HttpResponseNotFound
from azure.storage.blob import BlobServiceClient, BlobClient, ContainerClient
import json
import os
import google_streetview.api
import random
import secrets
import base64

from .serializers import ImageSerializer, ProfileSerializer, UserSerializer
from .models import Image, Profile

#SendView: sends blob to backend and backend sends blob to azure
#ReceiveView: front end sends request for blob, backend uses request to get blob from azure and sends it to frontend
#Load: front end sends streetview info and backend saves jpg to blob

def sendToBlob(blob, blob_name):
    connect_str = "DefaultEndpointsProtocol=https;AccountName=blupix;AccountKey=8KBz2PiH671bmhUYvjO+iAs1mh+TIx31DVgnGKzygcv8ItnRgyGtewwZkVgS7aaQ8VB6z6qY/Gqh9lTTTkrx/g==;EndpointSuffix=core.windows.net"

    blob_service_client = BlobServiceClient.from_connection_string(connect_str)

    container_client = blob_service_client.get_container_client("blupix-app")

    blob_client = blob_service_client.get_blob_client(container="blupix-app", blob=blob_name)

    blob_client.upload_blob(blob)

    blob_list = container_client.list_blobs()
    for blob in blob_list:
        print("\t" + blob.name)

class SendView(APIView):
    def post(self, request):
        
        try:
            blob = request.data['file']
            blob_name = request.data['blob_name']

            sendToBlob(blob, blob_name)

        except Exception as ex:
            print('Exception:')
            print(ex)
            return Response({"Error": "Problem with SendView"})
        return Response({"blob_name": request.data['blob_name']})

class ReceiveView(APIView):
    def post(self, request):
        connect_str = "DefaultEndpointsProtocol=https;AccountName=blupix;AccountKey=8KBz2PiH671bmhUYvjO+iAs1mh+TIx31DVgnGKzygcv8ItnRgyGtewwZkVgS7aaQ8VB6z6qY/Gqh9lTTTkrx/g==;EndpointSuffix=core.windows.net"

        try:
            blob_service_client = BlobServiceClient.from_connection_string(connect_str)
            blob_client = blob_service_client.get_blob_client(container="blupix-app", blob=request.data['blob_name'])
            blob = blob_client.download_blob()
            return HttpResponse(blob.readall(), content_type="image/jpeg")
        except Exception as ex:
            print('Exception:')
            print(ex)
            return Response({"Error": "Problem with ReceiveView"})

class KeyView(APIView):
    def get(self, request):
        return Response({"key": "AIzaSyD7blO0Y7Z-Jf2rRFyuo2CrQa7kEXRy1po"})

class LoadView(APIView):

    def post(self, request):
        data = request.data

        params = [{
	        'size': data["size"], # max 640x640 pixels
	        'location': data["location"],
	        'heading': data["heading"],
	        'pitch': data["pitch"],
            "fov": data["fov"],
	        'key': "AIzaSyD7blO0Y7Z-Jf2rRFyuo2CrQa7kEXRy1po"
        }]

        # Create a results object
        results = google_streetview.api.results(params)

        image_file = "media/pre_images"
        results.download_links(image_file)

        random.seed(secrets.token_bytes(4))

        new_file_name = str(random.randint(0, 99999))
        print("load: " + new_file_name)
        os.rename("media/pre_images/gsv_0.jpg", "media/pre_images/" + new_file_name + ".jpg")
        os.remove("media/pre_images/metadata.json")

        upload_file_path = os.getcwd()+ "/" + "/media/pre_images/" + new_file_name + ".jpg"

        with open(upload_file_path, "rb") as data:
            encoded = base64.b64encode(data.read())
            img = b'data:image/jpg;base64,' + encoded
            sendToBlob(img, new_file_name)

        os.remove(upload_file_path)

        return Response({"blob_name": new_file_name})

class LoginView(APIView):

    def get(self, request):
        return Response({"Failure": "Incorrect URL"})
    
    def post(self, request):

        password = request.data["password"]

        profile = None

        if "username" in request.data:
            username = request.data["username"]

            try:
                user = User.objects.get(username=username)
                profile = Profile.objects.get(user=user)
            except:
                return Response({"Failure": "Can't find username"})
        elif "phone_number" in request.data:
            phone_number = request.data["phone_number"]

            try:
                profile = Profile.objects.get(phone_number=phone_number)
            except:
                return Response({"Failure": "Can't find phone_number"})
        else: 
            return Response({"Failure": "Incorrect information sent"})

        if profile.banned == True:
            return Response({"Failure": "this user is banned!"})

        correct_pw = profile.user.check_password(password)

        if correct_pw:
            prof_dict = {
                "id": profile.id,
                "username": profile.user.username,
                "phone_number": profile.phone_number,
                "is_admin": profile.is_admin,
                "approved_by_admin": profile.approved_by_admin,
                "banned": profile.banned
            }
            profiles = []
            profiles.append(prof_dict)
            return Response(json.loads(json.dumps(profiles, cls=DjangoJSONEncoder)))
        else:
            return Response({"Failure!": "Incorrect Password"})

class ProfileApproveView(generics.ListCreateAPIView):

    def get(self, request): #returns all profiles not approved by admin
        unapproved_profiles = Profile.objects.filter(approved_by_admin=False)

        profiles = []

        for p in unapproved_profiles:
            prof_dict = {
                "id": p.id,
                "username": p.user.username,
                "phone_number": p.phone_number,
                "is_admin": p.is_admin,
                "approved_by_admin": p.approved_by_admin,
                "banned": p.banned
            }
            
            profiles.append(prof_dict)

        return Response({"unapproved_profiles": json.loads(json.dumps(profiles, cls=DjangoJSONEncoder))})

class ProfileView(generics.ListCreateAPIView):
    serializer_class = ProfileSerializer
    queryset = Profile.objects.all()

    def get(self, requset, pk=None): #used to get a list of all users

        q = []
        profiles = []

        if pk == None:
            q = self.get_queryset()
        else:
            q.append(get_object_or_404(Profile.objects.all(), pk=pk))

        for p in q:
            prof_dict = {
                "id": p.id,
                "username": p.user.username,
                "phone_number": p.phone_number,
                "is_admin": p.is_admin,
                "approved_by_admin": p.approved_by_admin,
                "banned": p.banned

            }
            print(prof_dict)
            profiles.append(prof_dict)

        return Response(json.loads(json.dumps(profiles, cls=DjangoJSONEncoder)))

    def post(self, request): #used to create a new user
        q = request.data

        username = q["username"]
        password = q["password"]
        phone_number = q["phone_number"]
        is_admin = q["is_admin"]
        approved_by_admin = q["approved_by_admin"]

        if User.objects.filter(username=username).exists():
            return Response({"Failure!": "A user with this username already exists"})

        if Profile.objects.filter(phone_number=phone_number).exists():
            return Response({"Failure!": "A user with this phone_number already exists"})


        profile = self.serializer_class.create_object(self,username, password, phone_number, is_admin, approved_by_admin)

        return Response({"Success!": "User {} was created!".format(profile.user.username)})

    def put(self, request, pk): #updated profile information
        profile = get_object_or_404(Profile.objects.all(), pk=pk)
        data = request.data

        updated_profile = self.serializer_class.update_profile(self, profile, data)

        return Response({"Success!": "User {} was updated!".format(updated_profile.user.username)}, status=204)

    def delete(self, request, pk):
        profile = get_object_or_404(Profile.objects.all(), pk=pk)

        username = profile.user.username

        profile.user.delete()
        profile.delete()

        return Response({"Profile for {} was deleted".format(username)}, status=204)

class ImageView(APIView):

    def get(self, request, pk = None): #either returns one image (by id number) or all images

        if pk == None:
            images = Image.objects.all()
            serializer_class = ImageSerializer(images, many = True)
        else:
            image = get_object_or_404(Image.objects.all(), pk=pk)
            serializer_class = ImageSerializer(image, many = False)
            
        return Response({"images": serializer_class.data})

    def post(self, request):
        
        image_serializer = ImageSerializer(data=request.data)
        if image_serializer.is_valid():
            image_serializer.save()
            return Response(image_serializer.data, status=status.HTTP_201_CREATED)
        else:
            print('error', image_serializer.errors)
            return Response(image_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, pk):
        saved_image = get_object_or_404(Image.objects.all(), pk=pk)
        data = request.data.get('image')
        serializer_class = ImageSerializer(instance=saved_image, data=data, partial=True)

        if serializer_class.is_valid(raise_exception=True):
            image_saved = serializer_class.save()
        return Response({"success": "Image '{}' has been updated successfully".format(image_saved)}) 

    def delete(self, request, pk):
        image = get_object_or_404(Image.objects.all(), pk=pk)

        try:
            blob_name = image.blob_name

            connect_str = "DefaultEndpointsProtocol=https;AccountName=blupix;AccountKey=8KBz2PiH671bmhUYvjO+iAs1mh+TIx31DVgnGKzygcv8ItnRgyGtewwZkVgS7aaQ8VB6z6qY/Gqh9lTTTkrx/g==;EndpointSuffix=core.windows.net"

            blob_service_client = BlobServiceClient.from_connection_string(connect_str)

            blob_client = blob_service_client.get_blob_client(container="blupix-app", blob=blob_name)

            blob_client.delete_blob()
        except:
            pass

        image.delete()

        return Response({"success": "Image '{}' has been updated deleted".format(pk)}, status=204)

class DataSearch(generics.ListCreateAPIView):

    def createJSONObj(self, post_images):

        JSONList = []
        
        for post in post_images:

            try:
                #post_user = get_object_or_404(Profile, id=post.user_id_of_upload)
                post_user = Profile.objects.get(id=post.user_id_of_upload)

                image_dict = {
                    "postID" : post.id,
                    "post_blob_name" : post.blob_name, 
                    "position": {
                        "lat" : post.latitude,
                        "lng" : post.longitude
                    },
                    "address" : post.address,
                    "floodDate" : post.flood_date,
                    "postSource" : post.source,
                    "pairAttempted" : post.pair_attempted,
                    "username_of_post": post_user.user.username,
                    "approved_user": post_user.approved_by_admin
                }

            except:
                image_dict = {
                    "postID" : post.id,
                    "post_blob_name" : post.blob_name, 
                    "position": {
                        "lat" : post.latitude,
                        "lng" : post.longitude
                    },
                    "address" : post.address,
                    "floodDate" : post.flood_date,
                    "postSource" : post.source,
                    "pairAttempted" : post.pair_attempted,
                    "username_of_post": "null",
                    "approved_user": "null"
                }

            try:
                pre_image = Image.objects.get(id=post.pair_index)
                #pre_profile = get_object_or_404(Profile, id=pre_image.user_id_of_upload)
                image_dict["preID"] = pre_image.id
                image_dict["pre_blob_name"] = pre_image.blob_name
                image_dict["preSource"] = pre_image.source
                image_dict["map_url"] = pre_image.Maps_URL

                if pre_image.approved_by_admin == True:
                    image_dict["isPaired"] = "True"
                else:
                    image_dict["isPaired"] = "False"

                try:
                    pre_profile = Profile.objects.get(id=pre_image.user_id_of_upload)
                    image_dict["username_of_pre"] = pre_profile.user.username
                except Profile.DoesNotExist:
                    image_dict["username_of_pre"] = "null"

            except Image.DoesNotExist:
                image_dict["username_of_pre"] = "null"
                image_dict["predID"] = "null"
                image_dict["pre_blob_name"] = "null"
                image_dict["preSource"] = "null"
                image_dict["isPaired"] = "False"


            JSONList.append(image_dict)
        
        return(json.loads(json.dumps(JSONList, cls=DjangoJSONEncoder)))

    def get(self, request): #return all unapproved images
        post_images = Image.objects.filter(pre_post = True, approved_by_admin="False")

        return Response(self.createJSONObj(post_images))
        

    def post(self, request):

        q = request.data.get("data")

        post_images = []

        post_images = Image.objects.filter(pre_post = True, latitude__gte=q["MinLat"], latitude__lte=q["MaxLat"], longitude__gte=q["MinLong"],
        longitude__lte=q["MaxLong"], flood_date__gte=q["MinDate"], flood_date__lte=q["MaxDate"])

        images = []

        if q["PairingStatus"] == "paired":
            for p in post_images:
                if p.approved_by_admin == True:
                    try:
                        pre_image = Image.objects.get(id=p.pair_index)
                        if pre_image.approved_by_admin == True:
                            images.append(p)
                    except:
                        print("problem with paired")
                        continue
        elif q["PairingStatus"] == "unpaired":
            for p in post_images:
                try:
                    pre_image = Image.objects.get(id=p.pair_index)
                    if p.approved_by_admin != pre_image.approved_by_admin:
                        images.append(p)
                    
                except Image.DoesNotExist:
                    images.append(p)
                    continue
        else:
            for p in post_images:
                if p.approved_by_admin == True:
                    images.append(p)
                
                try:
                    pre_image = Image.objects.get(id=p.pair_index)

                    if p.approved_by_admin == False and pre_image.approved_by_admin == True:
                        images.append(p)
                except Image.DoesNotExist:
                    print("You are trying to access a pre_image that does not exist")
                    continue

        approved_user_images = []

        for i in images:
            try:
                #profile = get_object_or_404(Profile, id=i.user_id_of_upload)
                profile = Profile.objects.get(id=i.user_id_of_upload)

                if profile.approved_by_admin == True:
                    approved_user_images.append(i)
            except:
                print("user doesn't exit")
                continue

        return Response(self.createJSONObj(approved_user_images))
