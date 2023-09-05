-- init_db.sql

-- Create the database
CREATE DATABASE mydatabase;

-- Create the user
CREATE USER myuser WITH ENCRYPTED PASSWORD 'mypassword';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE mydatabase TO myuser;
