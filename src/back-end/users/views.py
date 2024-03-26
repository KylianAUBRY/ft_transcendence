from django.shortcuts import render
from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializer import UserRegisterSerializer, UserLoginSerializer, UserSerializer, HistorySerializer, ServerSerializer, FriendListSerializer
from rest_framework import permissions, status
from .validations import custom_validation, validate_email, validate_password
from . models import HistoryModel, GameServerModel, WaitingPlayerModel
from django.db.models import Q
from . utils import *
from django.middleware.csrf import get_token
import sys
import json
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings
#from ..GameServer import test

# Create your views here.

# Post request to create a new user
class UserRegister(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        clean_data = custom_validation(request.data)
        serializer = UserRegisterSerializer(data=clean_data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create(clean_data)
            if user:
                return Response(None, status=status.
                                HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

# Post request to login user
class UserLogin(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        assert validate_email(data)
        assert validate_password(data)
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)

            from . models import AppUser
            user_obj = AppUser.objects.get(email=data.get("email"))
            if user_obj:
                user_obj.isOnline = True
                user_obj.save()

            login(request, user)
            return Response(serializer.data, status=status.HTTP_200_OK)

# Post request to logout user
class UserLogout(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        email = getattr(request.user, "email", None)
        logout(request)

        from . models import AppUser
        user_obj = AppUser.objects.get(email=email)
        if user_obj:
            user_obj.isOnline = False
            user_obj.save()

        return Response(status=status.HTTP_200_OK)

# Get info of user connected
class UserView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)
    
class UpateUserInfo(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        from . models import AppUser

        data = request.data
        user_id = data.get("userId")
        username = data.get("username")
        password = data.get("password")
        image = request.FILES.get("file")
        user_obj = AppUser.objects.get(pk=user_id)
        if user_obj:
            user_obj.username = username
            user_obj.image = image
            if (password != ""):
                user_obj.password = password
            user_obj.save()
            return Response({"message": "Info updated successfuly"}, status=status.HTTP_200_OK)
        return Response({"message": "Info update failed"}, status=status.HTTP_200_OK)

class UpdateUserOption(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data

        user_id = data.get('userId')
        language = data.get('language')
        color = data.get('color')
        music = data.get('music')
        key1 = data.get('key1')
        key2 = data.get('key2')
        key3 = data.get('key3')
        key4 = data.get('key4')
        
        try:
            updateUserOption(user_id, language, color, music, key1, key2, key3, key4)
            return Response({'message': 'User statistics updated successfully'})
        except Exception as e:
            return Response({'message': 'User update failed', 'error': str(e)})

# Get all match history from a user
class HistoryView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        data = request.data
        user_id = data.get("userId")
        history_object = HistoryModel.objects.filter(userId=user_id)
        serializer = HistorySerializer(history_object, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Add player to a waiting queue
class JoinQueue(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        user_id = data.get("userId")
        WaitingPlayerModel.objects.create(player_id=user_id)
        return Response({'message': 'You have joined the queue.'}, status=status.HTTP_200_OK)

# Start new game
import logging
class CheckJoinGame(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        logger = logging.getLogger(__name__)
        ManageGameQueue()
        data = request.data
        user_id = data.get("userId")
        game_server = GameServerModel.objects.filter(Q(firstPlayerId=user_id) | Q(secondPlayerId=user_id)).first()
        if game_server:
            if (game_server.state == 'full'):
                logger.info('CJG -> 1')
                return Response({'gameId': game_server.serverId}, status=status.HTTP_200_OK)
            else:
                logger.info('CJG -> 2')
                return Response({'message': 'Searching for a game.'}, status=status.HTTP_200_OK)
            # send server name to client to start the game
        else:
            logger.info('CJG -> 3')
            return Response({'message': 'Searching for a game.'}, status=status.HTTP_200_OK)
            # send 'in queue'

class ExitQueue(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        user_id = data.get("userId")
        waiting_player = WaitingPlayerModel.objects.filter(player_id=user_id).first()
        game_server = GameServerModel.objects.filter(Q(firstPlayerId=user_id) | Q(secondPlayerId=user_id)).first()
        if waiting_player:
            waiting_player.delete()
        if game_server:
            if game_server.firstPlayerId == user_id:
                game_server.firstPlayerId = -1
            elif game_server.secondPlayerId == user_id:
                game_server.secondPlayerId = -1
            game_server.state = 'waiting'
            game_server.save()
        return Response({"message": 'You left the queue'}, status=status.HTTP_200_OK)

class Register42(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        from django.contrib.auth import login as django_login
        # Traitez les informations reçues ici
        # Par exemple, récupérez des données de la requête
        code_value = request.GET.get('code')
        print(request.GET,file=sys.stderr)

        # server_url = request.build_absolute_uri('/register42')
        host_without_port = request.get_host().split(':')[0]
        
        # Génération de l'URL avec le port 8000
        if (settings.DJANGO_PROTOCOL == 'http'):
            server_url = request.scheme + '://' + host_without_port + ':8000/register42'
        elif (settings.DJANGO_PROTOCOL == 'https'):
            server_url = request.scheme + '://' + host_without_port + ':443/register42'
        else :
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR, data={'error': 'Invalid Django protocol'})
        
        # Faire ce que vous voulez avec l'URL du serveur
        print("\n\n\nURL du serveur :", server_url,file=sys.stderr)
        
        import requests
        from . models import AppUser
        files = {
            'grant_type': 'authorization_code',
            'client_id': settings.API_CLIENT_ID,
            'client_secret': settings.API_CLIENT_SECRET,
            'code': code_value,
            'redirect_uri': server_url,
        }

        print("\n\n", files, file=sys.stderr)
        print("\n \n")
        response = requests.post(settings.API_TOKEN_URL, data=files)
        if (response.status_code != status.HTTP_200_OK):
            return Response(status=status.HTTP_400_BAD_REQUEST, data=response.json())
        access_token = response.json().get('access_token')
        if (access_token is not None):
            inf = requests.get(settings.API_INFO_URL, params={'access_token': access_token})
            if (inf.status_code == status.HTTP_200_OK):
                login = inf.json().get('login')
                email = inf.json().get('email')
                print("\n\n login ", login, " email ", email, file=sys.stderr)

                user_exists = AppUser.objects.filter(email=email).exists()
                if not user_exists:
                    # Créer un nouvel utilisateur
                    user = AppUser.objects.create(username=login, email=email, password=code_value)
                    login(request, user)
                    return Response(status=status.HTTP_201_CREATED)
                else:
                    # Récupérer l'utilisateur existant
                    
                    user = AppUser.objects.get(email=email)
                    serializer = UserLoginSerializer(user)

                    login(request, user)
                    return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response(status=status.HTTP_400_BAD_REQUEST, data=inf.json())

# register42      user = AppUser.objects.get(pk=email)

class URL42(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        lien = settings.API_CONNECT_URL
        return Response({"URL42": lien}, status=status.HTTP_200_OK)
    
class AddFriend(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        from . models import AppUser

        data = request.data
        friend_id = data.get("friendId")
        friend_obj = AppUser.objects.get(pk=friend_id)
        if not friend_obj:
            Response({"message": "User doesn't exist"}, status=status.HTTP_200_OK)
        if friend_obj:
            user_id = data.get("userId")
            user_obj = AppUser.objects.get(pk=user_id)
            if user_obj:
                user_obj.friends_list.append(friend_id)
            Response({"message": "'" + friend_obj.username + "' added to friend list"}, status=status.HTTP_200_OK)

class RemoveFriend(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        from . models import AppUser

        data = request.data
        user_id = data.get("userId")
        friend_id = data.get("friendId")
        user_obj = AppUser.objects.get(pk=user_id)
        if user_obj:
            user_obj.friends_list.remove(friend_id)
            Response({"message": "Friend deleted"}, status=status.HTTP_200_OK)
        else:
            Response({"error": "Can't find user in database"}, status=status.HTTP_400_BAD_REQUEST)
        

class GetFriendList(APIView):

    def post(self, request):
        from . models import AppUser

        data = request.data
        user_id = data.get("userId")
        user_obj = AppUser.objects.get(pk=user_id)
        friend_data = []
        if user_obj:
            for friend_id in user_obj.friends_list:
                friend = AppUser.objects.get(pk=friend_id)
                if friend :
                    friend_data.append(FriendListSerializer(user_obj).data)
            Response({"friend_list": friend_data}, status=status.HTTP_200_OK)
        else:
            Response({"error": "Can't find user in database"})