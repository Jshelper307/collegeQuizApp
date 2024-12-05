
let examData = {};

let currentInd = 0;
let answerWithTime = [];
let totalQuestions = 0;
let timerId;
const path = window.location.pathname;
let isError;

const heading = document.getElementById("heading");
const question_text = document.getElementById("question-text");
const timer = document.getElementById("timer");
const optionsContainer = document.getElementById("options");
// get the next button
const next = document.querySelector(".submit-btn");
const params = new URLSearchParams(window.location.search);
let examId;

document.addEventListener("DOMContentLoaded",async ()=>{
    userResponded = false;
    examId = params.get("id");
    // console.log("id : ",examId);
    // check user already give his answer or not
    await loadData(examId);
    if(!isError.Error){
        heading.innerHTML = examData["exams"]["exam"]["title"];
        loadQuestion(currentInd);
        // startTimer(60);
    }
    else{
        showResponded(isError.message);
    }
})


const loadData = async (examId)=>{
    // await fetch(`http://localhost:3000/exams/exam/${examId}`).then(response=>response.json()).then(data=>{
    //     if(data.error){
    //         // console.log("data form loaddata error : ",data);
    //         console.log(data.error);
    //         userResponded = true;
    //     }
    //     else{
    //         examData = data;
    //         console.log(examData);
    //         totalQuestions = examData["exams"]["exam"]["questionsWithAns"].length;
    //     }
    // })
    // .catch(error=>{
    //     console.log(error);
    // })
    await fetch(`http://localhost:3000/exams/exam/${examId}`).then(response=>response.json()).then(data=>{
        if(data.error){
            // console.log("data form loaddata error : ",data);
            console.log("Error from data : ",data.error);
            isError = {
                Error:true,
                message:data.error
            }
        }
        else{
            examData = data;
            console.log("Examdata from loadData : ",examData);
            totalQuestions = examData["exams"]["exam"]["questionsWithAns"].length;
            isError = {
                Error:false,
                message:"Exam is Live"
            }
        }
    }
    totalQuestions = examData["exams"]["exam"]["questionsWithAns"].length;
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
            answerWithTime.push({
                answer:options[i].value,
                timeTaken:timer.innerHTML
            })
        }
    }
    if(currentInd == totalQuestions){
        next.style.display = "none";
        optionsContainer.innerHTML = "";
        storeResult();
        question_text.innerHTML = "Thankyou For participating...! We recorder your response. Result will be declared soon....";
        clearInterval(timerId);
        timer.innerHTML = "";
    }
    else{
        loadQuestion(currentInd);
    }
})

const storeResult = ()=>{
    console.log("exam id : ",examId);
    console.log(answerWithTime);
    const userName = '27600121023JS'
    const url =`http://localhost:3000/exams/exam/${examId}/store_result/${userName}`;
    fetch(url,{
        headers:{
            'content-type':'application/json'
        },
        method: 'POST',
        body: JSON.stringify({answerWithTime:answerWithTime})
    })
    .then(response=>{
        return response.json();
    })
    .catch(error=>{
        console.log(error);
    })
}

const showResponded = (message)=>{
    question_text.innerHTML = message;
    next.style.display = "none";
}

// new function---------



loadData();
function handleExam(examData) {
    const questions = examData.exams.exam.questionsWithAns;
    const timeLimit = examData.exams.exam.time_limit_perQuestion; // Time limit per question
    let currentQuestionIndex = 0;
    let timerInterval = null;
  
    function startTimer(duration) {
      let timeRemaining = duration;
  
      console.log(`Question ${currentQuestionIndex + 1}: ${questions[currentQuestionIndex].question}`);
      timerInterval = setInterval(() => {
        console.log(`Time Left: ${timeRemaining}s`);
        timeRemaining--;
  
        if (timeRemaining < 0) {
          clearInterval(timerInterval);
          currentQuestionIndex++;
  
          if (currentQuestionIndex >= questions.length) {
            console.log("All questions completed. Submitting the test...");
            finishTest(); // Finish the test
          } else {
            startTimer(timeLimit);
          }
        }
      }, 1000);
    }
  
    function finishTest() {
      console.log("Test Finished. Submit answers.");
      // Add submission logic here
    }
  
    // Start the exam with the first question
    startTimer(timeLimit);
  }
  
  // Example usage with the provided `examData`
  handleExam(examData);
  
  