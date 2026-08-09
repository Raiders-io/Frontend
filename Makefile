build:
	npm run build

deploy:
	make -C ../../

lint:
	npx prettier --write src/components/*[^ui]
