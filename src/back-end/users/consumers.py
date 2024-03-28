import json 
import uuid
import asyncio
import math
import random
import time
import logging

from django.utils import timezone
from datetime import date
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync, sync_to_async
  
async def updateUserStatistic(user_id, isWin, nbTouchedBall, nbAce, nbLongestExchange, nbPointMarked, nbPointLose):
    from . models import AppUser
    user = await AppUser.objects.get(pk=user_id)

    # Update nbGamePlayed, nbGameWin/nbGameLose, nbTouchedBall, nbAce, nbLongestExchange, nbPointMarked, nbPointLose
    user.nbGamePlayed += 1

    if (isWin):
        user.nbGameWin += 1
    else:
        user.nbGameLose += 1

    user.nbTouchedBall += int(nbTouchedBall)
    user.nbAce += int(nbAce)
    
    if (int(nbLongestExchange) > user.LongestExchange):
        user.LongestExchange = int(nbLongestExchange)
    
    user.nbPointMarked += int(nbPointMarked)
    user.nbPointLose += int(nbPointLose)

    user.save()

class GameRoom(AsyncWebsocketConsumer):
    players = {}

    async def connect(self): 
        self.name_serv = self.scope['url_route']['kwargs']['room_name']
        serv = self.name_serv
        self.game_group_name = "game_%s" % serv
        self.player_id = str(uuid.uuid4())
        logger = logging.getLogger(__name__)
        logger.info('accept %s', self.player_id)
        await self.accept()
        
        logger.info('group add %s', self.player_id)
        await self.channel_layer.group_add(
            self.game_group_name, self.channel_name
        )

        side = "left"
        if not serv in self.players:
            self.players[serv] = {}
            side = "left"
        else:
            side = "right"

        logger.info('send %s', self.player_id)
        await self.send(
            text_data=json.dumps({"type": "playerId", "playerId": self.player_id, "name_serv": serv, "side": side})
        )

        logger.info('set %s', self.player_id)
        self.players[serv][self.player_id] = {
            "idMatch": self.player_id,
            "idPlayer": 0,
            "side": side,
            "isReady": False,
            "move" : "none",
            "username": "",
            "x" : 0,
            "y" : 0,
            "score": 0,
            "isWin": False,
            "nbTouchPerRound": 0,
            "nbLongestExchange": 0,
            "nbTouchBall": 0,
            "nbAce": 0,
            "isDisconnect": False,
        }
        
        logger.info('Set : %s', self.player_id)
        logger.info('Length : %s', len(self.players[serv]))
        if len(self.players[serv]) == 2:
            logger.info('launch game')
            asyncio.create_task(self.game_loop(serv))
  
    async def disconnect(self, close_code): 
        logger = logging.getLogger(__name__)

        player_to_disconnect = None
        serv_name = None
        for name_serv in self.players.values():
            for player in name_serv.values():
                logger.info("PLAYER INFO OOOOOOOOOOO: %s", str(player))
                logger.info("PLAYER INFO OOOOOOOOOOO: %s", self.scope["user"].user_id)
                if player["idPlayer"] == self.scope["user"].user_id:
                    serv_name = name_serv
                    player_to_disconnect = player["idMatch"]
                    break

        self.players[name_serv][player_to_disconnect]["isDisconnect"] = True

        await self.channel_layer.group_discard(
            self.game_group_name, self.channel_name
        )

  
    async def receive(self, text_data): 
        text_data_json = json.loads(text_data)
        logger = logging.getLogger(__name__)

        try:
            name_serv = text_data_json["name_serv"]
            idMatch = text_data_json["idMatch"]
            player_id = text_data_json["playerId"]
            orientation = text_data_json["playerDirection"]
            isReady = text_data_json["isReady"]
            username = text_data_json["username"]
            logger.info('%s', name_serv)
            logger.info('%s', idMatch)
            logger.info('%s', player_id)
            logger.info('%s', orientation)
            logger.info('%s', isReady)
            logger.info('%s', username)
        
            serv = self.players.get(name_serv, None)
            if not serv:
                print("Serv not found")
                return
            player = serv.get(idMatch, None)
            if not player:
                print("Player not found")
                return
            
            player["move"] = orientation
            player["idMatch"] = idMatch
            player["idPlayer"] = player_id
            player["isReady"] = isReady
            player["username"] = username
        except Exception as error:
            logger.info("Error in receive :", error)


    async def state_update(self, event):
        # Handler for state_update messages
        player_1 = event["player_1"]
        player_2 = event["player_2"]
        ball = event["ball"]
        is_goal = event["isGoal"]
        countdown = event["countdown"]
        is_starting = event["isStarting"]
        game_is_finished = event["gameIsFinished"]

        # Handle the state update message as needed
        # You can update the state of your WebSocket connection, send messages to clients, etc.
        # For example, you might send the updated state to the client:
        await self.send(text_data=json.dumps({
            'type': 'state_update',
            'player_1_idMatch': player_1['idMatch'],
            'player_1_id': player_1['idPlayer'],
            'player_1_score': player_1['score'],
            'player_1_username': player_1['username'],
            'player_1_y': player_1['y'],
            'player_2_idMatch': player_2['idMatch'],
            'player_2_id': player_2['idPlayer'],
            'player_2_score': player_2['score'],
            'player_2_username': player_2['username'],
            'player_2_y': player_2['y'],
            'ball_x': ball['ball_x'],
            'ball_y': ball['ball_y'],
            'ball_dx': ball['ball_dx'],
            'ball_dy': ball['ball_dy'],
            'ball_speed': ball['ball_speed'],
            'isGoal': is_goal,
            'countdown': countdown,
            'isStarting': is_starting,
            'gameIsFinished': game_is_finished
        }))

    async def game_loop(self, serv):
        logger = logging.getLogger(__name__)
        logger.info('innit info')
        field_high = 15.4
        field_length = 22
        player_speed = 7.5
        player_size = 1.3
        ball_x = 0
        ball_y = 0
        ball_dx = 0
        ball_dy = 0
        ball_speed = 6.5
        ball_speed_gain_per_hit = 0.5
        ball_size = 0.207
        countdown = 3
        isGoal = False
        gameIsFinished = False
        isStarting=False
        player1_id = 0
        player2_id = 0
        timeStartGame = 0
        timeEndGame = 0

        countForInfo = 0
        nbInfoPerSecond = 30

        timePerFrame = 0.0166

        logger.info('Will set player info')
        for player in self.players[serv].values():
            logger.info('Set player info')
            if player["side"] == "left":
                player1_id = player["idMatch"]
                player["x"] = 0 - field_length / 2
                player["y"] = 0
                logger.info('%s', player1_id)
                logger.info('%s', player["username"])
            if player["side"] == "right":
                player2_id = player["idMatch"]
                player["x"] = 0 + field_length / 2
                player["y"] = 0
                logger.info('%s', player2_id)
                logger.info('%s', player["username"])

        while isStarting==False and self.players[serv][player1_id]["isDisconnect"] == False and self.players[serv][player2_id]["isDisconnect"] == False:
            if len(self.players[serv]) == 2:
                if (self.players[serv][player1_id]["isReady"] == True and self.players[serv][player2_id]["isReady"] == True):
                    logger.info('Two player Ready')
                    isStarting = True
                    ball_dx = random.choice([-1, 1])
                    while True:
                        ball_dy = random.uniform(-0.5, 0.5)
                        if ball_dy != 0:
                            break
                    timeStartGame = timezone.now()
            await asyncio.sleep(1)

        logger.info('First send')
        await self.channel_layer.group_send(
            self.game_group_name,
            {
                "type": "state_update",
                "player_1": self.players[serv][player1_id],
                "player_2": self.players[serv][player2_id],
                "ball": {"ball_x": ball_x, "ball_y": ball_y, "ball_dx": ball_dx, "ball_dy": ball_dy, "ball_speed": ball_speed},
                "isGoal": isGoal,
                "countdown": countdown,
                "isStarting": isStarting,
                "gameIsFinished": gameIsFinished,
            },
        )

        await asyncio.sleep(timePerFrame)

        while gameIsFinished==False and self.players[serv][player1_id]["isDisconnect"] == False and self.players[serv][player2_id]["isDisconnect"] == False:
            logger.info('Routine start')
            # Update coordinate of all player
            if (isGoal):

                while True and self.players[serv][player1_id]["isDisconnect"] == False and self.players[serv][player2_id]["isDisconnect"] == False:
                    if (self.players[serv][player1_id]["isReady"] == True and self.players[serv][player2_id]["isReady"] == True):
                        break
                    await asyncio.sleep(1)

                self.players[serv][player1_id]["x"] = 0 - field_length / 2
                self.players[serv][player1_id]["y"] = 0
                self.players[serv][player1_id]["move"] = "none"
                self.players[serv][player2_id]["x"] = 0 + field_length / 2
                self.players[serv][player2_id]["y"] = 0
                self.players[serv][player2_id]["move"] = "none"
                ball_x = 0
                ball_y = 0
                ball_dx = 0
                ball_dy = 0
                ball_speed = 5
                isGoal = False

                await self.channel_layer.group_send(
                self.game_group_name,
                {
                    "type": "state_update",
                    "player_1": self.players[serv][player1_id],
                    "player_2": self.players[serv][player2_id],
                    "ball": {"ball_x": ball_x, "ball_y": ball_y, "ball_dx": ball_dx, "ball_dy": ball_dy, "ball_speed": ball_speed},
                    "isGoal": isGoal,
                    "countdown": countdown,
                    "isStarting": isStarting,
                    "gameIsFinished": gameIsFinished,
                },
                )
                await asyncio.sleep(1)

                ball_dx = random.choice([-1, 1])
                while True:
                    ball_dy = random.uniform(-0.5, 0.5)
                    if ball_dy != 0:
                        break
                isGoal = False
                
                await self.channel_layer.group_send(
                self.game_group_name,
                {
                    "type": "state_update",
                    "player_1": self.players[serv][player1_id],
                    "player_2": self.players[serv][player2_id],
                    "ball": {"ball_x": ball_x, "ball_y": ball_y, "ball_dx": ball_dx, "ball_dy": ball_dy, "ball_speed": ball_speed},
                    "isGoal": isGoal,
                    "countdown": countdown,
                    "isStarting": isStarting,
                    "gameIsFinished": gameIsFinished,
                },
                )

            elif (isGoal==False):
                logger.info('Not goal')
                for player in self.players[serv].values():
                    if player["move"] == "up":
                        player["y"] -= player_speed * timePerFrame
                    if player["move"] == "down":
                        player["y"] += player_speed * timePerFrame
                    if player["y"] <= -field_high/2 + player_size:
                        player["y"] = -field_high/2 + player_size
                    if player["y"] >= field_high/2 - player_size:
                        player["y"] = field_high/2 - player_size
                
                # Update coordinate of the ball
                ball_x += ball_speed * ball_dx * timePerFrame
                ball_y += ball_speed * ball_dy * timePerFrame
                # Check collision

                # Ball collision with upper wall or down wall
                if ((ball_y - ball_size) <= -field_high/2 or (ball_y + ball_size) >= +field_high/2): 
                    ball_dy *= -1

                # Ball collision with left/right wall (Goal)
                if ((ball_x - ball_size) <= (-field_length/2) - 1): # collision with left wall detected, player_2 score a goal
                    self.players[serv][player2_id]["score"] += 1
                    self.players[serv][player2_id]["isReady"] = False
                    self.players[serv][player1_id]["isReady"] = False
                    isGoal = True
                    logger.info('GOAL FOR PLAYER 2 :\n\n%s %s ------ %s %s\n\n', ball_x, ball_y, self.players[serv][player1_id]["x"], self.players[serv][player1_id]["y"])
                if ((ball_x + ball_size) >= (field_length/2) + 1): # collision with right wall detected, player_1 score a goal
                    self.players[serv][player1_id]["score"] += 1
                    self.players[serv][player2_id]["isReady"] = False
                    self.players[serv][player1_id]["isReady"] = False
                    isGoal = True
                    logger.info('GOAL FOR PLAYER 1 :\n\n%s %s ------ %s %s\n\n', ball_x, ball_y, self.players[serv][player2_id]["x"], self.players[serv][player2_id]["y"])

                # Ball collision with player
                if (ball_dx > 0): # Check collision with player_2
                    if (abs((ball_x + ball_size) - self.players[serv][player2_id]["x"]) < 0.2 and abs(ball_y - self.players[serv][player2_id]["y"]) < player_size): # Collision detected
                        ball_dx *= -1
                        ball_dy = (ball_y - self.players[serv][player2_id]["y"]) / player_size
                        ball_speed += ball_speed_gain_per_hit
                        logger.info('COLLISION WITH PLAYER 2 :\n\n%s %s ------ %s %s\n\n', ball_x, ball_y, self.players[serv][player2_id]["x"], self.players[serv][player2_id]["y"])
                if (ball_dx < 0): # Check collision with player_1
                    if (abs((ball_x - ball_size) - self.players[serv][player1_id]["x"]) < 0.2 and abs(ball_y - self.players[serv][player1_id]["y"]) < player_size): # Collision detected
                        ball_dx *= -1
                        ball_dy = (ball_y - self.players[serv][player1_id]["y"]) / player_size
                        ball_speed += ball_speed_gain_per_hit
                        logger.info('COLLISION WITH PLAYER 1 :\n\n%s %s ------ %s %s\n\n', ball_x, ball_y, self.players[serv][player1_id]["x"], self.players[serv][player1_id]["y"])
            
            # Send signal when game is finished
            if (self.players[serv][player1_id]["score"] == 5 or self.players[serv][player2_id]["score"] == 5):
                gameIsFinished = True
                if (self.players[serv][player1_id]["score"] == 5):
                    self.players[serv][player1_id]["isWin"] = True
                if (self.players[serv][player2_id]["score"] == 5):
                    self.players[serv][player2_id]["isWin"] = True

            # Send info to all player
            countForInfo += 1
            if countForInfo == 60 / nbInfoPerSecond or gameIsFinished or isGoal:
                await self.channel_layer.group_send(
                    self.game_group_name,
                    {
                        "type": "state_update",
                        "player_1": self.players[serv][player1_id],
                        "player_2": self.players[serv][player2_id],
                        "ball": {"ball_x": ball_x, "ball_y": ball_y, "ball_dx": ball_dx, "ball_dy": ball_dy, "ball_speed": ball_speed},
                        "isGoal": isGoal,
                        "countdown": countdown,
                        "isStarting": isStarting,
                        "gameIsFinished": gameIsFinished,
                    },
                )
                countForInfo = 0

            await asyncio.sleep(timePerFrame)

        if (self.players[serv][player1_id]["isDisconnect"] == True):
            self.players[serv][player2_id]["isWin"] = True
            self.players[serv][player1_id]["isWin"] = False
        if (self.players[serv][player2_id]["isDisconnect"] == True):
            self.players[serv][player1_id]["isWin"] = True
            self.players[serv][player2_id]["isWin"] = False

        if (self.players[serv][player1_id]["isDisconnect"] == True or self.players[serv][player2_id]["isDisconnect"] == True and gameIsFinished == False):
            gameIsFinished = True
            await self.channel_layer.group_send(
                self.game_group_name,
                {
                    "type": "state_update",
                    "player_1": self.players[serv][player1_id],
                    "player_2": self.players[serv][player2_id],
                    "ball": {"ball_x": ball_x, "ball_y": ball_y, "ball_dx": ball_dx, "ball_dy": ball_dy, "ball_speed": ball_speed},
                    "isGoal": isGoal,
                    "countdown": countdown,
                    "isStarting": isStarting,
                    "gameIsFinished": gameIsFinished,
                },
            )

        timeEndGame = timezone.now()
        timeGame = (timeEndGame - timeStartGame).total_seconds()
        player1 = self.players[serv][player1_id]
        player2 = self.players[serv][player2_id]
        updateUserStatistic(player1["idPlayer"], player1["isWin"], player1["nbTouchBall"], player1["nbAce"], player1["nbLongestExchange"], player1["score"], player2["score"])
        updateUserStatistic(player2["idPlayer"], player2["isWin"], player2["nbTouchBall"], player2["nbAce"], player2["nbLongestExchange"], player2["score"], player1["score"])
        
        from . models import HistoryModel, GameServerModel
        await sync_to_async(HistoryModel.objects.create)(userId=player1["idPlayer"], userUsername=player1["username"], opponentId=player2["idPlayer"], opponentUsername=player2["username"], userScore=player1["score"], opponentScore=player2["score"], isWin=player1["isWin"], gameDate=date.today(), gameTime=timeGame)
        await sync_to_async(HistoryModel.objects.create)(userId=player2["idPlayer"], userUsername=player2["username"], opponentId=player1["idPlayer"], opponentUsername=player1["username"], userScore=player2["score"], opponentScore=player1["score"], isWin=player2["isWin"], gameDate=date.today(), gameTime=timeGame)
        try:
            game_server = await sync_to_async(GameServerModel.objects.get)(pk=int(serv))
            if not game_server:
                logger.info('GameServerModel Not Found : %s', error)
            logger.info("---------------------------------------------------")
            logger.info("%s", game_server.serverId)
            logger.info("%s", game_server.firstPlayerId)
            logger.info("%s", game_server.secondPlayerId)
            logger.info("%s", game_server.state)
            logger.info("---------------------------------------------------")
            await sync_to_async(game_server.delete)()
        except Exception as error:
            logger.info("Error in GameServerModel--------------- : %s", error)