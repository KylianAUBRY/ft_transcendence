all: build
	cd src/ && docker-compose up -d

build: 
	@DJANGO_PROTOCOL=$$(grep '^DJANGO_PROTOCOL=' src/.env | cut -d'=' -f2); \
	if [ "$$DJANGO_PROTOCOL" = "https" ]; then \
    	NGINX_PORT="443:443"; \
	elif [ "$$DJANGO_PROTOCOL" = "http" ]; then \
	    NGINX_PORT="8000:8000"; \
	else \
    	echo "Valeur invalide pour DJANGO_PROTOCOL dans le fichier .env"; \
		exit 1; \
	fi; \
    echo NGINX_PORT=$$NGINX_PORT; \
	cd src/ && docker-compose build

dev:
	cd src/ && docker compose -f docker-compose-dev.yml up -d --build

up:
	cd src/ && docker-compose -f docker-compose.yml up -d
	
stop:
	cd src/ && docker-compose -f docker-compose.yml stop

clean:
	cd src/ && docker-compose -f docker-compose.yml down -v

cleanDev:
	cd src/ && docker-compose -f docker-compose-dev.yml down -v

fclean:
	$(MAKE) clean
	docker system prune --force --volumes --all

fcleanDev:
	$(MAKE) cleanDev
	docker system prune --force --volumes --all
	
re: stop clean build
