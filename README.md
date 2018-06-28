# Setup Instructions

0. Clone the project locally: `git clone https://github.com/sunmoyed/growus.git` and enter the folder: `cd growus`
1. [Install virtualenv.](http://flask.pocoo.org/docs/0.12/installation/)
2. Obtain the path to your python3 version using `which python3`
3. Create a new virtual environment (called "env") using `virtualenv -p [your path to python3] env`.
4. Activate the virtual environment using `. env/bin/activate`
5. Install Flask inside the virtual environment using `pip install Flask`
6. Install Flask CORS using `pip install -U flask-cors`
7. To run the frontend, [install npm](https://www.npmjs.com/get-npm). Suggestion: install npm using nvm.

# Development Instructions

1. When you work on a project, activate the virtual environment using the command: `. env/bin/activate`
2. To run the dev server:
  ```
  make server-dev
  ```
  ...The API is now serving at http://localhost:9001

3. To run the dev ui:
  ```
  make web-dev
  ```
  ...Go to http://localhost:3000 in your browser of choice to grow us. \o/

# Devlopment Resources

Some useful links:
* [tutorial on basic RESTful API's with python/flask.](https://blog.miguelgrinberg.com/post/designing-a-restful-api-with-python-and-flask)
* [tutorial with database linking information.](http://flask.pocoo.org/docs/1.0/tutorial/ "delicious database deets")
* [a nice markdown cheatsheet.](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
