import sqlite3

def insert_exercise(exercise_type, user_id, name, description):
    # check if type is within the enum range
    with sqlite3.connect("database.db") as con:
        cur = con.cursor()
        # check if user exists in Users
        cur.execute("INSERT INTO Exercises(Type, OwnerId, Name, Description) VALUES (?,?,?,?)", (exercise_type, user_id, name, description))
        con.commit()
    return

# def query():

# def update():