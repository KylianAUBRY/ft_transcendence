from django.shortcuts import render
from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializer import UserRegisterSerializer, UserLoginSerializer, UserSerializer, HistorySerializer, ServerSerializer
from rest_framework import permissions, status
from .validations import custom_validation, validate_email, validate_password
from . models import HistoryModel, GameServerModel
from django.db.models import Q
from . utils import *
#from ..GameServer import test

# Create your views here.

# Post request to create a new user
class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        clean_data = custom_validation(request.data)
        serializer = UserRegisterSerializer(data=clean_data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create(clean_data)
            if user:
                return Response(serializer.data, status=status.
                                HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

# Post request to login user
class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)

    def post(self, request):
        data = request.data
        assert validate_email(data)
        assert validate_password(data)
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)
            login(request, user)
            return Response(serializer.data, status=status.HTTP_200_OK)

# Post request to logout user
class UserLogout(APIView):
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)

# Get info of user connected
class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)

# Maj of user info after a match
class UpdateUserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)

    # Update nbGamePlayed, nbGameWin/nbGameLose, nbTouchedBall, nbAce, nbLongestExchange, nbPointMarked, nbPointLose   on  user_id
    def post(self, request):
        data = request.data

        user_id = data.get('user_id')
        isWin = data.get('isWin')
        nbTouchedBall = data.get('nbTouchedBall')
        nbAce = data.get('nbAce')
        nbLongestExchange = data.get('nbLongestExchange')
        nbPointMarked = data.get('nbPointMarked')
        nbPointLose = data.get('nbPointLose')

        try:
            updateUserStatistic(user_id, isWin, nbTouchedBall, nbAce, nbLongestExchange, nbPointMarked, nbPointLose)
            return Response({'message': 'User statistics updated successfully'})
        except Exception as e:
            return Response({'message': 'User update failed', 'error': str(e)}, status=500)

# Get all match history from a user
class HistoryView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (SessionAuthentication,)
    
    def get(self, request):
        user_id = request.user.user_id
        history_object = HistoryModel.objects.filter(userId=user_id)
        serializer = HistorySerializer(history_object, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
 
# Post match just played from game server   
class AddNewMatchView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        data = request.data
        serializer = HistorySerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            game = serializer.create(data)
            if game:
                return Response(serializer.data, status=status.
                                HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)

# Start new game
class StartNewGame(APIView):

    def get(self, request):

        # Search if game need a player
        game_server = GameServerModel.objects.filter(status='waiting').first()
        if game_server:
            # Game server available, send connection information server to client
                game_server.secondPlayerAddr = request.META.get('REMOTE_ADDR')
                game_server.state = 'full'
                game_server.save()
                serializer = ServerSerializer(game_server)
                return Response(serializer.data)
        else:
            # No server waiting, start a new server and send connection info to user
                # Look for an unused port
                port = 8000
                is_port_used = True
                while (is_port_used):
                    port += 1
                    if (is_port_in_use(port)):
                        is_port_used = True
                    else:
                        is_port_used = False

                addr = "127.0.0.1:" + port
                game_server = GameServerModel.objects.create(serverAddr=addr)
                game_server.state = 'waiting'
                game_server.firstPlayerAddr = request.META.get('REMOTE_ADDR')
                game_server.save()

                #GameServer.main(game_server.serverId, "127.0.0.1", port)

                serializer = ServerSerializer(game_server)
                return Response(serializer.data)

# Get game server request when game is finished to delete game server from database
class DeleteServer(APIView):
    def get(self, request):
        server_id = request.server.server_id
        try:
            server_to_delete = GameServerModel.objects.get(pk=server_id)
            server_to_delete.delete()
        except GameServerModel.DoesNotExist:
            print("Object does not exist.")
        except Exception as e:
            print("An error as occured")