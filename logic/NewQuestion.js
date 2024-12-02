let currentTopicQuestions = [];
let currentQuestionIndex = 0;
let score = 0;
let responses = []; // To track user's responses
let timer; // Variable to store the timer interval
let timeLeft = (1 / 2) * 60; // Set initial time to 10 minutes (600 seconds)
let isTeacher = false;
let addedQuestions = [];

// when page load
document.addEventListener("DOMContentLoaded", () => {

    // check who is user teache or student
    if(isTeacher){
        document.getElementById("teacherContent").style.display = "block";
        document.getElementById("studentContent").style.display = "none";
        document.querySelector(".hello").style.display = "none";
    }
    else{
        document.getElementById("teacherContent").style.display = "none";
        document.getElementById("studentContent").style.display = "block";
        document.querySelector(".hello").style.display = "flex";
    }

  const subjectName = document.getElementById("subjectName");
  const subjectId = localStorage.getItem("subjectId");
  
  url = `http://localhost:3000/api//getSubject/${subjectId}`;
  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      console.log(data);
      subjectName.innerHTML = data['subject']['subjectName'];
      loadUnits(data['subject']['units']);
    })
    .catch((error) => {
      console.log(error);
    });
});

const loadUnits = (units) => {
    const unitContainer = document.getElementById("dropdown-content");
    unitContainer.innerHTML = ""; // Clear previous content

    units.forEach(unitData => {
        // Create the unit container
        const unitDiv = document.createElement("div");
        unitDiv.className = "unit";

        // Create the unit header
        unitDiv.innerHTML = `
            <h3>
                ${unitData.unit}
                <button class="addBtn" id="addTopicBtn">+</button>
            </h3>
            <div class="addTopic">
                <input class="input" id="topicNameInp" type="text" placeholder="Enter a Topic name for add" required>
                <button class="addBtn" id="addNewTopicBtn">Enter</button>
            </div>
        `;

        // Create the list for topics
        const ul = document.createElement("ul");

        unitData.topics.forEach(topicData => {
            const li = document.createElement("li");
            li.textContent = topicData.topic;
            li.onclick = () => loadQuestion(topicData.questionsWithAns, 0); // Pass unit and topic names dynamically
            ul.appendChild(li);
        });

        // Append the list to the unit container
        unitDiv.appendChild(ul);

        // Add the unit container to the main container
        unitContainer.appendChild(unitDiv);
    });
};


// Example questions on Operating Systems
const operatingSystemQuestions = [
  {
    question: "What is the main function of an operating system?",
    options: [
      "Manage hardware resources",
      "Provide antivirus protection",
      "Enable internet access",
      "Design software applications",
    ],
    correct: 0,
  },
  {
    question: "Which of the following is a type of operating system?",
    options: ["HTTP", "Windows", "Python", "HTML"],
    correct: 1,
  },
  {
    question: "What is a process in the context of operating systems?",
    options: [
      "A physical component",
      "An instance of a program in execution",
      "A programming language",
      "An input/output device",
    ],
    correct: 1,
  },
  {
    question: "What does a scheduler do in an operating system?",
    options: [
      "Schedules meetings for users",
      "Allocates CPU time to processes",
      "Manages antivirus software",
      "Handles file backups",
    ],
    correct: 1,
  },
  {
    question: "Which OS is open-source and widely used in servers?",
    options: ["Windows", "macOS", "Linux", "iOS"],
    correct: 2,
  },
];
// Toggle the mobile sidebar visibility
function toggleDropdown() {
  const dropdownContent = document.getElementById("dropdown-content");
  dropdownContent.style.display =
    dropdownContent.style.display === "block" ? "none" : "block";
}

function showTopics(unit) {
  currentUnit = unit;
  const topicsContainer = document.getElementById("topics-container");
  const topicsList = document.getElementById("topics-list");
  topicsList.innerHTML = "";

  // Dynamically create buttons for each topic
  const unitTopics = questions;
  for (const topic in unitTopics) {
    const topicButton = document.createElement("button");
    topicButton.textContent = topic;
    topicButton.setAttribute("data-topic", topic);
    topicButton.onclick = () => loadQuestion(unit, topic);
    topicsList.appendChild(topicButton);
  }

  topicsContainer.style.display = "block";
}

