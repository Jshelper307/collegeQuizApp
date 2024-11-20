const mysql = require('mysql2');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
let instance = null;
dotenv.config();
// create connection
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DB_PORT || 3307,
});

connection.connect((error)=>{
    if(error){
        console.log(error.message);
    }
    console.log("db is connected..");
})

// These db service maintain login and registration functions
// callable functions are
    // 1. registerUser
    // 2. loginUser
class DbService{
    static getDbServiceInstance(){
        return instance ? instance : new DbService();
    }
    hashPassword = (password) => {
        return bcrypt.hashSync(password, 10); // Using 10 salt rounds
    };
      
    async registerUser(password,firstname,lastname,email,phone,college,universityrollnumber){
        const username = this.calculateStudentId(firstname,lastname,universityrollnumber);
        // Hash the password before storing it
        const hashedPassword = this.hashPassword(password);
    
        // SQL query to insert username and hashed password
        const queryforstudentlogin = "INSERT INTO studentlogin (username, password) VALUES (?, ?)";
        const queryforstudentdetails = "INSERT INTO studentdetails (studentid,firstname,lastname,email,phone,college,universityrollnumber) VALUES (? , ? , ? , ? , ? , ? , ?)"
    
        // Execute the MySQL query
        const setLogin = await new Promise((resolve,reject)=>{
            connection.execute(queryforstudentlogin, [username, hashedPassword], (err, results) => {
            if (err) {
                console.error("Error inserting userlogin:", err);
                reject(new Error(err.message))
            } else {
                console.log("User successfully registered!");
                //Here code for sending message of the username and password in user's phone
                resolve(results);
            }
            });
        })
        if(setLogin){
            const result = await new Promise((resolve,reject)=>{
                connection.execute(queryforstudentdetails, [username,firstname,lastname,email,phone,college,universityrollnumber], (err, results) => {
                if (err) {
                    console.error("Error inserting userdetails:", err);
                    reject(new Error(err.message));
                } else {
                    console.log("User successfully registered!");
                    resolve(results);
                }
                });
            });

            return result;
        }
    };
    
    calculateStudentId(fname="",lname="",urollNum){
        return urollNum+fname.charAt(0).toUpperCase()+lname.charAt(0).toUpperCase();
    } 




    async verifyUser(username, inputPassword){
        // SQL query to get the hashed password by username
        const query = 'SELECT password FROM studentlogin WHERE username = ?';
        // Execute the query
        const result = await new Promise((resolve,reject)=>{
            connection.execute(query, [username], (err, results) => {
                if (err) {
                    console.error('Error fetching user details:', err);
                    reject(new Error(err.message));
                } 
                else if (results.length > 0) {
                    const storedHashedPassword = results[0].password;
                
                    // Compare the input password with the stored hashed password
                    const isPasswordCorrect = bcrypt.compareSync(inputPassword, storedHashedPassword);
            
                    if (isPasswordCorrect) {
                        console.log('Password is correct!');
                        resolve({success:true,message:"logged in..."});
                    } else {
                        console.log('Incorrect password.');
                        reject({success:false,message:"Invalid Password"});
                    }
                } 
                else {
                    console.log('User not found.',results);
                    reject({success:false,message:"User not Found"});
                }
            });
        });

        return result;
    };
        

    async login(userName,password){
        const result = await this.verifyUser(userName,password);
        return result;
    }
}

module.exports = DbService;