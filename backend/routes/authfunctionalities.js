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

    result.then((data) => res.json({ success: true })).catch((error) => console.log(error));
});

// Login Route
router.post('/login', async (req, res) => {
    const {userName,password} = req.body;
    
    const db = dbService.getDbServiceInstance();
    const result = db.login(userName,password);
    result.then((data) =>{
        const user = {
            userName : userName,
            isTeacher:false,
            fullName : data.userNameresult
        }
        const token = jwt.sign(user,JWT_SECRET,{expiresIn: '1h'});
        // console.log("token : ",token);
        res.json({ success: true,token:token,data:data });
    }).catch((error) => console.log("error is : ",error));
});
// Sign-up Route
router.post('/teacher/signup', async (req, res) => {
    const { name, email, department, contact, password } = req.body;

    try {
        const db = dbService.getDbServiceInstance();
        await db.addTeacher(name, email, department, contact, password);
        res.json({ success: true, message: 'Teacher registered successfully' });
    } catch (error) {
        console.error('Error in /teacher/signup:', error.message);
        res.status(500).json({ success: false, message: error.message });
    }
});

// Login Route
router.post('teacher/login', async (req, res) => {
    const {userName,password} = req.body;
    
    const db = dbService.getDbServiceInstance();
    const result = db.login(userName,password);
    result.then((data) =>{
        const user = {
            userName : userName,
            isTeacher:false,
            fullName : data.userNameresult
        }
        const token = jwt.sign(user,JWT_SECRET,{expiresIn: '1h'});
        // console.log("token : ",token);
        res.json({ success: true,token:token,data:data });
    }).catch((error) => console.log("error is : ",error));
});

module.exports = router;
