deploy:
	@./bin/alloc.sh
	@docker exec swap sh -c './bin/deploy.sh'
demo:
	@./bin/setupall

.PHONY: deploy
