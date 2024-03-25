import json 
import uuid
import asyncio
import math
import random
import time
import logging

from datetime import date
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import async_to_sync
from . utils import updateUserStatistic
  
class GameRoom(AsyncWebsocketConsumer):
    players = {}

    # def __init__(self, *args, **kwargs):
    #     super().__init__(*args, **kwargs)
    #     self.players = {}

    async def connect(self): 
        name_serv = self.scope['url_route']['kwargs']['room_name']
        self.game_group_name = "game_%s" % name_serv
        self.player_id = str(uuid.uuid4())
        logger = logging.getLogger(__name__)
        logger.info('accept %s', self.player_id)
        await self.accept()
        
        logger.info('group add %s', self.player_id)
        await self.channel_layer.group_add(
            self.game_group_name, self.channel_name
        )

        logger.info('send %s', self.player_id)
        await self.send(
            text_data=json.dumps({"type": "playerId", "playerId": self.player_id})
        )

        logger.info('set %s', self.player_id)
        self.players[self.player_id] = {
            "idMatch": self.player_id,
            "idPlayer": 0,
            "isReady": False,
            "move" : "none",
            "username": "",
            "x" : 0,
            "y" : 0,
            "score": 0,
            "isWin": False,
            "nbTouchPerRound": 0,
            "nbTouchBall": 0,
            "nbAce": 0,
        }
        
        logger.info('set %s', self.player_id)
        if len(self.players) == 2:
            logger.info('launch game')
            asyncio.create_task(self.game_loop())
  
    async def disconnect(self, close_code): 
        logger = logging.getLogger(__name__)
        logger.info('Player disconnect %s', self.players[self.player_id]["idPlayer"])

        await self.channel_layer.group_discard(
            self.game_group_name, self.channel_name
        )

  
    async def receive(self, text_data): 
        text_data_json = json.loads(text_data)
        logger = logging.getLogger(__name__)

        idMatch = text_data_json["idMatch"]
        player_id = text_data_json["playerId"]
        orientation = text_data_json["playerDirection"]
        isReady = text_data_json["isReady"]
        username = text_data_json["username"]
        logger.info('%s', idMatch)
        logger.info('%s', player_id)
        logger.info('%s', orientation)
        logger.info('%s', isReady)
        logger.info('%s', username)
    
        player = self.players.get(idMatch, None)
        if not player:
            return
        logger.info('id Match -----------------> %s', player["idMatch"])
        
        player["move"] = orientation
        player["idMatch"] = idMatch
        player["idPlayer"] = player_id
        player["isReady"] = isReady
        player["username"] = username

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
            'player_1_username': player_1['username'],
            'player_1_y': player_1['y'],
            'player_2_idMatch': player_2['idMatch'],
            'player_2_id': player_2['idPlayer'],
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

    async def game_loop(self):
        logger = logging.getLogger(__name__)
        logger.info('innit info')
        field_high = 15.4
        field_length = 22
        player_speed = 2
        player_size = 1
        ball_x = field_length / 2
        ball_y = field_high / 2
        ball_dx = 0
        ball_dy = 0
        ball_speed = 2
        ball_speed_gain_per_hit = 0.2
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
        nbInfoPerSecond = 4

        timePerFrame = 0.0166

        i = 0
        logger.info('Will set player info')
        for player in self.players.values():
            logger.info('Set player info')
            if i == 0:
                player1_id = player["idMatch"]
                player["x"] = 0
                player["y"] = field_high / 2
                logger.info('%s', player1_id)
            elif i == 1:
                player2_id = player["idMatch"]
                player["x"] = 22
                player["y"] = field_high / 2
                logger.info('%s', player2_id)
            i += 1

        while isStarting==False:
            logger.info('Player ?')
            if len(self.players) == 2:
                logger.info('Two player log')
                if self.players[player1_id]["isReady"] == True:
                    logger.info("Player 1 ready")
                if self.players[player2_id]["isReady"] == True:
                    logger.info("Player 2 ready")
                if (self.players[player1_id]["isReady"] == True and self.players[player2_id]["isReady"] == True):
                    logger.info('Two player Ready')
                    isStarting = True
                    ball_dx = random.choice([-1, 1])
                    while True:
                        ball_dy = random.uniform(-0.5, 0.5)
                        if ball_dy != 0:
                            break
                    timeStartGame = time.time()
            await asyncio.sleep(1)

        logger.info('First send')
        await self.channel_layer.group_send(
            self.game_group_name,
            {
                "type": "state_update",
                "player_1": self.players[player1_id],
                "player_2": self.players[player2_id],
                "ball": {"ball_x": ball_x, "ball_y": ball_y, "ball_dx": ball_dx, "ball_dy": ball_dy, "ball_speed": ball_speed},
                "isGoal": isGoal,
                "countdown": countdown,
                "isStarting": isStarting,
                "gameIsFinished": gameIsFinished,
            },
        )

        await asyncio.sleep(timePerFrame)

        while gameIsFinished==False:
            logger.info('Routine start')
            # Update coordinate of all player
            if (isGoal):
                logger.info('Goal')
                self.players[player1_id]["x"] = 0
                self.players[player1_id]["y"] = field_high / 2
                self.players[player1_id]["move"] = "none"
                self.players[player2_id]["x"] = 22
                self.players[player2_id]["y"] = field_high / 2
                self.players[player2_id]["move"] = "none"
                ball_x = field_length / 2
                ball_y = field_high / 2
                ball_dx = 0
                ball_dy = 0
                ball_speed = 2
                isGoal = False

                await self.channel_layer.group_send(
                self.game_group_name,
                {
                    "type": "state_update",
                    "player_1": self.players[player1_id],
                    "player_2": self.players[player2_id],
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

                while True:
                    if (self.players[player1_id]["isReady"] == True and self.players[player2_id]["isReady"] == True):
                        break
                    await asyncio.sleep(1)
                
                await self.channel_layer.group_send(
                self.game_group_name,
                {
                    "type": "state_update",
                    "player_1": self.players[player1_id],
                    "player_2": self.players[player2_id],
                    "ball": {"ball_x": ball_x, "ball_y": ball_y, "ball_dx": ball_dx, "ball_dy": ball_dy, "ball_speed": ball_speed},
                    "isGoal": isGoal,
                    "countdown": countdown,
                    "isStarting": isStarting,
                    "gameIsFinished": gameIsFinished,
                },
                )

            elif (isGoal==False):
                logger.info('Not goal')
                for player in self.players.values():
                    if player["move"] == "up":
                        player["y"] -= player_speed * timePerFrame
                    if player["move"] == "down":
                        player["y"] += player_speed * timePerFrame
                    if player["y"] <= player_size:
                        player["y"] = player_size
                    if player["y"] >= field_high - player_size:
                        player["y"] = field_high - player_size
                    if i < 2:
                        i += 1
                
                # Update coordinate of the ball
                ball_x += ball_speed * ball_dx * timePerFrame
                ball_y += ball_speed * ball_dy * timePerFrame
                # Check collision

                # Ball collision with upper wall or down wall
                if ((ball_y - ball_size) <= 0 or (ball_y + ball_size) >= field_high): 
                    ball_y *= -1

                # Ball collision with left/right wall (Goal)
                if ((ball_x - ball_size) <= -0.1): # collision with left wall detected, player_2 score a goal
                    self.players[player2_id]["score"] += 1
                    self.players[player2_id]["isReady"] = False
                    self.players[player1_id]["isReady"] = False
                    isGoal = True
                if ((ball_x + ball_size) >= field_length + 0.1): # collision with right wall detected, player_1 score a goal
                    self.players[player1_id]["score"] += 1
                    self.players[player2_id]["isReady"] = False
                    self.players[player1_id]["isReady"] = False
                    isGoal = True

                # Ball collision with player
                if (ball_dx > 0): # Check collision with player_2
                    if (abs((ball_x + ball_size) - self.players[player2_id]["x"]) < 0.1 and abs(ball_y - self.players[player2_id]["y"]) < player_size): # Collision detected
                        ball_dx *= -1
                        ball_dy = (ball_y - self.players[player2_id]["y"]) / player_size
                        ball_speed += ball_speed_gain_per_hit
                if (ball_dx < 0): # Check collision with player_1
                    if (abs((ball_x - ball_size) - self.players[player1_id]["x"]) < 0.1 and abs(ball_y - self.players[player1_id]["y"]) < player_size): # Collision detected
                        ball_dx *= -1
                        ball_dy = (ball_y - self.players[player1_id]["y"]) / player_size
                        ball_speed += ball_speed_gain_per_hit
            
            # Send signal when game is finished
            if (self.players[player1_id]["score"] == 5 or self.players[player2_id]["score"] == 5):
                gameIsFinished = True
                if (self.players[player1_id]["score"] == 5):
                    self.players[player1_id]["isWin"] = True
                if (self.players[player2_id]["score"] == 5):
                    self.players[player2_id]["isWin"] = True

            # Send info to all player
            countForInfo += 1
            if countForInfo == 60 / nbInfoPerSecond:
                await self.channel_layer.group_send(
                    self.game_group_name,
                    {
                        "type": "state_update",
                        "player_1": self.players[player1_id],
                        "player_2": self.players[player2_id],
                        "ball": {"ball_x": ball_x, "ball_y": ball_y, "ball_dx": ball_dx, "ball_dy": ball_dy, "ball_speed": ball_speed},
                        "isGoal": isGoal,
                        "countdown": countdown,
                        "isStarting": isStarting,
                        "gameIsFinished": gameIsFinished,
                    },
                )
                countForInfo = 0

            await asyncio.sleep(timePerFrame)

        timeEndGame = time.time()
        timeGame = timeEndGame - timeStartGame
        player1 = self.players[player1_id]["idPlayer"]
        player2 = self.players[player2_id]["idPlayer"]
        updateUserStatistic(player1["idPlayer"], player1["isWin"], player1["nbTouchBall"], player1["nbAce"], player1["nbLongestExchange"], player1["score"], player2["score"])
        updateUserStatistic(player2["idPlayer"], player2["isWin"], player2["nbTouchBall"], player2["nbAce"], player2["nbLongestExchange"], player2["score"], player1["score"])
        from . models import HistoryModel
        HistoryModel.objects.create(userId=player1["idPlayer"], userUsername=player1["username"], opponentId=player2["idPlayer"], opponentUsername=player2["username"], userScore=player1["score"], opponentScore=player2["score"], isWin=player1["isWin"], gameDate=date.today(), gameTime=timeGame)
        HistoryModel.objects.create(userId=player2["idPlayer"], userUsername=player2["username"], opponentId=player1["idPlayer"], opponentUsername=player1["username"], userScore=player2["score"], opponentScore=player1["score"], isWin=player2["isWin"], gameDate=date.today(), gameTime=timeGame)
