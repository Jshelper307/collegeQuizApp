document.addEventListener("DOMContentLoaded", async () => {
    let examData = {}; // Stores exam data
    let currentIndex = 0; // Tracks current question index
    let answersWithTime = []; // Tracks user answers and time taken
    let timerId; // Stores timer interval
    const timerElement = document.getElementById("timer");
    const questionElement = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options");
    const nextButton = document.querySelector(".submit-btn");
    const heading = document.getElementById("heading");
  
    // Load exam data
    await loadExamData();
    initializeExam();
  
    // Load exam data (simulate API call)
    async function loadExamData() {
      // Simulating fetching exam data from an API
      examData = {
        success: true,
        exams: {
          exam: {
            title: "Array",
            time_limit_perQuestion: 30,
            questionsWithAns: [
              {
                question: "This is question 1",
                options: ["a", "aa", "aaa", "aaaa"],
                answer: "aa",
              },
              {
                question: "What is the capital of France?",
                options: ["Paris", "Berlin", "Madrid", "Rome"],
                answer: "Paris",
              },
            ],
          },
        },
      };
    }
  
    // Initialize the exam
    function initializeExam() {
      const examTitle = examData.exams.exam.title;
      heading.textContent = examTitle;
      loadQuestion(currentIndex);
    }
  
    // Load a question
    function loadQuestion(index) {
      if (index >= examData.exams.exam.questionsWithAns.length) {
        finishExam();
        return;
      }
  
      const questionData = examData.exams.exam.questionsWithAns[index];
      questionElement.textContent = questionData.question;
      optionsContainer.innerHTML = questionData.options
        .map(
          (option) =>
            `<label><input type="radio" name="option" value="${option}"> ${option}</label>`
        )
        .join("");
  
      if (index === examData.exams.exam.questionsWithAns.length - 1) {
        nextButton.textContent = "Submit";
      }
  
      startTimer(examData.exams.exam.time_limit_perQuestion, index);
    }
    nextButton.addEventListener('click', () => {
        const options = document.getElementsByName("option"); // Get all radio buttons for the current question
        let isOptionSelected = false;
      
        // Check if any option is selected
        for (let i = 0; i < options.length; i++) {
          if (options[i].checked) {
            isOptionSelected = true; // If an option is selected, set flag to true
            break; // No need to check further if one option is selected
          }
        }
      
        // If no option is selected, show an alert and return without moving to the next question
        if (!isOptionSelected) {
          alert("Please select an option before proceeding to the next question.");
          return; // Prevent proceeding to the next question
        }
      
        // If an option is selected, proceed to the next question
        currentQuestionIndex++;
        loadQuestion(currentQuestionIndex); // Load the next question
      });
    // Start the timer for the question
    function startTimer(duration, questionIndex) {
      let timeRemaining = duration;
      timerElement.textContent = `Time Remaining:${timeRemaining}s`;
  
      clearInterval(timerId); // Clear any existing timer
      timerId = setInterval(() => {
        timeRemaining--;
        timerElement.textContent = `Time Remaining:${timeRemaining}s`;
  
        if (timeRemaining <= 0) {
          clearInterval(timerId);
          recordAnswer();
  
          // Check if it's the last question
          if (questionIndex === examData.exams.exam.questionsWithAns.length - 1) {
            finishExam();
          } else {
            currentIndex++;
            loadQuestion(currentIndex);
          }
        }
      }, 1000);
    }
  
    // Record the user's answer
    function recordAnswer() {
      const selectedOption = document.querySelector(
        'input[name="option"]:checked'
      );
  
      if (selectedOption) {
        answersWithTime.push({
          answer: selectedOption.value,
          timeTaken: parseInt(timerElement.textContent),
        });
      } else {
        answersWithTime.push({
          answer: null,
          timeTaken: parseInt(timerElement.textContent),
        });
      }
    }
  
    // Finish the exam
    function finishExam() {
      clearInterval(timerId);
      alert("The exam is complete. Submitting your answers...");
      questionElement.textContent =
        "Thank you for participating! Your responses have been recorded.";
      optionsContainer.innerHTML = "";
      nextButton.style.display = "none";
      timerElement.textContent = "";
  
      console.log("User Responses:", answersWithTime);
      submitResults();
    }
  
    // Submit the exam results
    function submitResults() {
      // Simulate sending data to a server
      console.log("Submitting results...");
      console.log("Answers with time:", answersWithTime);
  
      // Add fetch or AJAX logic here to submit results to the server
    }
  
    // Handle "Next" button click
    nextButton.addEventListener("click", () => {
      recordAnswer();
      currentIndex++;
      loadQuestion(currentIndex);
    });
   
});
  