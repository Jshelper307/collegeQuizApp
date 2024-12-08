const mongoose = require("mongoose");


const studentResultSchema = new mongoose.Schema({
    userName: { type: String, required: true },
    totalMarks: { type: Number, required: true },
    totalTimeTaken : { type: Number, required: true },
});

const examResultSchema = new mongoose.Schema({
    examId: { type: String, required: true },
    results: [studentResultSchema]
});



const Results = new mongoose.model("Results",examResultSchema);

module.exports = Results;