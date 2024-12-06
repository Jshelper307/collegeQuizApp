const express = require('express');
const router = express.Router();
const teachers = require('../models/teachers');
const {checkExamStartDate} = require('../services/mongoDbServices');


router.get("/getTeacher/:teacherId", async (req, res) => {
    const teacherId = req.params.teacherId;
    try {
        const result = await teachers.findOne({ teacher_id: teacherId });
        if (!result) {
            return res.status(404).send({ success: false, error: "Teacher not found" });
        }

        // Use Promise.all to resolve all exam statuses
        const exams = await Promise.all(
            result.created_exams.map(async (examId) => {
                try {
                    const examStatus = await checkExamStartDate(examId);
                    const message = examStatus.message;
                    return { examId, message };
                } catch (error) {
                    return { examId, examStatus: "Error checking status" }; // Handle individual errors
                }
            })
        );

        res.status(200).send({ success: true, exams });
    } catch (error) {
        res.status(500).send({ success: false, error: error.message });
    }
});



module.exports = router;