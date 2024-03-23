from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin
import datetime
import django

# Create your models here.

class AppUserManager(BaseUserManager):
	def create_user(self, email, username, password):
		if not email:
			raise ValueError('An email is required.')
		if not password:
			raise ValueError('A password is required.')
		email = self.normalize_email(email)
		user = self.model(email=email, username=username, password=password)
		user.set_password(password)
		user.save(using=self._db)
		return user
	def create_superuser(self, email, password):
		if not email:
			raise ValueError('An email is required.')
		if not password:
			raise ValueError('A password is required.')
		user = self.create_user(email=self.normalize_email(email), password=password)
		user.is_superuser = True
		user.save(using=self._db)
		return user

class AppUser(AbstractBaseUser, PermissionsMixin):
	user_id = models.AutoField(primary_key=True)
	email = models.EmailField(max_length=50, unique=True)
	username = models.CharField(max_length=50)
	date_joined = models.DateField(default=django.utils.timezone.now)
	language = models.CharField(max_length=50, default='French')
	color = models.CharField(max_length=50, default="white")
	music = models.IntegerField(default=0)
	nbGamePlayed = models.IntegerField(default=0)
	nbGameWin = models.IntegerField(default=0)
	nbGameLose = models.IntegerField(default=0)
	nbTouchedBall = models.IntegerField(default=0)
	nbAce = models.IntegerField(default=0)
	LongestExchange = models.IntegerField(default=0)
	nbPointMarked = models.IntegerField(default=0)
	nbPointLose = models.IntegerField(default=0)
	key1 = models.CharField(max_length=50, default="KeyA")
	key2 = models.CharField(max_length=50, default="KeyD")
	key3 = models.CharField(max_length=50, default="ArrowLeft")
	key4 = models.CharField(max_length=50, default="ArrowRight")
	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['username']
	objects = AppUserManager()
	def __str__(self):
		return f"ID : {self.user_id} | EMAIL : {self.email} |  USERNAME : {self.username} | CREATE_DATE : {self.date_joined}"

class HistoryModel(models.Model):
	gameId = models.AutoField(primary_key=True)
	userId = models.IntegerField(default=-1)
	userUsername = models.CharField(max_length=50)
	opponentId = models.IntegerField(default=-1)
	opponentUsername = models.CharField(max_length=50)
	userScore = models.IntegerField(default=-1)
	opponentScore = models.IntegerField(default=-1)
	isWin = models.BooleanField(default=False)
	gameDate = models.DateField(default="0000-00-00")
	gameTime = models.TimeField(default="00:00")
	def __str__(self):
		return f"{self.gameId} | {self.userId} | {self.opponentId}"

class GameServerModel(models.Model):
	serverId = models.AutoField(primary_key=True)
	firstPlayerId = models.IntegerField(default=-1)
	secondPlayerId = models.IntegerField(default=-1)
	state = models.CharField(max_length=7, default="")
	def __str__(self):
		return f"{self.serverId} : {self.serverAddr}"

class WaitingPlayerModel(models.Model):
	player_id = models.IntegerField()