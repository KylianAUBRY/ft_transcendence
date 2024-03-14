from django.urls import path
from . import views

urlpatterns = [
    path('register', views.UserRegister.as_view(), name='register'),
    path('login', views.UserLogin.as_view(), name='login'),
    path('logout', views.UserLogout.as_view(), name='logout'),
    path('user', views.UserView.as_view(), name='user'),
    path('history', views.HistoryView.as_view(), name='history'),
    path('AddNewMatch', views.AddNewMatchView.as_view(), name='AddNewMatch'),
    path('UpdateUser', views.UpdateUserView.as_view(), name='UpdateUser'),
    path('StartGame', views.StartNewGame.as_view(), name='StartGame'),
    path('DeleteServer', views.DeleteServer.as_view(), name='DeleteServer')
]