const express = require('express')
const connectMongoDB = require('../db/mongoConnection')
const Exam = require('../models/exam'); // Import the Exam model
const {v4 : uuidv4} = require('uuid');

const router = express.Router();

// a exams variable
let exams = {};

// connect with mongodb
connectMongoDB();



// API to create an exam
router.post('/create-exam', async (req, res) => {
    try {
        const {title,description,points_per_question,time_limit,questionsWithAns} = req.body;

        const examId = uuidv4(); // Generate a unique ID for the exam
        exams = {
            exam_id : examId,
            exam : {title,description,points_per_question,time_limit,questionsWithAns}
        };
        
        // Create a new exam
        const newExam = new Exam(exams);

        // Save to MongoDB
        await newExam.save();
        res.status(201).send({ success: true, message: 'Exam created successfully!',examUrl: `http://localhost:5500/pages/test.html?id=${examId}` });
    } catch (error) {
        console.error('Error creating exam:', error.message);
        res.status(500).send({ success: false, error: 'Internal Server Error' });
    }
});

router.get('/exam/:exam_id', async (req, res) => {
    try {
        const { exam_id } = req.params;

        // Find the exam by ID
        const exam = await Exam.findOne({ exam_id });

        if (!exam) {
            return res.status(404).send({ success: false, error: 'Exam not found' });
        }
        
        res.send({ success: true, exams:exam });
    } catch (error) {
        console.error('Error fetching exam:', error.message);
        res.status(500).send({ success: false, error: 'Internal Server Error' });
    }
});

module.exports = router;