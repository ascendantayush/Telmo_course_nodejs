const express = require("express");
const path = require('path');
const mysql = require("mysql");
const dotenv = require('dotenv');
const hbs = require('hbs'); 

dotenv.config({ path: './.env' });

const app = express();

// Create a MySQL connection pool for better performance
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

const publicDirectory = path.join(__dirname, './public');
app.use(express.static(publicDirectory));

// Middleware for parsing URL-encoded and JSON data
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Set up Handlebars as the view engine
app.set('view engine', 'hbs');

// Connect to the MySQL database
db.connect((error) => {
    if (error) {
        console.error("Database connection failed: " + error.stack);
        return;
    }
    console.log("MYSQL Connected...");
});

// Define Routes
app.use('/', require('./routes/pages'));
app.use('/auth', require('./routes/auth'));

// Start the server
app.listen(5000, () => {
    console.log("Server started on port 5000");
});
