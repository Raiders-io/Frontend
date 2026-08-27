build:
	npm run build

deploy:
	make -C ../../

lint:
	npx prettier --write src/components/*[^ui]

generate-sitemap:
	npm run generate:sitemap

translations:
	npx i18next-cli types
	npx i18next-cli instrument
	npx i18next-cli extract
