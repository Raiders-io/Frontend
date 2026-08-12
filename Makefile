build:
	npm run build

deploy:
	make -C ../../

lint:
	npx prettier --write src/components/*[^ui]

generate-sitemap:
	npm run generate:sitemap
