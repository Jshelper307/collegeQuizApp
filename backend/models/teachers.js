const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
    teacher_id: { type: String, required: true },
    created_exams: { type: [String]},
})


const teachers = new mongoose.model("Teachers",teacherSchema);

module.exports = teachers;