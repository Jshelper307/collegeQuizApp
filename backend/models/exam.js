const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    question: { type: String, required: true },
    options: { type: [String], required: true },
    answer: { type: String, required: true }
});

const examSchema = new mongoose.Schema({
    department : { type:String,required:true},
    subject:{ type:String,required:true},
    title : { type:String,required:true},
    description: { type: String, required: true },
    points_per_question : { type:Number,required:true},
    time_limit_perQuestion : {type:Number,required:true},
    questionsWithAns: [questionSchema]
});

const examsSchema = new mongoose.Schema({
    exam_id: { type: String, required: true },
    exam_start_date:{ type:String, required: true },
    exam_end_date:{ type: String, required: true },
    exam : examSchema
})


const exams = new mongoose.model("Exams",examsSchema);

module.exports = exams;