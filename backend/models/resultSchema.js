const mongoose = require("mongoose");


const answerAndTimeSchema = new mongoose.Schema({
    answer: { type: String, required: true },
    timeTaken: { type: String, required: true }
});

const studentResultSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    answerWithTime: [answerAndTimeSchema]
});

const examResultSchema = new mongoose.Schema({
    examId: { type: String, required: true },
    results: [studentResultSchema]
});



const Results = new mongoose.model("Results",examResultSchema);

module.exports = Results;