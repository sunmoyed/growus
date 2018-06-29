# Setup Instructions

0. Clone the project locally: `git clone https://github.com/sunmoyed/growus.git` and enter the folder: `cd growus`
1. [Install virtualenv.](http://flask.pocoo.org/docs/0.12/installation/)
2. Obtain the path to your python3 version using `which python3`
3. Create a new virtual environment (called "env") using `virtualenv -p [your path to python3] env`.
4. Activate the virtual environment using `source env/bin/activate`
5. Install Flask inside the virtual environment using `pip install Flask`
6. Install Flask CORS using `pip install -U flask-cors`
7. To run the frontend, [install npm](https://www.npmjs.com/get-npm). Suggestion: install npm using nvm.

# Development Instructions

1. When you work on a project, activate the virtual environment using the command: `. env/bin/activate`
2. To run the dev server:
  ```
  make server-dev
  ```

 The API is now serving at http://localhost:9001

3. To run the dev ui:

  - go into the `web` folder and install the web packages: 
  
    ```
    cd web
    npm install
    ```
  
  - now run the development server! (from the root of the project, where the makefile is)
  
    ```
    make web-dev
    ```

  Go to http://localhost:3000 in your browser of choice to grow us. \o/

4. When you're done, you can deactivate the virtual environment using the command: `deactivate` 

# Devlopment Resources

Some useful links:
* [tutorial on writing basic RESTful API's with python/flask.](https://blog.miguelgrinberg.com/post/designing-a-restful-api-with-python-and-flask)
* [tutorial with database linking information.](http://flask.pocoo.org/docs/1.0/tutorial/ "delicious database deets")
* [another tutorial involving database connection.](https://programminghistorian.org/en/lessons/creating-apis-with-python-and-flask#connecting-our-api-to-a-database)
* [python3 SQLite documentation.](https://docs.python.org/3/library/sqlite3.html#sqlite3.Connection.commit)
* [a nice markdown cheatsheet.](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)
* [design doc on goog.](https://docs.google.com/document/d/1EJFLodL6f9SXBc96IhTbjdg0OXjra0GBdBfM1jHvxP4/edit)
* [strava api documentation and authentication information.](https://developers.strava.com/docs/reference/)
* [tutorial on connecting to API's with a python/flask app.](https://help.parsehub.com/hc/en-us/articles/217751808-API-Tutorial-How-to-get-run-data-using-Python-Flask)