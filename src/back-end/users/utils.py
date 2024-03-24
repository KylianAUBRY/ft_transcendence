def updateUserStatistic(user_id, isWin, nbTouchedBall, nbAce, nbLongestExchange, nbPointMarked, nbPointLose):
    from . models import AppUser
    user = AppUser.objects.get(pk=user_id)

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

def updateUserOption(user_id, language, color, music, key1, key2, key3, key4):
    from . models import AppUser
    user = AppUser.objects.get(pk=user_id)

    user.language = language
    user.color = color
    user.music = music
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

            logger.info('Game server find: ' + game_server.serverId)
            if game_server.firstPlayerId == -1:
                player1 = WaitingPlayerModel.objects.first()
                if player1:
                    logger.info('player1 find : ' + player1.player_id)
                    game_server.firstPlayerId = player1.player_id
                    game_server.save()
                    player1.delete()

            if game_server.secondPlayerId == -1:
                player2 = WaitingPlayerModel.objects.first()
                if player2:
                    logger.info('player2 find : ' + player2.player_id)
                    game_server.firstPlayerId = player2.player_id
                    game_server.save()
                    player2.delete()

            # Actualiser le game_server avec player info et change le game_server en full
            if game_server.firstPlayerId != -1 and game_server.secondPlayerId != -1:
                logger.info('Game full')
                game_server.state = 'full'
                game_server.save()
        else:
            logger.info('Game server model created')
            GameServerModel.objects.create()
        settings.IS_SEARCHING = False