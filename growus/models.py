import sqlite3

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
    with sqlite3.connect("database.db") as con:
        cur = con.cursor()
        # check if user id exists
        cur.execute("SELECT * FROM Exercises WHERE OwnerId = ?", (user_id))
        linkdata = cur.fetchall()
        return linkdata


# def query():

# def update():