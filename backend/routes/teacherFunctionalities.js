const express = require('express');
const router = express.Router();
const teachers = require('../models/teachers');


router.get("/getTeacher/:teacherId",async (req,res)=>{
    const teacherId = req.params.teacherId;
    try{
        const result = await teachers.findOne({teacher_id:teacherId})
        if(!result){
           return res.status(404).send({success:false,error:"Teacher not found"});
        }
        res.status(200).send({success:true,result});
    }
    catch(error){
        res.send({success:false,error});
    }
})


module.exports = router;