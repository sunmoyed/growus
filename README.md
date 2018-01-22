Setup Instructions

1. Install virtualenv: http://flask.pocoo.org/docs/0.12/installation/
2. Obtain the path to your python3 version using `which python3`
3. Create a new virtual environment (called "env") using `virtualenv -p [your path to python3] env`.
4. Activate the virtual environment using `. env/bin/activate`
5. Install Flask inside the virtual environment using `pip install Flask`

Development Instructions

1. When you work on a project, activate the virtual environment using the command: `. env/bin/activate`
2. To run the project, cd into growus/growus and run `python3 growus.py`.
3. Go to localhost:5000 in the browser to grow us.