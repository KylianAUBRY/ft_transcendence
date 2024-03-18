all: build
	cd src/ && docker-compose up -d

build: 
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
