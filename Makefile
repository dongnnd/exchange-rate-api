# Node.js Express Boilerplate Makefile
# Usage: make <command>

.PHONY: help install dev start test test-watch lint lint-fix prettier clean docker-dev docker-prod docker-test

# Default target
help:
	@echo "Available commands:"
	@echo "  install     - Install dependencies"
	@echo "  dev         - Start development server with nodemon"
	@echo "  start       - Start production server with PM2"
	@echo "  test        - Run tests"
	@echo "  test-watch  - Run tests in watch mode"
	@echo "  coverage    - Run tests with coverage"
	@echo "  lint        - Check ESLint"
	@echo "  lint-fix    - Fix ESLint errors automatically"
	@echo "  prettier    - Check Prettier formatting"
	@echo "  prettier-fix - Fix Prettier formatting"
	@echo "  check       - Run lint + prettier check"
	@echo "  fix         - Fix all code quality issues"
	@echo "  clean       - Clean node_modules and logs"
	@echo "  docker-dev  - Start development environment with Docker"
	@echo "  docker-prod - Start production environment with Docker"
	@echo "  docker-test - Start test environment with Docker"
	@echo "  db-start    - Start MongoDB with Docker"
	@echo "  db-stop     - Stop MongoDB"
	@echo "  get-token   - Get authentication token"
	@echo "  cron-start  - Start cron jobs"
	@echo "  cron-stop   - Stop cron jobs"
	@echo "  cron-status - Check cron job status"
	@echo "  crawl-priority - Crawl priority currencies"
	@echo "  crawl-smart - Run smart crawl"
	@echo "  crawl-batches - Run batch crawl"
	@echo "  setup       - Setup project (install + db)"
	@echo "  dev-workflow - Full development workflow"
	@echo "  deploy      - Production deployment check"

# Install dependencies
install:
	@echo "Installing dependencies..."
	npm install

# Development
dev:
	@echo "Starting development server..."
	npm run dev

# Production
start:
	@echo "Starting production server..."
	npm start

# Testing
test:
	@echo "Running tests..."
	npm test

test-watch:
	@echo "Running tests in watch mode..."
	npm run test:watch

coverage:
	@echo "Running tests with coverage..."
	npm run coverage

# Code quality
lint:
	@echo "Checking ESLint..."
	npm run lint

lint-fix:
	@echo "Fixing ESLint errors..."
	npm run lint:fix

prettier:
	@echo "Checking Prettier formatting..."
	npm run prettier

prettier-fix:
	@echo "Fixing Prettier formatting..."
	npm run prettier:fix

# Code quality check (lint + prettier)
check: lint prettier
	@echo "Code quality check completed!"

# Fix all code quality issues
fix: lint-fix prettier-fix
	@echo "All code quality issues fixed!"

# Clean up
clean:
	@echo "Cleaning up..."
	rm -rf node_modules
	rm -rf logs
	rm -rf coverage
	rm -rf .nyc_output
	rm -rf dist
	@echo "Cleanup completed!"

# Docker commands
docker-dev:
	@echo "Starting development environment with Docker..."
	docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

docker-prod:
	@echo "Starting production environment with Docker..."
	docker-compose -f docker-compose.yml -f docker-compose.prod.yml up

docker-test:
	@echo "Starting test environment with Docker..."
	docker-compose -f docker-compose.yml -f docker-compose.test.yml up

# Database commands
db-start:
	@echo "Starting MongoDB with Docker..."
	docker-compose -f docker-compose.mongodb.yml up -d

db-stop:
	@echo "Stopping MongoDB..."
	docker-compose -f docker-compose.mongodb.yml down

# Get authentication token
get-token:
	@echo "Getting authentication token..."
	@chmod +x scripts/get-token.sh
	@./scripts/get-token.sh

# Cron job management (requires token)
cron-start:
	@echo "Starting cron jobs..."
	@if [ -z "$$API_TOKEN" ]; then \
		echo "Please set API_TOKEN environment variable or run 'make get-token' first"; \
		exit 1; \
	fi
	curl -X POST http://localhost:3000/v1/cron/start-all \
		-H "Authorization: Bearer $$API_TOKEN"

cron-stop:
	@echo "Stopping cron jobs..."
	@if [ -z "$$API_TOKEN" ]; then \
		echo "Please set API_TOKEN environment variable or run 'make get-token' first"; \
		exit 1; \
	fi
	curl -X POST http://localhost:3000/v1/cron/stop-all \
		-H "Authorization: Bearer $$API_TOKEN"

cron-status:
	@echo "Checking cron job status..."
	@if [ -z "$$API_TOKEN" ]; then \
		echo "Please set API_TOKEN environment variable or run 'make get-token' first"; \
		exit 1; \
	fi
	curl -X GET http://localhost:3000/v1/cron/status \
		-H "Authorization: Bearer $$API_TOKEN"

# Exchange rate crawling (requires token)
crawl-priority:
	@echo "Crawling priority currencies..."
	@if [ -z "$$API_TOKEN" ]; then \
		echo "Please set API_TOKEN environment variable or run 'make get-token' first"; \
		exit 1; \
	fi
	curl -X POST http://localhost:3000/v1/exchange-rates/crawl/priority \
		-H "Authorization: Bearer $$API_TOKEN"

crawl-smart:
	@echo "Running smart crawl..."
	@if [ -z "$$API_TOKEN" ]; then \
		echo "Please set API_TOKEN environment variable or run 'make get-token' first"; \
		exit 1; \
	fi
	curl -X POST http://localhost:3000/v1/exchange-rates/crawl/smart \
		-H "Authorization: Bearer $$API_TOKEN" \
		-H "Content-Type: application/json" \
		-d '{"maxAgeMinutes": 30}'

crawl-batches:
	@echo "Running batch crawl..."
	@if [ -z "$$API_TOKEN" ]; then \
		echo "Please set API_TOKEN environment variable or run 'make get-token' first"; \
		exit 1; \
	fi
	curl -X POST http://localhost:3000/v1/exchange-rates/crawl/batches \
		-H "Authorization: Bearer $$API_TOKEN" \
		-H "Content-Type: application/json" \
		-d '{"baseCurrency": "USD", "batchSize": 10, "delayMs": 1000}'

# Setup project (install + setup database)
setup: install db-start
	@echo "Project setup completed!"
	@echo "Run 'make dev' to start development server"

# Full development workflow
dev-workflow: fix test dev
	@echo "Development workflow completed!"

# Production deployment
deploy: install test check
	@echo "Deployment checks passed!"
	@echo "Ready for production deployment" 