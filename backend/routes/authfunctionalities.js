// authRoutes.js
const express = require('express');

const dbService = require('../services/authServices');
const jwt = require('jsonwebtoken');

const router = express.Router();

// In-memory store for users (you would typically use a database)
// let users = [];

// JWT Secret for signing tokens
const JWT_SECRET = process.env.SECRET_KEY;

// Sign-up Route
router.post('/signup', async (req, res) => {
    const {firstName,lastName,emailAddress,phone,collegeName,universityRollno,password} = req.body;
    const db = dbService.getDbServiceInstance();
    const result = db.registerUser(password,firstName,lastName,emailAddress,phone,collegeName,universityRollno);

    result.then((data) => {
        // console.log("Signup data : ",data);
        if(data.success){
            res.json({ success: true , message:"Registraton Successfull"})
        }
        else{
            res.json({success:false,error:"Registration Failed",mailsend:data.mailsend})
        }
    }).catch((error) => {
        // console.log("Error form /signup : ");
        if(error.message.split("'")[0]==='Duplicate entry '){
            return res.json({success:false,error:"You already have an account"});
        }
        res.json({success:false,error:error.message});
    });
});

// Login Route
router.post('/login', async (req, res) => {
    const {userName,password} = req.body;
    
    const db = dbService.getDbServiceInstance();
    const result = db.login(userName,password);
    result.then((data) =>{
        const user = {
            userName : userName,
            isTeacher: data.isTeacher,
            fullName : data.userNameresult
        }
        const token = jwt.sign(user,JWT_SECRET,{expiresIn: '1h'});
        // console.log("token : ",token);
        res.json({ success: true,token:token});
    }).catch((error) =>{ 
        // console.log("error is : ",error);
        res.json(error);
    });
});
// Sign-up Route
router.post('/teacher/signup', async (req, res) => {
    const { name, email, department, contact, password } = req.body;

    try {
        const db = dbService.getDbServiceInstance();
        const result = await db.addTeacher(name, email, department, contact, password);
        // console.log("Result from post req : ",result);
        res.json(result);
    } catch (error) {
        // console.error('Error in /teacher/signup:', error.message);
        
        res.json({ success: false, message: error.message });
    }
});

module.exports = router;
