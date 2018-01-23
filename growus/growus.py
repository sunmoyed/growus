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

from flask import Flask, render_template

app = Flask(__name__, static_folder="../static", template_folder="../templates")

@app.route("/")
def hello():
	return "Let's grow us!"

if __name__ == "__main__":
	app.run(port=9001)
