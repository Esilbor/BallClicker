.PHONY: all build dev down clean fclean re test

HOST_USER = $(USER)
PROJECT_NAME = ballclicker
DATA_DIR = /home/$(USER)/data/$(PROJECT_NAME)

all: build

build:
	docker compose -f srcs/docker-compose.yml up --build -d

dev:
	docker compose -f srcs/docker-compose.yml up

down:
	docker compose -f srcs/docker-compose.yml down

clean:
	docker compose -f srcs/docker-compose.yml down -v
	rm -rf srcs/back/dist
	rm -rf srcs/front/dist

fclean: clean
	docker system prune -af

re: fclean build

install-deps:
	cd srcs/back && npm install
	cd srcs/front && npm install

test:
	cd srcs/back && npm test
