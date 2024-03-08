-- Connect to your database
\connect destiny_stat_tracker_test

-- Drop the tables if they exist
DROP TABLE IF EXISTS metrics; 
DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS users;

-- Create the users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    display_name TEXT, -- The unique display name created by the user in Destiny 2
    membership_type INTEGER, -- Indentifier for the console primarily used to play the game
    membership_id BIGINT -- Unique id given to every user
);

-- Create the groups table
CREATE TABLE groups (
    id SERIAL PRIMARY KEY,
    name TEXT -- The sub categories of each metrics: Career, Seasonal, Weekly
);

-- Create the categories table
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name TEXT -- The categories of metric, based on activites in the game
);

-- Create the metrics table
CREATE TABLE metrics (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id), 
    group_id INTEGER REFERENCES groups(id),
    category_id INTEGER REFERENCES categories(id),
    name TEXT, -- Name of each metric
    description TEXT, -- The description of each metric
    progress INTEGER -- Progress of each metric
);




