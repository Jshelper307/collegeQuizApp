const express = require('express')
const connectMongoDB = require('../db/mongoConnection')
const Exam = require('../models/exam'); // Import the Exam model
const Results = require('../models/resultSchema'); // Import the Result model
const {hasUserResponded,checkExamStartDate} = require('../services/mongoDbServices')
const {v4 : uuidv4} = require('uuid');

const router = express.Router();

// a exams variable
let exams = {};

// connect with mongodb
connectMongoDB();



// API to create an exam
router.post('/create-exam', async (req, res) => {
    try {
        const {department,subject,title,description,time_limit_perQuestion,points_per_question,exam_start_date,exam_end_date,questionsWithAns} = req.body;

        const examId = uuidv4(); // Generate a unique ID for the exam
        exams = {
            exam_id : examId,
            exam_start_date:exam_start_date,
            exam_end_date:exam_end_date,
            exam : {department,subject,title,description,time_limit_perQuestion,points_per_question,questionsWithAns}
        };
        const examResult = {
            examId:examId,
            results:[]
        }
        // Create a new exam
        const newExam = new Exam(exams);
        const newResult = new Results(examResult);
        // Save to MongoDB
        await newExam.save();
        await newResult.save();
        res.status(201).send({ success: true, message: 'Exam created successfully!',examUrl: `http://localhost:5500/pages/test.html?id=${examId}` });
    } catch (error) {
        console.error('Error creating exam:', error.message);
        res.status(500).send({ success: false, error: 'Internal Server Error' });
    }
});

router.get('/exam/:exam_id', async (req, res) => {
    try {
        const userName = "27600121023JS";
        const { exam_id } = req.params;
        // check exam started or not
        const examStarted = await checkExamStartDate(exam_id);
        if(examStarted.success){
            const alreadyResponded = await hasUserResponded(exam_id,userName);
            if(alreadyResponded){
                console.log("You complete this test already ....");
                return res.send({success:false,error:"You already responded for this exam !!!"})
            }
            
            // Find the exam by ID
            const exam = await Exam.findOne({ exam_id });
    
            if (!exam) {
                return res.status(404).send({ success: false, error: 'Exam not found' });
            }
            
            res.send({ success: true, exams:exam });
        }
        else{
            res.send({success:false,error:examStarted.message});
        }
    } catch (error) {
        console.error('Error fetching exam:', error.message);
        res.status(500).send({ success: false, error: 'Internal Server Error' });
    }
});

router.get('/exam/:exam_id/get_results', async (req, res) => {
    try {
        const { exam_id } = req.params;
        // console.log("exam id from get request : ",exam_id);
        // Find the exam by ID
        const results = await Results.findOne({examId:exam_id});

        if (!results) {
            return res.status(404).send({ success: false, error: 'Results not found' });
        }
        
        res.send({ success: true, examResults:results });
    } catch (error) {
        console.error('Error fetching results:', error.message);
        res.status(500).send({ success: false, error: 'Internal Server Error' });
    }
});

router.post('/exam/:exam_id/store_result/:username', async (req, res) => {
    try {
        const exam_id = req.params.exam_id;
        const userName = req.params.username;
        const {answerWithTime} = req.body;
        // console.log("examID from server : ",exam_id);
        const resultsDb = await Results.findOne({examId:exam_id});
        const studentResult = {
            userName:userName,
            answerWithTime:answerWithTime
        }
        // console.log(resultsDb);
        resultsDb.results.push(studentResult);
        // console.log(studentResult);
        // Save to MongoDB
        const newResult = await resultsDb.save();

        res.status(201).send({ success: true, message: 'userresult saved successfully..',newResult:newResult});
    } catch (error) {
        console.error('Error saving user response :', error.message);
        res.status(500).send({ success: false, error: 'Internal Server Error' });
    }
});
module.exports = router;