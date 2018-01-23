Setup Instructions

0. Clone the project locally: `git clone https://github.com/sunmoyed/growus.git` and enter the folder: `cd growus`
1. Install virtualenv: http://flask.pocoo.org/docs/0.12/installation/
2. Obtain the path to your python3 version using `which python3`
3. Create a new virtual environment (called "env") using `virtualenv -p [your path to python3] env`.
4. Activate the virtual environment using `. env/bin/activate`
5. Install Flask inside the virtual environment using `pip install Flask`

Development Instructions

1. When you work on a project, activate the virtual environment using the command: `. env/bin/activate`
2. To run the project, enter the project subfolder: `cd growus` (so that you are within the folder `growus/growus`) and run `python3 growus.py`.
3. Go to `localhost:9001` in the browser to grow us.
