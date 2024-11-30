// authRoutes.js
const express = require('express');
const Subject = require('../models/subjects');
const connectMongoDB = require('../db/mongoConnection');
const DbService = require('../services/dbService');
const router = express.Router();

// In-memory store for users (you would typically use a database)

// create connection with mongodb
connectMongoDB();

// get subjects
router.get('/getSubject/:subjectId',async(req,res)=>{
    try {
        const { subjectId } = req.params;
        // Find the exam by ID
        const subject = await Subject.findOne({subjectCode: subjectId });

        if (!subject) {
            return res.status(404).send({ success: false, error: 'Subject not found' });
        }
        
        res.send({ success: true, subject:subject });
    } catch (error) {
        console.error('Error fetching subject:', error.message);
        res.status(500).send({ success: false, error: 'Internal Server Error' });
    }
})


// Add a new Subject
router.post('/addSubjects', async (req, res) => {
try {
    const subjectId = req.body.subjectCode;
    const db = DbService.getDbServiceInstance();
    const subjectName =await db.getSubjectName(subjectId);
    const subject = new Subject({
        subjectCode: subjectId,
        subjectName:subjectName,
        units: req.body.units
    });
    const savedSubject = await subject.save();
    res.status(201).json(savedSubject);
} catch (error) {
    res.status(400).json({ message: error.message });
}
});

// Add a new Unit
router.post('/subjects/:subjectId/units', async (req, res) => {
try {
    const subject = await Subject.findById(req.params.subjectId);
    const newUnit = {
    unit: req.body.unit,
    topics: req.body.topics
    };
    subject.units.push(newUnit);
    const savedSubject = await subject.save();
    res.status(201).json(savedSubject);
} catch (error) {
    res.status(400).json({ message: error.message });
}
});

// Add a new Topic
router.post('/subjects/:subjectId/units/:unitIndex/topics', async (req, res) => {
try {
    const subject = await Subject.findById(req.params.subjectId);
    const unit = subject.units[req.params.unitIndex];
    const newTopic = {
    topic: req.body.topic,
    questionsWithAns: req.body.questionsWithAns
    };
    unit.topics.push(newTopic);
    const savedSubject = await subject.save();
    res.status(201).json(savedSubject);
} catch (error) {
    res.status(400).json({ message: error.message });
}
});

// Add a new Question
router.post('/subjects/:subjectId/units/:unitIndex/topics/:topicIndex/questions', async (req, res) => {
try {
    const subject = await Subject.findById(req.params.subjectId);
    const unit = subject.units[req.params.unitIndex];
    const topic = unit.topics[req.params.topicIndex];

    const newQuestion = {
    question: req.body.question,
    options: req.body.options,
    answer: req.body.answer
    };

    topic.questionsWithAns.push(newQuestion);
    const savedSubject = await subject.save();
    res.status(201).json(savedSubject);
} catch (error) {
    res.status(400).json({ message: error.message });
}
});
  

module.exports = router;