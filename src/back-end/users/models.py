from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractUser, PermissionsMixin

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
	def create_superuser(self, email, username, password):
		if not email:
			raise ValueError('An email is required.')
		if not password:
			raise ValueError('A password is required.')
		user = self.create_user(email=self.normalize_email(email),
			   username=username, password=password)
		user.is_active = True
		user.is_admin = True
		user.is_staff = True
		user.is_superuser = True
		user.save(using=self._db)
		return user

class appuser(AbstractUser, PermissionsMixin):
	user_id = models.AutoField(primary_key=True)
	email = models.EmailField(max_length=50, unique=True)
	username = models.CharField(max_length=50)
	nbGamePlayed = models.IntegerField(default=0)
	nbGameWin = models.IntegerField(default=0)
	nbGameLose = models.IntegerField(default=0)
	nbTouchedBall = models.IntegerField(default=0)
	nbAce = models.IntegerField(default=0)
	LongestExchange = models.IntegerField(default=0)
	nbPointMarked = models.IntegerField(default=0)
	nbPointLose = models.IntegerField(default=0)
	USERNAME_FIELD = 'email'
	REQUIRED_FIELDS = ['username']
	objects = AppUserManager()
	def __str__(self):
		return f"ID : {self.user_id} | EMAIL : {self.email} |  USERNAME : {self.username} | CREATE_DATE : {self.date_joined}"

class HistoryModel(models.Model):
	gameId = models.AutoField(primary_key=True)
	userId = models.IntegerField()
	userUsername = models.CharField(max_length=50)
	opponentId = models.IntegerField()
	opponentUsername = models.CharField(max_length=50)
	userScore = models.IntegerField()
	opponentScore = models.IntegerField()
	isWin = models.BooleanField()
	gameDate = models.DateField()
	gameTime = models.TimeField()
	def __str__(self):
		return f"{self.gameId} | {self.userId} | {self.opponentId}"

class GameServerModel(models.Model):
	serverId = models.AutoField(primary_key=True)
	serverAddr = models.CharField(max_length=20)
	firstPlayerAddr = models.CharField(max_length=20, default=0)
	secondPlayerAddr = models.CharField(max_length=20, default=0)
	state = models.CharField(max_length=7)
	def __str__(self):
		return f"{self.serverId} : {self.serverAddr}"