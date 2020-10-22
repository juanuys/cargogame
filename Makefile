.PHONY: run dist test

dist:
	rm -rf docs/
	mkdir -p docs
	touch docs/_config.yml
	npm run dist

run:
	rm -rf dist/
	npm run start

test:
	npm run test
