# backend/urls.py

from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from django.conf.urls import url

from waterlogged import views

urlpatterns = [
    path('api/send/', views.SendView.as_view()),
    path('api/receive/', views.ReceiveView.as_view()),
    path('api/image/', views.ImageView.as_view()),
    path('api/image/<int:pk>', views.ImageView.as_view()),
    path('api/datasearch/', views.DataSearch.as_view()),
    path('api/profile/', views.ProfileView.as_view()),
    path('api/profile/<int:pk>', views.ProfileView.as_view()),
    path('api/profileapprove/', views.ProfileApproveView.as_view()),
    path('api/login/', views.LoginView.as_view()),
    path('api/login/<int:pk>', views.LoginView.as_view()),
    path('api/load/<int:pk>', views.LoadView.as_view()),
    path('api/load/', views.LoadView.as_view()),
    path('api/key/', views.KeyView.as_view())
]
