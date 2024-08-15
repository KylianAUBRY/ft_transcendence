# ft_transcendence

Le dernier projet de l'école 42, Il consiste à créer un site web permettant de jouer au célèbre jeu Pong !
Nous avons le choix des modules à implementer pour personnaliser les projets selon nos envies, voici les modules que nous avons choisis :
- Utiliser un framework en backend
- Utiliser un framework ou toolkit en frontend
- Utiliser une base de données en backend
- Gestion utilisateur standard, authentification, utilisateurs en tournois
- oueurs à distance
- Multijoueurs (plus de 2 dans la même partie)
- Option de personnalisation du jeu
- Implémenter un adversaire contrôlé par IA
- anneaux d’affichage (dashboards) d’utilisateurs et statis-tiques des parties
- Utilisation de techniques avancées 3D
- Étendre la compatibilité des navigateurs web
- Support de multiple langues
- Remplacer le Pong de base par un Pong côté serveur et implémentation d’une API

  Pour une note finale de **125/100** !

---

  Nous avons donc utilisé les technos suivantes :
  - React.js <img src="./img/react.png" alt="React.js" width="20" height="20">
  - Python Django <img src="./img/django.png" alt="Django" width="20" height="20">
  - PostgreSQL <img src="./img/Postgresql.png" alt="PostgreSQL" width="20" height="20">
  - NGINX <img src="./img/nginx.png" alt="NGINX" width="20" height="20">
  - Docker <img src="./img/docker.svg" alt="Docker" width="20" height="20">

  ---

## Video

<img src="./img/presvideo.gif" alt="video de presentation" width="500">

## Déploiement

Pour démarrer le projet il suffit de créer le fichier .env suivant et lancer la commande "make"

```
# .env

DJANGO_ALLOWED_HOSTS=localhost

# for database 

POSTGRES_DB=postgres
POSTGRES_USER=admin
POSTGRES_PASSWORD=test


# for database setting django

DATABASE_HOST_NAME=db
DATABASE_PORT=5432

# for api 42

API_CLIENT_ID=u-s4t2ud-40859762de2a4072cb139bfca75f0ab1a1bd1eceeab15abcf0b64bcd3f4ad095
API_CLIENT_SECRET=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
API_CONNECT_URL=https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-40859762de2a4072cb139bfca75f0ab1a1bd1eceeab15abcf0b64bcd3f4ad095&redirect_uri=https%3A%2F%2F10.12.7.1%3A8000%2Fregister42&response_type=code
API_TOKEN_URL=https://api.intra.42.fr/oauth/token/
API_INFO_URL=https://api.intra.42.fr/v2/me
API_KEY=AsHPuDJtlxAEOSFymvJAlq3B8cewqSGEdZGLQ2XrX4AOZxwSEK
API_DEFAULT_PASSWORD=3Pbn0bxHcDA18LKcX541wi8U0rB

#For https

COUNTRY=FR
ORGANIZATION=42LeHavre
DOMAIN=kyaubry.42.fr
```



  
    
  
