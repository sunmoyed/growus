Setup Instructions

0. Clone the project locally: `git clone https://github.com/sunmoyed/growus.git` and enter the folder: `cd growus`
1. Install virtualenv: http://flask.pocoo.org/docs/0.12/installation/
2. Obtain the path to your python3 version using `which python3`
3. Create a new virtual environment (called "env") using `virtualenv -p [your path to python3] env`.
4. Activate the virtual environment using `source env/bin/activate`
5. Install Flask inside the virtual environment using `pip install Flask`
6. To run the frontend, install npm. Suggestion: install npm using nvm.

Development Instructions

1. When you work on a project, activate the virtual environment using the command: `. env/bin/activate`
2. To run the dev server:
  ```
  make server-dev
  ```
  The API is now serving at http://localhost:9001

3. To run the dev ui:
  ```
  make web-dev
  ```
  Go to http://localhost:3000 in your browser of choice to grow us. \o/
