from django.urls import path
from . import views

urlpatterns = [
    path('register', views.UserRegister.as_view(), name='register'),
    path('login', views.UserLogin.as_view(), name='login'),
    path('logout', views.UserLogout.as_view(), name='logout'),
    path('user', views.UserView.as_view(), name='user'),
	path('UpateUserInfo', views.UpateUserInfo.as_view(), name='UpateUserInfo'),
	path('UpdateUserOption', views.UpdateUserOption.as_view(), name='UpdateUserOption'),
    path('history', views.HistoryView.as_view(), name='history'),
    path('JoinQueue', views.JoinQueue.as_view(), name='JoinQueue'),
    path('CheckJoinGame', views.CheckJoinGame.as_view(), name='CheckJoinGame'),
    path('ExitQueue', views.ExitQueue.as_view(), name='ExitQueue'),
	path('URL42', views.URL42.as_view(), name='URL42'),
	path('AddFriend', views.AddFriend.as_view(), name='AddFriend'),
	path('RemoveFriend', views.RemoveFriend.as_view(), name='RemoveFriend'),
	path('GetFriendList', views.GetFriendList.as_view(), name='GetFriendList')
]