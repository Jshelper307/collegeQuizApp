let totalQuestions = 0;
let questions = [];
const optionBoxes = document.querySelectorAll(".option-item");

document.addEventListener("DOMContentLoaded", () => {
  const examStartDate = document.getElementById("eventOpeningDay");
  const examEndDate = document.getElementById("eventClosingDay");
  setMinDate(examStartDate);
  examEndDate.addEventListener("click", () => {
    checkStartDateValue(examStartDate, examEndDate);
  });
});
// this function set the exam start date min value to the present date value
const setMinDate = (examStartDate) => {
  const now = new Date();
  const formattedDNow = now.toISOString().slice(0, 16);
  // set the min and max attribute
  examStartDate.min = formattedDNow;
};

// This function check that exam start date is filled or not if filled it set the exam end date
//  min value to exam start date value and max value to 30 day after from start date
const checkStartDateValue = (examStartDate, examEndDate) => {
  // console.log("start date value ")
  if (examStartDate.value.length === 0) {
    alert("first enter exam start date");
  } else {
    const maxGap = 30; //Maximum Gap between exam start and end date in days
    const examdate = new Date(examStartDate.value);
    const maxDateTime = new Date(
      examdate.getTime() + maxGap * 24 * 60 * 60 * 1000
    );
    const formattedDMax = maxDateTime.toISOString().slice(0, 16);
    examEndDate.min = examStartDate.value;
    examEndDate.max = formattedDMax;
  }
};

// Script to handle interactivity
// Done button logic
// document.querySelector(".done").addEventListener("click", () => {
//   const title = document.getElementById("title").value;
//   const description = document.getElementById("description").value;
//   const points = document.getElementById("points").value;
//   const timeLimit = document.getElementById("time-limit").value;
//   console.log("title : ",title);
//   console.log("description : ",description);
//   console.log("points : ",points);
//   console.log("timeLimit : ",timeLimit);
//   console.log("questions : ",questions);

//   fetch('http://localhost:3000/exams/create-exam',{
//     headers:{
//       'content-type':'application/json'
//     },
//     method:"POST",
//     body: JSON.stringify({title:title,description:description,points_per_question:points,time_limit:timeLimit,questionsWithAns:questions})
//   })
//   .then(response=>{
//     if(!response.ok){
//       throw new Error(`HTTP error! status: ${response.status}`);
//     }
//     return response.json();
//   })
//   .then(data=>{
//     console.log("log from teacherPageLogic : ",data);
//     if(data['success']){
//       showExamLink(data['examUrl']);
//     }
//     else{
//       console.log("some error occure");
//     }
//   })
//   .catch(error=>{
//     console.log(error);
//   })
//   // alert("Test saved successfully!");
// });

