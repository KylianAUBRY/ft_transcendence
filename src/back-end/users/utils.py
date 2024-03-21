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
    user.color = int(color)
    user.music = int(music)
    user.key1 = key1
    user.key2 = key2
    user.key3 = key3
    user.key4 = key4

    user.save()