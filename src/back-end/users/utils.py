from . models import appuser

def updateUserStatistic(user_id, isWin, nbTouchedBall, nbAce, nbLongestExchange, nbPointMarked, nbPointLose):
    user = appuser.objects.get(pk=user_id)

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

def is_port_in_use(port: int) -> bool:
    import socket
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
        return s.connect_ex(('localhost', port)) == 0

    