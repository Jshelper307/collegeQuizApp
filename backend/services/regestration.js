const mysql = require("mysql2");
const bcrypt = require("bcryptjs");

let firstname = "Joy";
let lastname = "Sarkar";
let email = "joys18190@gmail.com";
let phone = "27600121023";
let college = "Budge Budge Institute of Technology";
let universityrollnumber= "27600121023";
let password = "789456";


const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DB_PORT || 3307,
});

const hashPassword = (password) => {
  return bcrypt.hashSync(password, 10); // Using 10 salt rounds
};

const registerUser = (password,firstname,lastname,email,phone,college,universityrollnumber) => {
    username = calculateStudentId(firstname,lastname,universityrollnumber);
    // Hash the password before storing it
    const hashedPassword = hashPassword(password);
  
    // SQL query to insert username and hashed password
    const queryforstudentlogin = "INSERT INTO studentlogin (username, password) VALUES (?, ?)";
    const queryforstudentdetails = "INSERT INTO studentdetails (studentid,firstname,lastname,email,phone,college,universityrollnumber) VALUES (? , ? , ? , ? , ? , ? , ?)"
  
    // Execute the MySQL query
    connection.execute(queryforstudentlogin, [username, hashedPassword], (err, results) => {
      if (err) {
        console.error("Error inserting userlogin:", err);
      } else {
        console.log("User successfully registered!");
      }
    });
    connection.execute(queryforstudentdetails, [username,firstname,lastname,email,phone,college,universityrollnumber], (err, results) => {
      if (err) {
        console.error("Error inserting userdetails:", err);
      } else {
        console.log("User successfully registered!");
      }
    });
  };

function calculateStudentId(fname="",lname="",urollNum){
    return urollNum+fname.charAt(0).toUpperCase()+lname.charAt(0).toUpperCase();
}

registerUser(password,firstname,lastname,email,phone,college,universityrollnumber);
