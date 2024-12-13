const mysql = require('mysql2');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const nodemailer = require("nodemailer");
const validator = require('validator');
const teachers = require('../models/teachers');
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
        let result;
        // Hash the password before storing it
        const hashedPassword = this.hashPassword(password);
    
        // SQL query to insert username and hashed password
        const queryforstudentlogin = "INSERT INTO loginCredentials (username, password,isTeacher) VALUES (?, ?,?)";
        const queryforstudentdetails = "INSERT INTO studentdetails (studentid,firstname,lastname,email,phone,college,universityrollnumber) VALUES (? , ? , ? , ? , ? , ? , ?)"
    
        // Execute the MySQL query
        const setLogin = await new Promise((resolve,reject)=>{
            connection.execute(queryforstudentlogin, [username, hashedPassword,false], (err, results) => {
            if (err) {
                // console.error("Error inserting userlogin:", err);
                reject(new Error(err.message))
            } else {
                console.log("User successfully registered!");
                //Here code for sending message of the username and password in user's phone ,false
                resolve(results);
            }
            });
        })
        if(setLogin){
            result = await new Promise((resolve,reject)=>{
                connection.execute(queryforstudentdetails, [username,firstname,lastname,email,phone,college,universityrollnumber], (err, results) => {
                if (err) {
                    console.error("Error inserting userdetails:", err);
                    reject(new Error(err.message));
                } else {
                    console.log("User successfully registered!");
                    resolve({success:true,message:"User successfully registered!"});
                }
                });
            });

            try{
                const name = firstname+" "+lastname;
                await this.sendMailToUser(username,password,email,name);
            }
            catch(error){
                // console.log("Error for sending mail : ",error);
                result =await this.deleteUser(username);
                result.mailsend = false;
                // console.log("deleted : ",result);
            }

            return result;
        }
    };
    
    calculateStudentId(fname="",lname="",urollNum){
        return urollNum+fname.charAt(0).toUpperCase()+lname.charAt(0).toUpperCase();
    } 

    async deleteUser(userName){
        // SQL query to insert username and hashed password
        const queryforstudentlogin = "DELETE FROM loginCredentials WHERE username=?";
        const queryforstudentdetails = "DELETE FROM studentdetails WHERE studentid=?";
    
        // Execute the MySQL query
        const deleteLogin = await new Promise((resolve,reject)=>{
            connection.execute(queryforstudentlogin, [userName], (err, results) => {
            if (err) {
                console.error("Error deleting userlogin:", err);
                reject(new Error(err.message))
            } else {
                console.log("User successfully removed!");
                //Here code for sending message of the username and password in user's phone ,false
                resolve(results);
            }
            });
        })
        if(deleteLogin){
            const result = await new Promise((resolve,reject)=>{
                connection.execute(queryforstudentdetails, [userName], (err, results) => {
                if (err) {
                    console.error("Error removing userdetails:", err);
                    reject(new Error(err.message));
                } else {
                    console.log("User successfully Removed!");
                    resolve({success:false,error:"User Removed ."});
                }
                });
            });

            return result;
        }
    }


    // Add a teacher to the database and send a welcome email
    async addTeacher(name, email, department, contact, password) {
        // Validate email format
        if (!validator.isEmail(email)) {
            throw new Error("Invalid email format.");
        }
    
        // Validate phone number format
        if (!validator.isMobilePhone(contact, 'any')) {
            throw new Error("Invalid contact number.");
        }
    
        const teacherId = this.calculateteacherId(name, contact);
    
        try {
            // sendMail(teacherId,password);
            // Hash the password and insert into the database
            const hashedPassword = this.hashPassword(password);

            const queryforstudentlogin = "INSERT INTO loginCredentials (username, password,isTeacher) VALUES (?, ?,?)";
            const setLogin = await new Promise((resolve,reject)=>{
                connection.execute(queryforstudentlogin, [teacherId, hashedPassword,true], (err, results) => {
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
                const query = `
                    INSERT INTO teacherdetails (teacherid, name, email, department, contact)
                    VALUES (?, ?, ?, ?, ?)
                `;
                const result = await connection.promise().execute(query, [teacherId, name, email, department, contact]);
                const newTeacher = new teachers({teacher_id:teacherId,created_exams:[]});
                await newTeacher.save() ;
                try{
                    await this.sendMailToUser(teacherId,password,email,name);
                }
                catch(error){
                    console.log("Error for sending mail : ",error);
                }
                return { message: "Teacher registered successfully!", result };
            }
        } catch (error) {
            console.error("Failed to register teacher:", error);
            throw new Error("Registration failed. Please try again.");
        }
    }
        
    // Add this method to the DbService class
    calculateteacherId(name, contact) {
        const contactNumber = contact; // Use the contact number directly
        const nameInitials = name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase())
            .join(''); // Combine the initials of the name
        return `${contactNumber}${nameInitials}`;
    }


    async verifyUser(username, inputPassword){
        // SQL query to get the hashed password by username
        const query = 'SELECT password,isTeacher FROM loginCredentials WHERE username = ?';
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
                        // console.log('Password is correct!');
                        resolve({success:true,message:"logged in...",isTeacher:results[0].isTeacher});
                    } else {
                        // console.log('Incorrect password.');
                        reject({success:false,message:"Invalid Password"});
                    }
                } 
                else {
                    // console.log('User not found.',results);
                    reject({success:false,message:"User not Found"});
                }
            });
        });

        return result;
    };
        

    async login(userName,password){
        const {success,message,isTeacher} = await this.verifyUser(userName,password);
        const teacher = isTeacher===0?false:true;
        const userNameresult = await this.getUserName(userName,teacher);
        const result = {
            success:success,
            message:message,
            isTeacher:teacher,
            userNameresult:userNameresult
        }
        // console.log("Result from login : ",result)
        return result;
    }

    async getUserName(userName,isTeacher){
        let query;
        let name;
        if(isTeacher){
            query = "SELECT name FROM teacherdetails WHERE teacherid=?"
        }
        else{
            query = "SELECT firstname,lastname FROM studentdetails WHERE studentid=?"
        }
        const userFullName =await new Promise((resolve,reject)=>{
            connection.execute(query,[userName],(error,results)=>{
                if(error){
                    reject(error.message);
                }
                else{
                    if(isTeacher){
                        name = results[0].name
                    }
                    else{
                        name = `${results[0].firstname} ${results[0].lastname}`
                    }
                    // console.log("name form getUserName : ",name);
                    resolve(name);
                }
            })
        })
        return userFullName;
    }

    sendMailToUser = async (id, password, email, username) => {
        // Validate input
        if (!email || !username || !id || !password) {
            throw new Error("Invalid email parameters.");
        }
    
        // Configure the transport using SMTP settings from .env
        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST, // Gmail's SMTP host
            port: Number(process.env.SMTP_PORT) || 587, // Use port 587 for TLS or 465 for SSL
            secure: Number(process.env.SMTP_PORT) === 465, // true for SSL (port 465)
            auth: {
                user: process.env.SMTP_USER, // Your Gmail email address
                pass: process.env.SMTP_PASS, // App password or Gmail password (depending on 2FA)
            },
            debug: true, // Enable debug output
        });
    
        // Set up the email options
        const mailOptions = {
            from: `"QuizMania" <${process.env.SMTP_USER}>`, // Sender's email
            to: email, // Receiver's email (user's email)
            subject: "Welcome to Our Platform!", // Email subject
            text: `Hello ${username},\n\nThank you for registering!\n\nYour credentials are:\nUsername: ${id}\nPassword: ${password}\n\nPlease keep this information secure.\n\nBest Regards,\nQuizMania Team`, // Email body in plain text
        };
    
        // Send the email
        try {
            const info = await transporter.sendMail(mailOptions);
            console.log("Email sent successfully:", info.response);
        } catch (error) {
            // console.error("Failed to send email:", error);
            throw new Error(`Failed to send registration email: ${error.message}`);
        }
    };
    
}

module.exports = DbService;