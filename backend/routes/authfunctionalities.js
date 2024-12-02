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
    const user = {
        userName : userName,
        isTeacher:false
    }
    const db = dbService.getDbServiceInstance();
    const result = db.login(userName,password);
    result.then((data) =>{
        const token = jwt.sign(user,JWT_SECRET,{expiresIn: '1h'});
        localStorage.setItem("token",token);
        console.log("token : ",token);
        res.json({ success: true });
    }).catch((error) => console.log(error));
});

module.exports = router;
