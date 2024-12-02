const Results = require('../models/resultSchema'); // Assuming the schema is already defined elsewhere

async function hasUserResponded(examId, userName) {
    try {
        // Search for the specific exam and check if the user exists in the results
        console.log("exam id : ",examId);
        console.log("Userid id : ",userName);

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

module.exports = hasUserResponded;