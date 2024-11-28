// let examData = {
//     "success": true,
//     "exam": {
//             "_id": "6745c88c2a72a38a9cff26ed",
//             "exam_id": "3ad1b34d-7db4-4e6b-a47a-0e3bbc1d4b62",
//             "exam": {
//                     "title": "try 1",
//                     "description": "This is first test post request",
//                     "language": "english",
//                     "total_time": "20 min",
//                     "points_per_question": 2,
//                     "questionsWithAns": [
//                         {
//                             "question": "This is test question 1",
//                             "options": [
//                                 "a",
//                                 "b",
//                                 "c",
//                                 "d"
//                                 ],
//                             "answer": "a",
//                             "_id": "6745c88c2a72a38a9cff26ef"
//                         },
//                         {
//                             "question": "This is test question 2",
//                             "options": [
//                             "aa",
//                             "ba",
//                             "ca",
//                             "da"
//                             ],
//                             "answer": "ca",
//                             "_id": "6745c88c2a72a38a9cff26f0"
//                         }
//                         ],
//                     "_id": "6745c88c2a72a38a9cff26ee"
//                 },
//             "__v": 0
//         }
//     }

let examData = {};

let currentInd = 0;
let answerWithTime = [];
let totalQuestions = 0;
let timerId;
const path = window.location.pathname;

const heading = document.getElementById("heading");
const question_text = document.getElementById("question-text");
const timer = document.getElementById("timer");
const optionsContainer = document.getElementById("options");
// get the next button
const next = document.querySelector(".submit-btn");
const params = new URLSearchParams(window.location.search);
let examId;

document.addEventListener("DOMContentLoaded",async ()=>{
    examId = params.get("id");
    console.log("id : ",examId);
    await loadData(examId);
    heading.innerHTML = examData["exams"]["exam"]["title"];
    loadQuestion(currentInd);
    startTimer(60);
})


const loadData = async (examId)=>{
    await fetch(`http://localhost:3000/exam/${examId}`).then(response=>response.json()).then(data=>{
        if(data.error){
            console.log(data.error);
        }
        else{
            examData = data;
            // console.log(examData);
            totalQuestions = examData["exams"]["exam"]["questionsWithAns"].length;
        }
    })
    .catch(error=>{
        console.log(error);
    })
}


const startTimer = (timeInSeconds=0)=>{
    timer.innerHTML = timeInSeconds;
    timerId = setInterval(() => {
        if(timeInSeconds > 0){
            timeInSeconds = timeInSeconds-1;
            timer.innerHTML = timeInSeconds;
        }
        else{
            clearInterval(timer);
        }
    }, 1000);
}

const loadQuestion = (QuestionIndex)=>{
    question_text.innerHTML = examData["exams"]["exam"]["questionsWithAns"][QuestionIndex]["question"];
    optionsContainer.innerHTML = examData["exams"]["exam"]["questionsWithAns"][QuestionIndex]["options"]
    .map(
        (option, idx) =>
            `<label><input type="radio" name="option" value="${option}"> ${option}</label>`
    )
    .join("");
    currentInd++;
    if(currentInd == totalQuestions){
        next.innerHTML = "Submit";
    }
}

// add envent listner in the next button
next.addEventListener("click",()=>{
    const options = document.getElementsByName("option");
    for(let i=0;i<options.length;i++){
        if(options[i].checked){
            console.log("ans is : ",options[i].value);
        }
    }
    if(next.innerHTML === "Submit"){
        optionsContainer.innerHTML = "";
        question_text.innerHTML = "Thankyou For participating...! We recorder your response. Result will be declared soon....";
        clearInterval(timerId);
        timer.innerHTML = "";
    }
    else{
        loadQuestion(currentInd);
    }
})