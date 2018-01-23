.PHONY: web-dev server-dev

web-dev:
	npm start --prefix web

server-dev:
	python3 growus/growus.py
