from django.shortcuts import render
from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializer import UserRegisterSerializer, UserLoginSerializer, UserSerializer, HistorySerializer, ServerSerializer
from rest_framework import permissions, status
from .validations import custom_validation, validate_email, validate_password
from . models import HistoryModel, GameServerModel, WaitingPlayerModel
from django.db.models import Q
from . utils import *
from django.middleware.csrf import get_token
import sys
import json
from django.views.decorators.csrf import csrf_exempt

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
            login(request, user)
            return Response(serializer.data, status=status.HTTP_200_OK)

# Post request to logout user
class UserLogout(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)

# Get info of user connected
class UserView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({'user': serializer.data}, status=status.HTTP_200_OK)

# Maj of user info after a match
class UpdateUserView(APIView):
    permission_classes = [permissions.AllowAny]

    # Update nbGamePlayed, nbGameWin/nbGameLose, nbTouchedBall, nbAce, nbLongestExchange, nbPointMarked, nbPointLose   on  user_id
    def get(self, request):
        data = request.data

        user_id = data.get('userId')
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

class UpdateUserOption(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
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
            return Response({'message': 'User update failed', 'error': str(e)}, status=500)

# Get all match history from a user
class HistoryView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        user_id = request.user.userId
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
class CheckJoinGame(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
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