.PHONY: web-dev server-dev

web-dev:
	npm start --prefix web

server-dev:
	python3 server/growus.py
