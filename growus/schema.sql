DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS WorkoutsExercises;
DROP TABLE IF EXISTS Workouts;
DROP TABLE IF EXISTS Exercises;

CREATE TABLE Users (
    Id		INTEGER	    PRIMARY KEY	AUTOINCREMENT, 
    User	VARCHAR(32) UNIQUE NOT NULL, 
    Pass	VARCHAR(32) NOT NULL, 
    Level	CHAR(1)     NOT NULL
);

CREATE TABLE WorkoutsExercises (
    WorkoutId	INTEGER	NOT NULL, 
    ExerciseId	INTEGER	NOT NULL, 

    PRIMARY KEY (WorkoutId, ExerciseId), 
    FOREIGN KEY (ExerciseId) REFERENCES Exercises(Id), 
    FOREIGN KEY (WorkoutId) REFERENCES Workouts(Id)
);

CREATE TABLE Workouts (
    OwnerId		INTEGER 	NOT NULL, 
    Id			INTEGER 	PRIMARY KEY AUTOINCREMENT, 
    Title		TEXT		DEFAULT 'Strength recipe', 
    Description	TEXT, 

    FOREIGN KEY (OwnerId) REFERENCES Users(Id)
);

CREATE TABLE Exercises (
    Id			INTEGER	    PRIMARY KEY AUTOINCREMENT, 
    Type        CHAR(1)	    NOT NULL, 
    OwnerId		INTEGER	    NOT NULL, 
    Name		TEXT		NOT NULL, 
    Description	TEXT, 

    FOREIGN KEY (OwnerId) REFERENCES Users(Id)
);
