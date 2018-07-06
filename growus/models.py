from flask import g
import sqlite3

DATABASE = 'database.db'


# Getting database responses as dicts mapped with column names (instead of tuples)
# http://flask.pocoo.org/docs/1.0/patterns/sqlite3/
def get_db():
    def make_dicts(cursor, row):
        return dict((cursor.description[idx][0], value)
        for idx, value in enumerate(row))

    db = getattr(g, '_database', None)

    if db is None:
        db = g._database = sqlite3.connect(DATABASE)

    db.row_factory = make_dicts
    return db


def insert_exercise(exercise_type, user_id, name, description):
    # check if type is within the enum range
    # "with" block will close the connection automatically
    with sqlite3.connect("database.db") as con:
        cur = con.cursor()
        # check if user exists in Users
        cur.execute("INSERT INTO Exercises(Type, OwnerId, Name, Description) VALUES (?,?,?,?)", (exercise_type, user_id, name, description))
        con.commit()
    return

def delete_all_exercises(user_id):
    with sqlite3.connect("database.db") as con:
        cur = con.cursor()
        # check if user id exists
        cur.execute("DELETE FROM Exercises WHERE OwnerId = ?", (user_id))
        con.commit()
    return

def show_all_exercises(user_id):
    with get_db() as con:
        cur = con.cursor()
        # check if user id exists
        cur.execute("SELECT * FROM Exercises WHERE OwnerId = ?", (user_id))
        linkdata = cur.fetchall()
        return linkdata


# def query():

# def update():