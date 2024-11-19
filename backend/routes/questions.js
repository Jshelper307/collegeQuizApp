// authRoutes.js
const express = require('express');
const mongoose = require('mongoose');
const Subject = require('../models/subjects');

const router = express.Router();

// In-memory store for users (you would typically use a database)

mongoose.connect('mongodb://localhost:27017/your_database_name', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  
// Add a new Subject
router.post('/subjects', async (req, res) => {
try {
    const subject = new Subject({
    subjectCode: req.body.subjectCode,
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