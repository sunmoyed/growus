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

import json
import random

from flask import Flask, render_template, Response, request
from flask_cors import CORS

import models

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

# returns a random list of a user's exercises
@app.route("/workout/random", methods = ['GET'])
def api_workout_random():
	exercises = ["squeeze doughnut", "stir-fry with cast iron pan", "ride bicycle!", "eat chocolate"]

	# randomize 1) number of exercises returned 2) which exercises are returned
	numExercises = random.randint(1, len(exercises)) 
	workout = { "workout" : random.sample(exercises, numExercises) }

	js = json.dumps(workout)
	response = Response(js, status=200, mimetype="application/json")
	return response

# inserts a single exercise for a user
@app.route("/exercises/create", methods = ['POST'])
def api_exercises_create():
	exercise_type = request.form['type']
	user_id = request.form['userId']
	name = request.form['name']
	description = request.form['description']

	models.insert_exercise(exercise_type, user_id, name, description)
	exercise = {"exercise_type" : exercise_type, 
				"user_id" : user_id,
				"name" : name,
				"description" : description}

	js = json.dumps(exercise)
	response = Response(js, status=200, mimetype="application/json")
	return response

# remove all exercises associated with a user
@app.route("/exercises/clear", methods = ['POST'])
def api_exercises_clear():
	user_id = request.form['userId']

	models.delete_all_exercises(user_id)
	return 'deleted exercises from user ' + str(user_id)

# show all exercises associated with a user (uses fetchall method. consider cursor method)
@app.route("/exercises/all", methods = ["GET"])
def api_exercises_all():
	user_id = request.form['userId']

	linkdata = models.show_all_exercises(user_id)
	all_exercises = { "all_exercises" : linkdata }
	
	js = json.dumps(all_exercises)
	response = Response(js, status=200, mimetype="application/json")
	return response

if __name__ == "__main__":
	app.run(port=9001)
