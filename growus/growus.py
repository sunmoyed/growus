"""
import os
from flask import Flask, request, session, g, redirect, url_for, abort \
	 render_template, flash

app = Flask(__name__)
app.config.from_object(__name__)

app.config.update(dict(
    DATABASE=os.path.join(app.root_path, 'flaskr.db'),
    SECRET_KEY='development key',
    USERNAME='admin',
    PASSWORD='default'
))

app.config.from_envvar('GROWUS_SETTINGS', silent=True)
"""

from flask import Flask, render_template, Response
from flask_cors import CORS
import json

app = Flask(__name__, static_folder="../web", template_folder="../templates")
app.config.from_object(__name__)

app.config.update(dict(
    SECRET_KEY='ayyy',
	CORS_HEADERS = 'Content-Type'
))

CORS(app)

@app.route("/")
def hello():
	return "Let's grow us!"

@app.route("/workout/random", methods = ['GET'])
def api_workout_random():
	workout = {"workout": ["squeeze doughnut", "stir-fry with cast iron pan", "ride bicycle!", "eat chocolate"]}
	js = json.dumps(workout)
	response = Response(js, status=200, mimetype="application/json")
	return response

if __name__ == "__main__":
	app.run(port=9001)
