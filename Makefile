endpoint='http://qtum:test@localhost:3889'

deploy:
	@./bin/alloc.sh
	@docker exec swap sh -c './bin/deploy.sh'
demo:
	@./bin/gen_worker_abi
	@./bin/gen_worker_config `cat ./accounts/1 | tr '\n' ' '`${endpoint}
	@./bin/setupall

.PHONY: deploy
