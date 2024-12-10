const express = require('express');
const router = express.Router();
const teachers = require('../models/teachers');
const {checkExamStartDate,verifyUser} = require('../services/mongoDbServices');
const jwt = require('jsonwebtoken');


router.post("/getTeacher",verifyUser,async (req, res) => {
    const User = jwt.verify(req.token,process.env.SECRET_KEY,(error,data)=>{
        if(error){
            // console.log("Invalid token");
            return ({isValid:false,error});
        }else{
            // console.log("valid user from getSubject....",data)
            return ({isValid:true,isTeacher:data.isTeacher,teacherId:data.userName,fullName:data.fullName});
        }
    })
    if(User.isValid && User.isTeacher){
        try {
            const result = await teachers.findOne({ teacher_id: User.teacherId });
            if (!result) {
                return res.status(404).send({ success: false, error: "Teacher not found" });
            }
            const fullName = User.fullName;
            // Use Promise.all to resolve all exam statuses
            const exams = await Promise.all(
                result.created_exams.map(async (examId) => {
                    try {
                        const examStatus = await checkExamStartDate(examId);
                        const message = examStatus.message;
                        const details = examStatus.examDetails;
                        const status  = examStatus.status;
                        return { examId, message,details,status };
                    } catch (error) {
                        return { examId, examStatus: "Error checking status",details:"No Details",status:"No Status" }; // Handle individual errors
                    }
                })
            );
            res.status(200).send({ success: true, exams ,fullName});
        } catch (error) {
            res.status(500).send({ success: false, error: error.message });
        }
    }
    else if(User.isValid && !User.isTeacher){
        res.send({success:false,error:"Access Denied"});
    }
    else{
        res.send({success:false,error:"Not a Valid User"});
    }
});



module.exports = router;