// Start the timer
function startTimer() {
  timer = setInterval(function () {
    if (timeLeft > 0) {
      timeLeft--;
      const minutes = Math.floor(timeLeft / 60);
      const seconds = timeLeft % 60;
      document.getElementById("timer").textContent = `Time Left: ${minutes}:${
        seconds < 10 ? "0" + seconds : seconds
      }`;
    } else {
      clearInterval(timer); // Stop the timer when it reaches 0
      endQuiz(); // Automatically end the quiz if time is up
    }
  }, 1000);
}

// Load the quiz questions
function loadQuestion(questions, questionIndex) {
    // console.log(questions);
  if (isTeacher) {
    showAllWQueston(questions);
  } else {
    currentTopicQuestions = questions;
    currentQuestionIndex = questionIndex;
    responses = new Array(currentTopicQuestions.length).fill(null); // Reset responses
    showQuestion();
    startTimer(); // Start the timer when the quiz begins
  }
}
// show all question of this topic
const showAllWQueston = (topic) => {
  const topic_title = document.getElementById("topic-title");
  const message = document.querySelector(".firstMessage");
  const addAllMessage = document.getElementById("addAllMessage");
  const questions = document.querySelector(".questions");
  const addQuestionBtn = document.getElementById("addQuestionBtn");
  message.style.display = "none";
  addAllMessage.style.display = "none";
  addQuestionBtn.style.display = "block";
  if (topic_title.innerHTML !== topic) {
    topic_title.innerHTML = topic;
    questions.innerHTML = "";
    currentTopicQuestions = operatingSystemQuestions;
    currentTopicQuestions.map((item) => {
      return (questions.innerHTML += `<div class="question">
                        <p>• ${item["question"]}</p>
                        <div class="showOptions">
                            <p>1. ${item["options"][0]}</p>
                            <p>2. ${item["options"][1]}</p>
                        </div>
                        <div class="showOptions">
                            <p>3. ${item["options"][2]}</p>
                            <p>4. ${item["options"][3]}</p>
                        </div>
                    </div>`);
    });
  }
};

// Show the current question
function showQuestion() {
  const questionContainer = document.getElementById("question-text");
  const optionsContainer = document.getElementById("options");
  const feedbackContainer = document.getElementById("feedback");
  const submitBtn = document.querySelector(".submit-btn");

  if (currentQuestionIndex < currentTopicQuestions.length) {
    const currentQuestion = currentTopicQuestions[currentQuestionIndex];
    questionContainer.textContent = `${currentQuestionIndex + 1}. ${
      currentQuestion.question
    }`;
    optionsContainer.innerHTML = currentQuestion.options
      .map(
        (option, idx) =>
          `<label><input type="radio" name="option" value="${idx}"> ${option}</label>`
      )
      .join("");
    feedbackContainer.textContent = "";
    submitBtn.textContent =
      currentQuestionIndex === currentTopicQuestions.length - 1
        ? "Submit Quiz"
        : "Next";
    submitBtn.onclick = handleNext;
  } else {
    endQuiz(); // End the quiz when all questions are answered
  }
}

// Handle the next question or submit
function handleNext() {
  const selectedOption = document.querySelector('input[name="option"]:checked');
  if (!selectedOption) {
    alert("Please select an option before proceeding.");
    return;
  }
  responses[currentQuestionIndex] = parseInt(selectedOption.value);
  currentQuestionIndex++;
  showQuestion();
}

// Calculate the score
function calculateScore() {
  score = responses.reduce(
    (total, response, idx) =>
      total + (response === currentTopicQuestions[idx].correct ? 1 : 0),
    0
  );
}

// End the quiz and show results
function endQuiz() {
  // Disable further interaction
  document.querySelector(".main-container").style.pointerEvents = "none";

  // Clear any remaining time on the timer (if user finishes early)
  clearInterval(timer);

  // Calculate score and time taken
  calculateScore();
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  // Display result and time taken
  const questionContainer = document.getElementById("question-text");
  const optionsContainer = document.getElementById("options");
  const feedbackContainer = document.getElementById("feedback");
  const submitBtn = document.querySelector(".submit-btn");

  questionContainer.textContent = `Quiz Completed! Your Score: ${score}/${currentTopicQuestions.length}`;
  optionsContainer.innerHTML = responses
    .map((response, idx) => {
      const isCorrect = response === currentTopicQuestions[idx].correct;
      return `<p style="color: ${isCorrect ? "green" : "red"};">Q${idx + 1}: ${
        currentTopicQuestions[idx].question
      }<br> Your Answer: ${
        response !== null
          ? currentTopicQuestions[idx].options[response]
          : "No Answer"
      } <br> Correct Answer: ${
        currentTopicQuestions[idx].options[currentTopicQuestions[idx].correct]
      } (${isCorrect ? "Correct" : "Incorrect"})</p>`;
    })
    .join("");
  feedbackContainer.textContent = `Time left: ${minutes}:${
    seconds < 10 ? "0" + seconds : seconds
  }`;
  submitBtn.style.display = "none"; // Hide the submit button
}
function finishQuiz() {
  alert("Quiz Completed!");
  document.getElementById("quizSection").style.display = "none"; // Hide quiz section
  document.getElementById("backButton").style.display = "inline-block"; // Show back button
}

