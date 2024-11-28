const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true },
    answer: { type: String, required: true }
});

const examSchema = new mongoose.Schema({
    title : { type:String,required:true},
    description: { type: String, required: true },
    points_per_question : { type:Number,required:true},
    time_limit : {type:Number,required:true},
    questionsWithAns: [questionSchema]
});

const examsSchema = new mongoose.Schema({
    exam_id: { type: String, required: true },
    exam : examSchema
})


const exams = new mongoose.model("Exams",examsSchema);

module.exports = exams;