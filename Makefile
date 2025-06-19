# Executables (local)
DOCKER_COMP = docker compose

createenv: ## Create a .env file from the .env.example
	@cp .env.example .env

## —— Docker 🐳 ————————————————————————————————————————————————————————————————
build: ## Builds the Docker images
	@$(DOCKER_COMP) build --pull --no-cache

up: ## Start the docker hub in detached mode (no logs)
	@$(DOCKER_COMP) up --detach

start: createenv build up ## Create env., build and start the containers

down: ## Stop the docker hub
	@$(DOCKER_COMP) down -v --remove-orphans