def updateUserOption(user_id, language, color, music, key1, key2, key3, key4):
    from . models import AppUser
    user = AppUser.objects.get(pk=user_id)

    user.language = language
    user.color = color
    user.music = int(music)
    user.key1 = key1
    user.key2 = key2
    user.key3 = key3
    user.key4 = key4

    user.save()

import logging
from django.conf import settings
def ManageGameQueue():
    logger = logging.getLogger(__name__)
    if (settings.IS_SEARCHING == False):
        settings.IS_SEARCHING = True
        from . models import GameServerModel, WaitingPlayerModel
        game_server = GameServerModel.objects.filter(state='waiting').first()
        if game_server:
            if game_server.firstPlayerId == -1:
                player1 = WaitingPlayerModel.objects.first()
                if player1:
                    game_server.firstPlayerId = player1.player_id
                    game_server.save()
                    player1.delete()

            if game_server.secondPlayerId == -1:
                player2 = WaitingPlayerModel.objects.first()
                if player2:
                    game_server.secondPlayerId = player2.player_id
                    game_server.save()
                    player2.delete()

            # Actualiser le game_server avec player info et change le game_server en full
            if game_server.firstPlayerId != -1 and game_server.secondPlayerId != -1:
                game_server.state = 'full'
                game_server.save()
        else:
            GameServerModel.objects.create()
        settings.IS_SEARCHING = False
    else:
        settings.IS_SEARCHING = False


from rest_framework.authtoken.models import Token
def create_user_token(user):
    token, created = Token.objects.get_or_create(user=user)
    return token