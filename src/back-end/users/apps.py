from django.apps import AppConfig
from django.conf import settings
import asyncio

async def ManageGameQueue():
    from . models import GameServerModel, WaitingPlayerModel
    while True:
        game_server = GameServerModel.objects.filter(status='waiting').first()
        if game_server:

            while True:
                player1 = WaitingPlayerModel.objects.first()
                if player1:
                    break
                await asyncio.sleep(0.1)
            player1Id = player1.player_id
            player1.objects.delete()

            while True:
                player2 = WaitingPlayerModel.objects.first()
                if player2:
                    break
                await asyncio.sleep(0.1)
            player2Id = player2.player_id
            player2.objects.delete()

            # Actualiser le game_server avec player info et change le game_server en full
            game_server.firstPlayerId = player1Id
            game_server.secondPlayerId = player2Id
            game_server.state = 'full'
            game_server.save()

        game_server = None
        await asyncio.sleep(0.1)

class UsersConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'users'

    def ready(self):
        loop = asyncio.get_event_loop()
        loop.create_task(ManageGameQueue())
