CREATE TABLE recipes (
    recipeId INTEGER PRIMARY KEY GENERATED BY DEFAULT AS IDENTITY,
    id TEXT,
    title TEXT NOT NULL, 
    servings TEXT,
    readyInMinutes TEXT,
    image TEXT
);
