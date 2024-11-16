const mysql = require("mysql2");
const bcrypt = require("bcryptjs");

const username = "27600121023JS";
const password = "789456";

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "1234",
  database: "collegequiz",
});

const verifyUser = (username, inputPassword) => {
// SQL query to get the hashed password by username
const query = 'SELECT password FROM studentlogin WHERE username = ?';

// Execute the query
connection.execute(query, [username], (err, results) => {
    if (err) {
    console.error('Error fetching user details:', err);
    } else if (results.length > 0) {
    const storedHashedPassword = results[0].password;

    // Compare the input password with the stored hashed password
    const isPasswordCorrect = bcrypt.compareSync(inputPassword, storedHashedPassword);

    if (isPasswordCorrect) {
        console.log('Password is correct!');
    } else {
        console.log('Incorrect password.');
    }
    } else {
    console.log('User not found.');
    }
});
};



verifyUser(username,password);
