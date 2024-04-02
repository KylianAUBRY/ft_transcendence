from django.urls import re_path 
from . import consumers 
  
websocket_urlpatterns = [ 
    #re_path(r'ws/game/(?P<room_name>\w+)/(?P<auth_token>\w+)/$', consumers.GameRoom.as_asgi()),
    re_path(r'ws/game/(?P<room_name>\w+)/$', consumers.GameRoom.as_asgi()),
] 