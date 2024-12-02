let totalQuestions = 0;
let questions = [];



// Script to handle interactivity
document.querySelector(".done").addEventListener("click", () => {
  const title = document.getElementById("title").value;
  const description = document.getElementById("description").value;
  const points = document.getElementById("points").value;
  const timeLimit = document.getElementById("time-limit").value;
  console.log("title : ",title);
  console.log("description : ",description);
  console.log("points : ",points);
  console.log("timeLimit : ",timeLimit);
  console.log("questions : ",questions);
  
  fetch('http://localhost:3000/exams/create-exam',{
    headers:{
      'content-type':'application/json'
    },
    method:"POST",
    body: JSON.stringify({title:title,description:description,points_per_question:points,time_limit:timeLimit,questionsWithAns:questions})
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
  // alert("Test saved successfully!");
});

document.querySelector(".delete").addEventListener("click", () => {
  if (confirm("Are you sure you want to delete this question?")) {
    alert("Question deleted!");
  }
});

document.getElementById("backToHomeBtn").addEventListener("click",()=>{
  window.open('../pages/index.html','_parent');
})



// Function to add question and update the recent question display
function addQuestion() {
  // Get input values
  const questionText = document.getElementById("question").value;
  const option1 = document.getElementById("option1").value;
  const option2 = document.getElementById("option2").value;
  const option3 = document.getElementById("option3").value;
  const option4 = document.getElementById("option4").value;

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
document.querySelector(".done").addEventListener("click", () => {
  const department = document.getElementById("department").value;
  const customDepartment = document.getElementById("custom-department").value.trim();
  const subject = document.getElementById("subject").value;
  const customSubject = document.getElementById("custom-subject").value.trim();
  const totalTime = document.getElementById("total-time").value;
  const customTotalTime = document.getElementById("custom-total-time").value.trim();
  const points = document.getElementById("points").value;
  const customPoints = document.getElementById("custom-points").value.trim();

  let isValid = true;

  // Validate department
  if (department === "other" && !customDepartment) {
    isValid = false;
  } else if (!department) {
    isValid = false;
  }

  // Validate subject
  if (subject === "other" && !customSubject) {
    isValid = false;
  } else if (!subject) {
    isValid = false;
  }

  // Validate total time
  if (totalTime === "other" && !customTotalTime) {
    isValid = false;
  } else if (!totalTime) {
    isValid = false;
  }

  // Validate points
  if (points === "other" && !customPoints) {
    isValid = false;
  } else if (!points) {
    isValid = false;
  }

  // Show error message if validation fails
  if (!isValid) {
    document.getElementById("form-error").style.display = "block";
    return;
  }

  // Hide error message if validation passes
  document.getElementById("form-error").style.display = "none";

  // Submit data
  console.log({
    department: department === "other" ? customDepartment : department,
    subject: subject === "other" ? customSubject : subject,
    totalTime: totalTime === "other" ? customTotalTime : totalTime,
    points: points === "other" ? customPoints : points,
  });

  alert("Form submitted successfully!");
});

// Show/hide custom input for "Others" in dropdowns
document.getElementById("department").addEventListener("change", (e) => {
  document.getElementById("custom-department").style.display = e.target.value === "other" ? "block" : "none";
});

document.getElementById("subject").addEventListener("change", (e) => {
  document.getElementById("custom-subject").style.display = e.target.value === "other" ? "block" : "none";
});

document.getElementById("total-time").addEventListener("change", (e) => {
  document.getElementById("custom-total-time").style.display = e.target.value === "other" ? "block" : "none";
});

document.getElementById("points").addEventListener("change", (e) => {
  document.getElementById("custom-points").style.display = e.target.value === "other" ? "block" : "none";
});

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

document.querySelector(".add-more").addEventListener("click", () => {
  addQuestion();
});


const showExamLink = (examUrl)=>{
  const container = document.querySelector(".container")
  const linkContainer = document.querySelector(".linkContainer");
  container.style.display = "none";
  linkContainer.style.display = "block";
  const link = document.querySelector(".link > p");
  link.innerHTML = examUrl;

  // get the copy button
  const copy = document.getElementById("copyBtn");

  copy.addEventListener("click",()=>{
    navigator.clipboard.writeText(examUrl);
    alert("link is copied ...")
  })
}
