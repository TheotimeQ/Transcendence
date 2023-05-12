DOCKER_COMPOSE = docker compose
DOCKER_COMPOSE_FILE = ./Dockers/docker-compose.yml

.phony : setup start stop re clean build log reback refront redata

all : setup start

setup :
	@echo "----Setup Docker-----------"

start : build
	@echo "----Starting all Docker----"
	mkdir -p ./Backend
	mkdir -p ./Frontend
	mkdir -p ./Database
	chmod 777 ./Backend
	chmod 777 ./Frontend
	chmod 777 ./Database
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) up #-d
	@echo "----All Docker started-----"
	rm -rf ./Backend/.git

stop :
	@echo "----Stopping all Docker----"
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) stop
	@echo "----All Docker stopped-----"

build :
	@echo "----Building all Docker----"
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) build
	@echo "----All Docker built-------"

clean : stop
	@echo "----Cleaning all Docker----"
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) down --rmi all --remove-orphans
	@echo "----All Docker cleaned-----"

log :
	@echo "----Status Docker----------"
	docker ps

refront :
	@echo "----Restarting Frontend----"
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) restart frontend

reback :
	@echo "----Restarting Backend-----"
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) restart backend

redata :
	@echo "----Restarting Database----"
	$(DOCKER_COMPOSE) -f $(DOCKER_COMPOSE_FILE) restart database

re : clean start
