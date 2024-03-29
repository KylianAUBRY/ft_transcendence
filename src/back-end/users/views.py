from django.shortcuts import render
from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication, TokenAuthentication
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
from rest_framework.authtoken.models import Token
#from ..GameServer import test

# Create your views here.

# Post request to create a new user
class UserRegister(APIView):
    authentication_classes = [SessionAuthentication]
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
    authentication_classes = [SessionAuthentication]
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        data = request.data
        logger = logging.getLogger(__name__)
        assert validate_email(data)
        assert validate_password(data)
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)

            try:
                from . models import AppUser
                user_obj = AppUser.objects.get(email=data.get("email"))
                if user_obj:
                    user_obj.isOnline = True
                    user_obj.save()
            except Exception as error:
                pass

            login(request, user)
            token = create_user_token(user)
            return Response(json.dumps({"token": token.key}), status=status.HTTP_200_OK)

# Post request to logout user
class UserLogout(APIView):
    authentication_classes = [SessionAuthentication]
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        logger = logging.getLogger(__name__)
        logout(request)

        try:
            email = getattr(request.user, "email", None)
            from . models import AppUser
            user_obj = AppUser.objects.get(email=email)
            if user_obj:
                user_obj.isOnline = False
                user_obj.save()
        except Exception as error:
            logger.info("\n\nLOGOUT : %s", error)
        return Response(status=status.HTTP_200_OK)

# Get info of user connected
class UserView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        try:
            logger = logging.getLogger(__name__)
            serializer = UserSerializer(request.user)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({'user': "You are not connected"}, status=status.HTTP_200_OK)
    
class UpateUserInfo(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        from . models import AppUser
        logger = logging.getLogger(__name__)

        logger.info('GROS LOGGER SA MERE : %s ||||| %s', str(request.FILES), str(request.data))
        data = request.data
        user_id = data.get("userId")
        logger.info('user_id : %s', user_id)
        username = data.get("username")
        logger.info('user_id : %s', username)
        password = data.get("password")
        logger.info('user_id : %s', password)
        image = request.FILES['file']
        logger.info('image : %s', str(image))
        try:
            user_obj = AppUser.objects.get(pk=user_id)
            if user_obj:
                user_obj.image.save(image.name, image)
                if username != "":
                    user_obj.username = username
                if (password != ""):
                    user_obj.set_password(password)
                user_obj.save()
                return Response({"message": "Info updated successfuly"}, status=status.HTTP_200_OK)
            return Response({"message": "Info update failed"}, status=status.HTTP_200_OK)
        except Exception as error:
            return Response({"error": error})

class UpdateUserOption(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        logger = logging.getLogger(__name__)

        data = request.data

        userId = data.get('userId')
        logger.info('\n\n\nuserId: %s', userId)
        language = data.get('language')
        logger.info('language: %s', language)
        color = data.get('color')
        logger.info('color: %s', color)
        music = data.get('music')
        logger.info('music: %s', music)
        key1 = data.get('key1')
        logger.info('key1: %s', key1)
        key2 = data.get('key2')
        logger.info('key2: %s', key2)
        key3 = data.get('key3')
        logger.info('key3: %s', key3)
        key4 = data.get('key4')
        logger.info('key4: %s', key4)
        
        try:
            from . models import AppUser
            user_obj = AppUser.objects.get(pk=userId)
            if user_obj:
                logger.info('USER_OBJ: %s\n\n\n', str(user_obj))
                user_obj.language = language
                user_obj.color = color
                user_obj.music = music
                user_obj.key1 = key1
                user_obj.key2 = key2
                user_obj.key3 = key3
                user_obj.key4 = key4
                user_obj.save()
            return Response({'message': 'User statistics updated successfully'})
        except Exception as e:
            logger.info('ERROR: \n\n\n')
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
                return Response({'gameId': game_server.serverId}, status=status.HTTP_200_OK)
            else:
                return Response({'message': 'Searching for a game.'}, status=status.HTTP_200_OK)
            # send server name to client to start the game
        else:
            return Response({'message': 'Searching for a game.'}, status=status.HTTP_200_OK)
            # send 'in queue'

class ExitQueue(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        logger = logging.getLogger(__name__)
        data = request.data
        user_id = data.get("userId")
        game_server = GameServerModel.objects.get(Q(firstPlayerId=user_id) | Q(secondPlayerId=user_id))
        try:
            waiting_player = WaitingPlayerModel.objects.get(player_id=user_id)
            if waiting_player:
                waiting_player.delete()
        except:
            pass
        if game_server:
            if int(game_server.firstPlayerId) == int(user_id):
                game_server.firstPlayerId = -1
            if int(game_server.secondPlayerId) == int(user_id):
                game_server.secondPlayerId = -1
            game_server.state = 'waiting'
            game_server.save()
        return Response({"message": 'You left the queue'}, status=status.HTTP_200_OK)
    
class AddFriend(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        from . models import AppUser
        logger = logging.getLogger(__name__)

        try:
            logger.info("\n\nADD FRIEND")
            data = request.data
            friend_id = data.get("friendId")
            friend_obj = AppUser.objects.get(pk=friend_id)
            if not friend_obj:
                return Response({"error": "User doesn't exist"}, status=status.HTTP_200_OK)
            if friend_obj:
                user_id = data.get("userId")
                user_obj = AppUser.objects.get(pk=user_id)
                if user_obj:
                    logger.info("USERID %s : %s FRIENDID", user_id, friend_id)
                    if int(user_id) != int(friend_id):
                        logger.info("POURQUOI SALE BATARD")
                        if int(friend_id) not in user_obj.friends_list:
                            logger.info("POURQUOI SALE BATARD 2")
                            user_obj.friends_list.append(friend_id)
                    user_obj.save()
                else:
                    return Response({"message": "Friend already added"}, status=status.HTTP_200_OK)
                return Response({"message": "'" + friend_obj.username + "#" + str(friend_obj.user_id) + "' added to friend list"}, status=status.HTTP_200_OK)
        except Exception as error:
            logger.info("\n\nERROR IN ADDFRIEND : %s", error)
            return Response({"message": "User doesn't exist"}, status=status.HTTP_200_OK)
        

class RemoveFriend(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        from . models import AppUser
        logger = logging.getLogger(__name__)

        data = request.data
        logger.info("\n\nREMOVE FRIEND")
        user_id = data.get("userId")
        logger.info("user_id : %s", user_id)
        friend_id = data.get("friendId")
        logger.info("friend_id : %s", friend_id)
        user_obj = AppUser.objects.get(pk=user_id)
        if user_obj:
            logger.info("list friend : %s", str(user_obj.friends_list))
            if friend_id in user_obj.friends_list:
                user_obj.friends_list.remove(friend_id)
            user_obj.save()
            logger.info("list friend after remove : %s\n\n", str(user_obj.friends_list))
            return Response({"message": "Friend deleted"}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Can't find user"}, status=status.HTTP_200_OK)
        

class GetFriendList(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        from . models import AppUser
        logger = logging.getLogger(__name__)

        data = request.data
        user_id = data.get("userId")
        user_obj = AppUser.objects.get(pk=user_id)
        friend_data = []
        if user_obj:
            for friend_id in user_obj.friends_list:
                friend = AppUser.objects.get(pk=friend_id)
                if friend :
                    friend_data.append(FriendListSerializer(friend).data)
            return Response({"friend_list": friend_data}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Can't find user in database"})
        

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
        server_url = request.scheme + '://' + host_without_port + ':8000/register42'
        
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