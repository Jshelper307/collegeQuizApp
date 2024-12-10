
let examData = {};
let currentInd = 0;
let totalMarks = 0;
let totalTimeTaken = 0;
let totalQuestions = 0;
let timerId;
let timeGapId;
const path = window.location.pathname;
let isError;
let perQuestionTimeLimit;
let remainingTime;

const heading = document.getElementById("heading");
const question_text = document.getElementById("question-text");
const timerLeft = document.getElementById("time-left");
const timer = document.getElementById("timer");
const optionsContainer = document.getElementById("options");
const totalQuestionSpan = document.getElementById("totalQuestion");
const totalAnswredSpan = document.getElementById("totalAnswred");
// get the next button
const next = document.querySelector(".submit-btn");
const params = new URLSearchParams(window.location.search);
let examId;

document.addEventListener("DOMContentLoaded",async ()=>{
    const token = localStorage.getItem("token");
    if(!token){
        window.location.href = "register.html";
    }
    else{
        checkValidUser(token);
        showStartPage();
    }
})

// Check user is valid or not
const checkValidUser = (token)=>{
    console.log(token);
}

// This function show the starting counter page
const showStartPage =()=>{
    let time = 10;
    const startGap = document.getElementById("startGap");
    startGap.innerHTML = time;
    timeGapId = setInterval(() => {
        if(time > 0){
            time = time-1;
            startGap.innerHTML = time;
        }
        else{
            clearInterval(timeGapId);
            startQuiz();
        }
    }, 1000);
}

document.getElementById("playQuiz").addEventListener("click",()=>{
    clearInterval(timeGapId);
    startQuiz();
})

const startQuiz =async ()=>{
    const starting = document.querySelector(".starting");
    const examContent = document.querySelector(".examContent");
    starting.style.display = "none";
    examContent.style.display = "block";

    // start quiz
    userResponded = false;
    examId = params.get("id");
    // console.log("id : ",examId);
    // check user already give his answer or not
    await loadData(examId);
    if(!isError.Error){
        heading.innerHTML = examData["exams"]["exam"]["title"];
        totalQuestionSpan.innerHTML = totalQuestions;
        updateTotalAnswred(currentInd);
        perQuestionTimeLimit = examData.exams.exam.time_limit_perQuestion;
        loadQuestion(currentInd);
        // startTimer(60);
    }
    else{
        showResponded(isError.message);
    }
}

const loadData = async (examId)=>{
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:3000/exams/exam/${examId}`,{
        headers:{
            'content-type':'application/json',
            'Authorization': `Bearer ${token}`,
            'forEdit':false
        },
        method: 'POST',
    }).then(response=>response.json()).then(data=>{
        if(data.error){
            // console.log("data form loaddata error : ",data);
            if(data.error === 'Not a Valid user'){
                window.location.href = "register.html";
                return;
            }
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
    })
    
}



const startTimer = (timeInSeconds=0)=>{
    remainingTime = timeInSeconds;
    timerLeft.innerHTML = remainingTime;
    clearInterval(timerId);
    timerId = setInterval(() => {
        if(remainingTime > 0){
            remainingTime = remainingTime-1;
            timerLeft.innerHTML = remainingTime;
        }
        else{
            clearInterval(timerId);
            // currentInd++;
            saveAnswerAndGoNextQuestion(currentInd,false);
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
    startTimer(perQuestionTimeLimit);
}

// add envent listner in the next button
next.addEventListener("click",()=>{
    saveAnswerAndGoNextQuestion(currentInd,true);
})

const saveAnswerAndGoNextQuestion = (currentInd,isClicked)=>{
    if(isClicked){
        const options = document.getElementsByName("option");
        const correctAns = examData.exams.exam.questionsWithAns[currentInd-1].answer;
        let isAnswered = false;
        for(let i=0;i<options.length;i++){
            if(options[i].checked){
                console.log("ans is : ",options[i].value);
                console.log("time taken : ",perQuestionTimeLimit-remainingTime);
                if(correctAns===options[i].value){
                    totalMarks += examData.exams.exam.points_per_question;
                }
                totalTimeTaken += (perQuestionTimeLimit-remainingTime);
                isAnswered = true;
            }
        }
        if(!isAnswered){
            alert("Please first choose a correct answer .")
            return;
        }
    }
    if(currentInd == totalQuestions){
        next.style.display = "none";
        optionsContainer.innerHTML = "";
        storeResult();
        question_text.innerHTML = "Thankyou For participating...! We recorder your response. Result will be declared soon....";
        clearInterval(timerId);
        timer.innerHTML = "";
        console.log("total marks : ",totalMarks);
        console.log("time taken : ",totalTimeTaken);
    }
    else{
        loadQuestion(currentInd);
    }
    updateTotalAnswred(currentInd);
}
// This function store the result in the database
const storeResult = ()=>{
    console.log("exam id : ",examId);
    const token = localStorage.getItem("token");
    const url =`http://localhost:3000/exams/exam/${examId}/store_result`;
    fetch(url,{
        headers:{
            'content-type':'application/json',
            'Authorization': `Bearer ${token}`
        },
        method: 'POST',
        body: JSON.stringify({totalMarks,totalTimeTaken})
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

const updateTotalAnswred = (totalAnswred)=>{
    totalAnswredSpan.innerHTML = totalAnswred;
}