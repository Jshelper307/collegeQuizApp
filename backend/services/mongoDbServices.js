const Results = require('../models/resultSchema'); // Assuming the schema is already defined elsewhere
const Exam = require('../models/exam');

async function hasUserResponded(examId, userName) {
    try {
        // Search for the specific exam and check if the user exists in the results
        // console.log("exam id : ",examId);
        // console.log("Userid id : ",userName);

        const exam = await Results.findOne({
            examId: examId,
            "results.userName": userName,
        });

        // If exam and user exist, return true, otherwise return false
        return exam !== null;
    } catch (error) {
        console.error("Error checking user response:", error);
        throw error; // Optionally rethrow to handle errors in calling function
    }
}

async function checkExamStartDate(examId) {
    const exam = await Exam.findOne({
        exam_id: examId,
    });
    
    const startDate = new Date(exam.exam_start_date); // Ensure it's a Date object
    const endDate = new Date(exam.exam_end_date); // Ensure it's a Date object
    
    const now = new Date(); // Get the current date and time
    // console.log("exam : ",exam);
    // console.log("Exam start date from checkExam: ", startDate);
    // console.log("Exam end date from checkExam: ", endDate);
    // console.log("Current dateTime now: ", now);
    const examDetails = {
      examStartDate : exam.exam_start_date,
      examEndDate : exam.exam_end_date,
      exam_title : exam.exam.title,
      exam_description : exam.exam.description
    }
    
    if (now < startDate) {
        // console.log("Exam not started");
        return ({success:false,message:"Exam Not Started Yet . Please Come Some Time after.",examDetails,status:"Not Started"});
    } else if (now >= startDate && now <= endDate) {
        // console.log("Exam running ....");
        return ({success:true,message:"Exam is live",examDetails,status:"Live"})
    } else {
        // console.log("Exam ended.");
        return ({success:false,message:"Exam is already finished",examDetails,status:"Finished"})
    }   
}

// check the user is regestard or not
function verifyUser(req,res,next){
    const bearerHeader = req.headers['authorization'];
    // console.log("bear : ",bearerHeader)
    if(typeof bearerHeader !== 'undefined'){
      const token = bearerHeader.split(" ")[1];
    //   console.log("token from verify user : ",token);
      req.token = token;
      next();
    }
    else{
      res.send({
        result : "Token is not valid"
      })
    }
  }

module.exports = {hasUserResponded,checkExamStartDate,verifyUser};