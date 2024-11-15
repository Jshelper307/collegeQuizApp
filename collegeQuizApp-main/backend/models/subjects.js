const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    questionNo: { type: Number },
    question: { type: String, required: true },
    options: { type: [String], required: true },
    answer: { type: String, required: true }
});

const topicSchema = new mongoose.Schema({
    topic: { type: String, required: true },
    questionsWithAns: [questionSchema]
});

const unitSchema = new mongoose.Schema({
    unit: { type: String, required: true },
    topics: [topicSchema]
});

const subjectSchema = new mongoose.Schema({
    subjectCode: { type: String, required: true },
    units: [unitSchema]
});


const Subjects = new mongoose.model("Subjects",subjectSchema);

module.exports = Subjects;