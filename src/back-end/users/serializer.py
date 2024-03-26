from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.core.exceptions import ValidationError
from . models import HistoryModel, GameServerModel, AppUser

UserModel = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = '__all__'
    def create(self, clean_data):
        user_obj = UserModel.objects.create_user(email=clean_data['email'], username=clean_data['username'],
                                                 password=clean_data['password'])
        user_obj.save()
        return user_obj

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def check_user(self, clean_data):
        user = authenticate(username=clean_data['email'],
                            password=clean_data['password'])
        if not user:
            raise ValidationError('user not found')
        return user
    
class UserSerializer(serializers.ModelSerializer):
    winRate = serializers.SerializerMethodField()
    aceRate = serializers.SerializerMethodField()
    
    class Meta:
        model = UserModel
        fields = ('user_id', 'email', 'username', 'nbGamePlayed', 'nbGameWin', 'nbGameLose', 'winRate', 'image'
                  'nbTouchedBall', 'nbAce', 'aceRate', 'LongestExchange', 'nbPointMarked', 'nbPointLose', 'language', 'color', 'music', 'key1', 'key2', 'key3', 'key4')
    
    def get_winRate(self, obj):
        if (obj.nbGamePlayed == 0):
            return 0
        return (obj.nbGameWin / obj.nbGamePlayed) * 100
    
    def get_aceRate(self, obj):
        if (obj.nbTouchedBall == 0):
            return 0
        return (obj.nbAce / obj.nbTouchedBall) * 100


class HistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = HistoryModel
        fields = '__all__'

class ServerSerializer(serializers.ModelSerializer):
    class Meta:
        model = GameServerModel
        fields = ('serverId')

class FriendListSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ('id', 'username', 'isOnline', 'image')