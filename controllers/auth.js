const mysql = require("mysql");
const jwt = require('jsonwebtoken');  // Fixed typo here
const bcrypt = require('bcryptjs');

const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.register = async (req, res) => {  // Make this function async to use await
    console.log(req.body);

    const { name, email, password, passwordConfirm } = req.body;  // Fixed typo in variable name

    db.query('SELECT email FROM users WHERE email = ?', [email], async (error, results) => {  // Fixed syntax and typo
        if (error) {
            console.log(error);
            return res.status(500).send("Server error");  // Handle error response
        }

        if (results.length > 0) {  // Fixed method call
            return res.render('register', {
                message: 'That email is already in use'
            });
        } else if (password !== passwordConfirm) {  // Fixed typo and comparison operator
            return res.render('register', {
                message: "Passwords do not match"
            });
        }

        try {
            let hashedPassword = await bcrypt.hash(password, 8);
            console.log(hashedPassword);

            db.query('INSERT INTO users SET ?',{name: name,email: email, password: hashedPassword}, (error ,results)=>{
                if( error) {
                    console.log(error);
                } else{
                    return res.render('register',{
                        message: 'user regsitered'
                    });
                }
            })

            // Insert new user into the database here
            // db.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, hashedPassword], (error, results) => {
            //     if (error) {
            //         console.log(error);
            //         return res.status(500).send("Server error");
            //     }
            //     res.redirect('/login');  // Redirect to login page after successful registration
            // });
            
            res.send("Form submitted");  // You may want to redirect or render a success page
        } catch (err) {
            console.log(err);
            res.status(500).send("Server error");  // Handle bcrypt hashing error
        }
    });
};
