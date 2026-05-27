.PHONY: up up-mock down logs build eval clean

up:
	@test -f .env || (echo "Create .env from .env.example first" && exit 1)
	docker compose --env-file .env up -d --build
	@echo ""
	@echo "Web:       http://localhost:8080"
	@echo "Inference: http://localhost:8000/health"
	@echo "Logs:      make logs"

up-mock:
	@test -f .env || (echo "Create .env from .env.example first" && exit 1)
	docker compose -f docker-compose.yml -f docker-compose.mock.yml --env-file .env up -d --build
	@echo ""
	@echo "Web:       http://localhost:8080   (full Spring stack)"
	@echo "Inference: http://localhost:8000   (MOCK — rule-based, no 8B weights)"
	@echo "Logs:      make logs"

down:
	docker compose down

logs:
	docker compose logs -f --tail=200

build:
	docker compose build

eval:
	python 7_eval/run_eval.py --base-url http://localhost:8000

clean:
	docker compose down -v
	rm -rf 6_spring_web/data