document.querySelector(".done").addEventListener("click", () => {
  // Department inputs
  const department = document.getElementById("department");
  const customDepartment = document.getElementById("custom-department");
  // subject inputs
  const subject = document.getElementById("subject");
  const customSubject = document.getElementById("custom-subject");
  // topic input
  const topic = document.getElementById("topic");
  // Description input
  const description = document.getElementById("description");
  // Time limit per quesiton
  const timePerQuestion = document.getElementById("time-per-question");
  const customtimePerQuestion = document.getElementById("custom-total-time");
  // Points per question
  const points = document.getElementById("points");
  const customPoints = document.getElementById("custom-points");
  // Exam start date and time
  const startDateAndTime = document.getElementById("eventOpeningDay");
  // Exam End date and time
  const endDateAndTime = document.getElementById("eventClosingDay");
// 
  const departmentAns = department.value === "other" ? customDepartment : department;
  const subjectAns = subject.value === "other" ? customSubject : subject;
  const timePerQuestionAns = timePerQuestion.value === "other" ? customtimePerQuestion : timePerQuestion;
  const pointsPerQuestionAns = points.value === "other" ? customPoints : points;

  // validate the form
  const isValidForm = validateForm(
    departmentAns,
    subjectAns,
    topic,
    description,
    timePerQuestionAns,
    pointsPerQuestionAns,
    startDateAndTime,
    endDateAndTime,
    questions
  );

  if (isValidForm) {
  // Submit the data in database
  fetch('http://localhost:3000/exams/create-exam',{
        headers:{
          'content-type':'application/json'
        },
        method:"POST",
        body: JSON.stringify({department :departmentAns,subject:subjectAns,title :topic,description:description,time_limit_perQuestion:timePerQuestionAns,points_per_question :pointsPerQuestionAns,exam_start_date:startDateAndTime,exam_end_date:endDateAndTime,questionsWithAns:questions})
      })
      .then(response=>{
        if(!response.ok){
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data=>{
        console.log("log from teacherPageLogic : ",data);
        if(data['success']){
          showExamLink(data['examUrl']);
        }
        else{
          console.log("some error occure");
        }
      })
      .catch(error=>{
        console.log(error);
      })

    // Submit data
    console.log("topic : ", topic.value);
    console.log("description : ", description.value);
    console.log({
      department: departmentAns.value,
      subject: subjectAns.value,
      timePerQuestion: timePerQuestionAns.value,
      points: pointsPerQuestionAns.value,
    });
    console.log("startDateAndTime : ", startDateAndTime.value);
    console.log("endDateAndTime : ", endDateAndTime.value);
    console.log("questions : ", questions);

    clearForm(department,customDepartment,subject,customSubject,topic,description,timePerQuestion,customtimePerQuestion,points,customPoints,startDateAndTime,endDateAndTime);
    alert("Form submitted successfully!");
  } else {
    console.log("Not submitted....");
  }
});

// Done button end

// validae form fields
document.getElementById("department").onclick = () => {
  chageBorder(document.getElementById("department"));
};
document.getElementById("custom-department").onclick = () => {
  chageBorder(document.getElementById("custom-department"));
};
// subject inputs
document.getElementById("subject").onclick = () => {
  chageBorder(document.getElementById("subject"));
};
document.getElementById("custom-subject").onclick = () => {
  chageBorder(document.getElementById("custom-subject"));
};
// topic input
document.getElementById("topic").onclick = () => {
  chageBorder(document.getElementById("topic"));
};
// Description input
document.getElementById("description").onclick = () => {
  chageBorder(document.getElementById("description"));
};
// Time limit per quesiton
document.getElementById("time-per-question").onclick = () => {
  chageBorder(document.getElementById("time-per-question"));
};
document.getElementById("custom-total-time").onclick = () => {
  chageBorder(document.getElementById("custom-total-time"));
};
// Points per question
document.getElementById("points").onclick = () => {
  chageBorder(document.getElementById("points"));
};
document.getElementById("custom-points").onclick = () => {
  chageBorder(document.getElementById("custom-points"));
};
// Exam start date and time
document.getElementById("eventOpeningDay").onclick = () => {
  chageBorder(document.getElementById("eventOpeningDay"));
};
// Exam End date and time
document.getElementById("eventClosingDay").onclick = () => {
  chageBorder(document.getElementById("eventClosingDay"));
};

const validateForm = (
  department,
  subject,
  topic,
  description,
  timePerQuestion,
  points,
  startDateAndTime,
  endDateAndTime,
  questions
) => {
  if (department.value.length === 0) {
    chageBorder(department, true);
    return false;
  }
  if (subject.value.length === 0) {
    chageBorder(subject, true);
    return false;
  }
  if (topic.value.length === 0) {
    chageBorder(topic, true);
    return false;
  }
  if (description.value.length === 0) {
    chageBorder(description, true);
    return false;
  }
  if (timePerQuestion.value.length === 0) {
    chageBorder(timePerQuestion, true);
    return false;
  }
  if (points.value.length === 0) {
    chageBorder(points, true);
    return false;
  }
  if (startDateAndTime.value.length === 0) {
    chageBorder(startDateAndTime, true);
    return false;
  }
  if (endDateAndTime.value.length === 0) {
    chageBorder(endDateAndTime, true);
    return false;
  }
  if (questions.length === 0) {
    const previewQuestionBox = document.querySelector(".recent-question");
    chageBorder(previewQuestionBox, true);
    return false;
  }
  return true;
};

const chageBorder = (element, color = false) => {
  if (!color) {
    element.style.border = "none";
  } else {
    element.style.border = "2px solid red";
  }
};

// after submitting the form clear the form
const clearForm = (department,customDepartment,subject,customSubject,topic,description,timePerQuestion,customtimePerQuestion,points,customPoints,startDateAndTime,endDateAndTime)=>{
  let formFields = [department,customDepartment,subject,customSubject,topic,description,timePerQuestion,customtimePerQuestion,points,customPoints,startDateAndTime,endDateAndTime];
  formFields.map(item=>{
    return item.value = "";
  })
  questions = [];
  totalQuestions = 0;
  document.getElementById('total-questions').innerHTML = totalQuestions;
  document.getElementById("recent-questions").innerHTML = "";
}

// Delete button logic start here
document.querySelector(".delete").addEventListener("click", () => {
  if (confirm("Are you sure you want to delete this question?")) {
    alert("Question deleted!");
  }
});

// Delete button end

// Exit button logic start here
document.querySelector(".exit").addEventListener("click", () => {
  if (confirm("Are you sure you want to Exit this page ?")) {
    window.location.href = "adminPanel.html";
  }
});

// Exit button end
document.getElementById("backToHomeBtn").addEventListener("click", () => {
  window.open("../pages/index.html", "_parent");
});

// validate input fields
document.getElementById("question").addEventListener("change", () => {
  document.getElementById("question").style.border = "none";
});
document.getElementById("option1").addEventListener("change", () => {
  optionBoxes[0].style.border = "none";
});
document.getElementById("option2").addEventListener("change", () => {
  optionBoxes[1].style.border = "none";
});
document.getElementById("option3").addEventListener("change", () => {
  optionBoxes[2].style.border = "none";
});
document.getElementById("option4").addEventListener("change", () => {
  optionBoxes[3].style.border = "none";
});

// Function to add question and update the recent question display
function addQuestion() {
  if(document.querySelector(".recent-question").style.border){
    chageBorder(document.querySelector(".recent-question"));
  }
  // Get input values
  const questionText = document.getElementById("question").value;
  const option1 = document.getElementById("option1").value;
  const option2 = document.getElementById("option2").value;
  const option3 = document.getElementById("option3").value;
  const option4 = document.getElementById("option4").value;
  if (questionText.length == 0) {
    document.getElementById("question").style.border = "3px solid red";
    return;
  }
  if (option1.length == 0) {
    optionBoxes[0].style.border = "3px solid red";
    return;
  }
  if (option2.length == 0) {
    optionBoxes[1].style.border = "3px solid red";
    return;
  }
  if (option3.length == 0) {
    optionBoxes[2].style.border = "3px solid red";
    return;
  }
  if (option4.length == 0) {
    optionBoxes[3].style.border = "3px solid red";
    return;
  }

  const correct1 = document.getElementById("correct1");
  const correct2 = document.getElementById("correct2");
  const correct3 = document.getElementById("correct3");
  const correct4 = document.getElementById("correct4");

  correct1.value = option1;
  correct2.value = option2;
  correct3.value = option3;
  correct4.value = option4;

  const correctOption = document.getElementsByName("correctOption");
  let isCorrectSelected = false;
  let selectedAnswer = null;
  for (let i = 0; i < correctOption.length; i++) {
    if (correctOption[i].checked) {
      isCorrectSelected = true;
      selectedAnswer = correctOption[i].value; // Get the correct answer
      break;
    }
  }

  if (!isCorrectSelected) {
    alert("Please mark the correct Answer.");
    return; // Stop execution if no correct answer is marked
  }
  for (let i = 0; i < correctOption.length; i++) {
    if (correctOption[i].checked) {
      questions.push({
        question: questionText,
        options: [option1, option2, option3, option4],
        answer: correctOption[i].value,
      });
    }
  }
  // console.log(questions);
  // Show the preview questions
  showPreviewQuestion(questions);
  // Update the total added questions
  totalQuestions++;
  document.getElementById("total-questions").textContent = totalQuestions;

  // Clear the input fields for the next question
  document.getElementById("question").value = "";
  document.getElementById("option1").value = "";
  document.getElementById("option2").value = "";
  document.getElementById("option3").value = "";
  document.getElementById("option4").value = "";
  correct1.checked = false;
  correct2.checked = false;
  correct3.checked = false;
  correct4.checked = false;
  correct1.value = null;
  correct2.value = null;
  correct3.value = null;
  correct4.value = null;

  // add EventListenr to the edit button
  const editBtn = document.querySelector(".editBtn");

  editBtn.addEventListener("click", (e) => {
    console.log(e);
  });
}

// Show/hide custom input for "Others" in dropdowns
document.getElementById("department").addEventListener("change", (e) => {
  document.getElementById("custom-department").style.display =
    e.target.value === "other" ? "block" : "none";
});

document.getElementById("subject").addEventListener("change", (e) => {
  document.getElementById("custom-subject").style.display =
    e.target.value === "other" ? "block" : "none";
});

document.getElementById("time-per-question").addEventListener("change", (e) => {
  document.getElementById("custom-total-time").style.display =
    e.target.value === "other" ? "block" : "none";
});

document.getElementById("points").addEventListener("change", (e) => {
  document.getElementById("custom-points").style.display =
    e.target.value === "other" ? "block" : "none";
});

// This function show the add question preview
const showPreviewQuestion = (questions) => {
  const preview_area = document.getElementById("recent-questions");
  preview_area.innerHTML = "";
  questions.map((question) => {
    return (preview_area.innerHTML += `
    <div class='question-container'>
      <p><strong>Question :</strong> ${question["question"]}</p>
      <p ${
        question["answer"] === question["options"][0] && "class='green'"
      }'>Option 1: ${question["options"][0]}</p>
      <p ${
        question["answer"] === question["options"][1] && "class='green'"
      }'>Option 2: ${question["options"][1]}</p>
      <p ${
        question["answer"] === question["options"][2] && "class='green'"
      }'>Option 3: ${question["options"][2]}</p>
      <p ${
        question["answer"] === question["options"][3] && "class='green'"
      }'>Option 4: ${question["options"][3]}</p>
      <div class="button-Holder">
        <button class="editBtn"><img src="../icons/icons8-edit.svg" alt="edit" height="20"></button>
        <button class="deleteBtn"><img src="../icons/icons8-delete.svg" alt="delete" height="20"></button>
      </div>
    </div>
  `);
  });
};

// Add More button logic start herer
document.querySelector(".add-more").addEventListener("click", () => {
  addQuestion();
});

// addmore button end

// this function show the exam url
const showExamLink = (examUrl) => {
  const container = document.querySelector(".container");
  const linkContainer = document.querySelector(".linkContainer");
  container.style.display = "none";
  linkContainer.style.display = "block";
  const link = document.querySelector(".link > p");
  link.innerHTML = examUrl;

  // get the copy button
  const copy = document.getElementById("copyBtn");

  copy.addEventListener("click", () => {
    navigator.clipboard.writeText(examUrl);
    alert("link is copied ...");
  });
};
