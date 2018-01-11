deploy:
	@docker exec swap sh -c './bin/deploy.sh'
	@./bin/alloc.sh
demo:
	@./bin/setupall

.PHONY: deploy