// Function to handle back button click
function goBack() {
  window.location.href = "Questionpage.html"; // Replace with your fixed page URL
}
function toggleMobileMenu() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "block";
}
function closeSidebar() {
  const sidebar = document.querySelector(".sidebar");
  sidebar.style.display = "none";
}

if (isTeacher) {
  //   add buttons work
  const addUnitBtn = document.getElementById("addUnitBtn");
  const addUnitDiv = document.querySelector(".addUnit");
  const addNewUnitBtn = document.getElementById("addNewUnitBtn");

  addUnitBtn.addEventListener("click", () => {
    addUnitDiv.style.display =
      addUnitDiv.style.display == "block" ? "none" : "block";
  });

  addNewUnitBtn.addEventListener("click", () => {
    const unitInput = document.getElementById("unitNameInp").value;
    console.log("unit name : ", unitInput);
    document.getElementById("unitNameInp").value = "";
    addUnitDiv.style.display = "none";
  });

  const addTopicBtn = document.getElementById("addTopicBtn");
  const addTopicDiv = document.querySelector(".addTopic");
  const addNewTopicBtn = document.getElementById("addNewTopicBtn");

  addTopicBtn.addEventListener("click", () => {
    addTopicDiv.style.display =
      addTopicDiv.style.display == "block" ? "none" : "block";
  });

  addNewTopicBtn.addEventListener("click", () => {
    const topicNameInp = document.getElementById("topicNameInp").value;
    console.log("Topic name : ", topicNameInp);
    document.getElementById("topicNameInp").value = "";
    addTopicDiv.style.display = "none";
  });

  // add question field handle
  const addQuestionBtn = document.getElementById("addQuestionBtn");
  const addQuestionForm = document.querySelector(".addQuestionForm");
  const addNewQuestionBtn = document.getElementById("addNewQuestionBtn");

  addQuestionBtn.addEventListener("click", () => {
    addQuestionForm.style.display =
      addQuestionForm.style.display == "block" ? "none" : "block";
  });

  addNewQuestionBtn.addEventListener("click", () => {
    // get the value form input field
    const questionInp = document.getElementById("questionInp").value;
    const optionOne = document.getElementById("optionOne").value;
    const optionTwo = document.getElementById("optionTwo").value;
    const optionThree = document.getElementById("optionThree").value;
    const optionFour = document.getElementById("optionFour").value;
    let correctOptionone = document.getElementById("correctOptionone");
    let correctOptiontwo = document.getElementById("correctOptiontwo");
    let correctOptionthree = document.getElementById("correctOptionthree");
    let correctOptionfour = document.getElementById("correctOptionfour");
    // set the radio button value
    correctOptionone.value = optionOne;
    correctOptiontwo.value = optionTwo;
    correctOptionthree.value = optionThree;
    correctOptionfour.value = optionFour;
    // get the radio buttons
    const correctOption = document.getElementsByName("correctOption");
    // print the input field value
    console.log("Question : ", questionInp);
    console.log(
      "Options : ",
      optionOne,
      " ",
      optionTwo,
      " ",
      optionThree,
      " ",
      optionFour
    );
    // get the radio button value which is checked
    for (let i = 0; i < correctOption.length; i++) {
      if (correctOption[i].checked) {
        console.log("correct option : ", correctOption[i].value, " ", i);
        // clear the radio button input
        correctOption[i].checked = false;
      }
    }
    // clear the options input field
    document.getElementById("optionOne").value = "";
    document.getElementById("optionTwo").value = "";
    document.getElementById("optionThree").value = "";
    document.getElementById("optionFour").value = "";
    // clear the radio button value
    correctOptionone.value = "";
    correctOptiontwo.value = "";
    correctOptionthree.value = "";
    correctOptionfour.value = "";
    // clear the question input value
    document.getElementById("questionInp").value = "";
    // set the form invisible
    addQuestionForm.style.display = "none";
  });

  // Handle form
  const formHolder = document.querySelector(".formHolder");

  // show questions
  const showAddedQuestionsDiv = document.querySelector(".showAddedQuestions");

  const showQuestions = (addedQuestions) => {
    if (addedQuestions.length == 0) {
      showAddedQuestionsDiv.innerHTML = `<p>Added Questions shown here...</p>`;
    } else {
      showAddedQuestionsDiv.innerHTML = "";
      addedQuestions.map((question) => {
        return (showAddedQuestionsDiv.innerHTML += `<div class="question">
                    <p>• ${question["question"]}</p>
                    <div class="showOptions">
                        <p class=${question["correct"] == 0 && "green"}>1. ${
          question["options"][0]
        }</p>
                        <p class=${question["correct"] == 1 && "green"}>2. ${
          question["options"][1]
        }</p>
                    </div>
                    <div class="showOptions">
                        <p class=${question["correct"] == 2 && "green"}>3. ${
          question["options"][2]
        }</p>
                        <p class=${question["correct"] == 3 && "green"}>4. ${
          question["options"][3]
        }</p>
                    </div>
                </div>`);
      });
    }
  };
  // Oepn form
  const openFormBtn = document.getElementById("openFormBtn");
  openFormBtn.addEventListener("click", () => {
    formHolder.style.display = "flex";
  });
  // handle colse button
  const colse = document.querySelector(".colseBtn");
  colse.addEventListener("click", () => {
    formHolder.style.display = "none";
  });
  // Handle add button
  const add = document.getElementById("addNew");

  add.addEventListener("click", () => {
    const questionInp = document.getElementById("questionFormInp").value;
    const optionOne = document.getElementById("formoptionOne").value;
    const optionTwo = document.getElementById("formoptionTwo").value;
    const optionThree = document.getElementById("formoptionThree").value;
    const optionFour = document.getElementById("formoptionFour").value;
    let correctOptionone = document.getElementById("formcorrectOptionone");
    let correctOptiontwo = document.getElementById("formcorrectOptiontwo");
    let correctOptionthree = document.getElementById("formcorrectOptionthree");
    let correctOptionfour = document.getElementById("formcorrectOptionfour");
    // set the radio button value
    correctOptionone.value = optionOne;
    correctOptiontwo.value = optionTwo;
    correctOptionthree.value = optionThree;
    correctOptionfour.value = optionFour;
    // get the radio buttons
    const correctOption = document.getElementsByName("formCorrectOption");
    // print the input field value
    console.log("Question : ", questionInp);
    console.log(
      "Options : ",
      optionOne,
      " ",
      optionTwo,
      " ",
      optionThree,
      " ",
      optionFour
    );
    // get the radio button value which is checked
    for (let i = 0; i < correctOption.length; i++) {
      if (correctOption[i].checked) {
        console.log("correct option : ", correctOption[i].value, " ", i);
        // Insert into addedQuestions array
        addedQuestions.push({
          question: questionInp,
          options: [optionOne, optionTwo, optionThree, optionFour],
          correct: i,
        });
        // show questions
        showQuestions(addedQuestions);
        // clear the radio button input
        correctOption[i].checked = false;
      }
    }
    document.getElementById("formoptionOne").value = "";
    document.getElementById("formoptionTwo").value = "";
    document.getElementById("formoptionThree").value = "";
    document.getElementById("formoptionFour").value = "";
    // clear the radio button value
    correctOptionone.value = "";
    correctOptiontwo.value = "";
    correctOptionthree.value = "";
    correctOptionfour.value = "";
    // clear the question input value
    document.getElementById("questionFormInp").value = "";
  });

  // Handle submit button
  const submitBtn = document.getElementById("submitForm");

  submitBtn.addEventListener("click", () => {
    const unitNameFormInp = document.getElementById("unitNameFormInp").value;
    const topicNameFormInp = document.getElementById("topicNameFormInp").value;

    //Print the details
    console.log("Unit name : ", unitNameFormInp);
    console.log("Topic name : ", topicNameFormInp);
    console.log("questions : ", addedQuestions);

    // clear the options input field
    document.getElementById("unitNameFormInp").value = "";
    document.getElementById("topicNameFormInp").value = "";
    showAddedQuestionsDiv.innerHTML = "";
    addedQuestions = [];

    // set the form invisible
    formHolder.style.display = "none";
  });
}
