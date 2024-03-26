from django.urls import path
from . import views

urlpatterns = [
    path('register', views.UserRegister.as_view(), name='register'),
    path('login', views.UserLogin.as_view(), name='login'),
    path('logout', views.UserLogout.as_view(), name='logout'),
    path('user', views.UserView.as_view(), name='user'),
    path('history', views.HistoryView.as_view(), name='history'),
    path('JoinQueue', views.JoinQueue.as_view(), name='JoinQueue'),
    path('CheckJoinGame', views.CheckJoinGame.as_view(), name='CheckJoinGame'),
    path('ExitQueue', views.ExitQueue.as_view(), name='ExitQueue'),
	path('URL42', views.URL42.as_view(), name='URL42'),
	path('Register42', views.Register42.as_view(), name='Register42'),
]