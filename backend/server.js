const express = require('express')
const path = require('path');
require("../backend/db/conn")
const Subjects = require("../backend/models/subjects");


const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send("Welcome ")
})

// Add a new Subject
app.post('/subjects', async (req, res) => {
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
app.post('/subjects/:subjectId/units', async (req, res) => {
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
app.post('/subjects/:subjectId/units/:unitIndex/topics', async (req, res) => {
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
app.post('/subjects/:subjectId/units/:unitIndex/topics/:topicIndex/questions', async (req, res) => {
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

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})