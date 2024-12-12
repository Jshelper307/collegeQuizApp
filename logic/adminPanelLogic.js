// Simulated Data
let leaderboardData = [
  { rank: 1, fullName: "Joy Sarkar",totalMarks: 4 ,totalTimeTaken: 6 ,userName: "27600121023JS"},
  { rank: 2, fullName: "Chitra Dey",totalMarks: 3 ,totalTimeTaken: 8 ,userName: "27600121025CD"},
  { rank: 3, fullName: "Neha Dhara",totalMarks: 2 ,totalTimeTaken: 10,userName: "27600121026ND" },
  { rank: 4, fullName: "Debayan Patra",totalMarks: 2 ,totalTimeTaken: 9 ,userName: "27600121027DP" },
  { rank: 5, fullName: "Soham Pattanayak",totalMarks: 1 ,totalTimeTaken: 10 ,userName: "27600121021SP" },
];
// {fullName: "Joy Sarkar",totalMarks: 4 ,totalTimeTaken: 6 ,userName: "27600121023JS"}

document.addEventListener('DOMContentLoaded',()=>{
  const token = localStorage.getItem("token");
  loadTeacherData(token);
})

const loadTeacherData = (token)=>{
  const url = `http://localhost:3000/teacher/getTeacher`;
  fetch(url,{
    headers:{
      'content-type':'application/json',
      'Authorization': `Bearer ${token}`
    },
    method:"POST",
  }).then(response=>response.json())
  .then(data=>{
    // console.log("Data from adminpanel.js : ",data);
    if(data.success){
      document.getElementById("greetingDiv").innerHTML = `Welcome, ${data.fullName}`;
      loadData(data.exams);
    }
    else{
      localStorage.removeItem("token");
      window.location.href = "register.html";
    }
  })
  .catch(error=>{
    console.log("Error from adminpanel.js : ",error);
  })
}
// load the exam data to frontend
const loadData = (examData)=>{
  examData.map(exam=>{
    if(exam.status === "Not Started"){
      addUpcomming(exam);
    }
    else{
      addLiveAndFinished(exam);
    }
  })

}

const addUpcomming = (exam)=>{
  const upcommingTestsDiv = document.getElementById("upcommingTests");
  const div = document.createElement("div");
  div.className = "box";
  const descDiv = document.createElement("div");
  descDiv.className = "descriptionContainer";
  descDiv.innerHTML = `Description<p>${exam.details.exam_description}</p>`
  const titleDiv = document.createElement("h3");
  titleDiv.innerHTML = `Title : ${exam.details.exam_title}`;
  const datesDiv = document.createElement("div");
  datesDiv.innerHTML = `Start : <span>${exam.details.examStartDate}</span><br>End : <span>${exam.details.examEndDate}</span>`;
  const buttonHolderDiv = document.createElement("div");
  buttonHolderDiv.className = "buttonHolder";
  const editBtn = document.createElement("button");
  editBtn.className = "Btn";
  editBtn.innerHTML = `<img src="../icons/icons8-edit.svg" alt="edit">`
  editBtn.addEventListener("click",()=>{
    console.log("Edited : ",exam.examId);
    localStorage.setItem("editedExamId",exam.examId);
    window.location.href = "createQuizPage.html";
  })
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "Btn";
  deleteBtn.innerHTML = `<img src="../icons/icons8-delete.svg" alt="delete">`
  deleteBtn.addEventListener("click",()=>{
    console.log("Deleted : ",exam.examId);
    deleteExam(exam.examId);
  })
  buttonHolderDiv.appendChild(editBtn);
  buttonHolderDiv.appendChild(deleteBtn);

  div.appendChild(descDiv);
  div.appendChild(titleDiv);
  div.appendChild(datesDiv);
  div.appendChild(buttonHolderDiv);
  upcommingTestsDiv.appendChild(div);
}

const addLiveAndFinished = (exam)=>{
  const liveAndFinishedTestsDiv = document.getElementById("liveAndFinishedTests");
  const div = document.createElement("div");
  div.className = "box";
  const descDiv = document.createElement("div");
  descDiv.className = "descriptionContainer";
  descDiv.innerHTML = `Description<p>${exam.details.exam_description}</p>`
  const titleDiv = document.createElement("h3");
  titleDiv.innerHTML = `Title : ${exam.details.exam_title}`;
  const datesDiv = document.createElement("div");
  datesDiv.innerHTML = `Start : <span>${exam.details.examStartDate}</span><br>End : <span>${exam.details.examEndDate}</span>`;
  if(exam.status === "Live"){
    const statusDiv = document.createElement("div");
    statusDiv.innerHTML=`🔴 Live`;
    datesDiv.appendChild(statusDiv);
  }
  div.appendChild(descDiv);
  div.appendChild(titleDiv);
  div.appendChild(datesDiv);
  div.addEventListener("click",()=>{
    showLeaderBoard(exam.examId);
  })
  liveAndFinishedTestsDiv.appendChild(div);
}


const showLeaderBoard = (examId)=>{
  const url = `http://localhost:3000/exams/exam/${examId}/get_results`
  fetch(url)
  .then(response=>response.json())
  .then(data=>{
    console.log(data.examResults.results);
    renderLeaderboard(data.examResults.results);
  })
  .catch(error=>{
    console.log("error from showLeaderBoard : ",error);
  })
}

// Function to render the leaderboard
function renderLeaderboard(data) {
  const leaderboard_header = document.querySelector(".leaderboard-header");
  const leaderboaedHolder = document.querySelector(".leaderboaedHolder");
  // Reference to the leaderboard list
  const leaderboardList = document.querySelector(".leaderboard-list");
  // Clear existing items
  leaderboardList.innerHTML = '';
  leaderboard_header.style.display = "block";
  leaderboaedHolder.style.display = "block";
  // Iterate over the data and create list items
  data.forEach((player,index) => {
    const listItem = document.createElement('li');
    listItem.classList.add('leaderboard-item');

    listItem.innerHTML = `
      <span class="rank">${index+1}</span>
      <span class="name">${player.fullName}</span>
      <span class="score">${player.totalMarks}</span>
      <span class="time">${player.totalTimeTaken} S</span>
    `;

    // Append the item to the leaderboard list
    leaderboardList.appendChild(listItem);
  });
}


// Download the Leader board in csv format


document.getElementById('download-btn').addEventListener('click', () => {
  // Convert leaderboard data to CSV string
  const csvRows = [
    'Rank,Name,Score,Time', // Header row
    ...leaderboardData.map(player => `${player.rank},${player.fullName},${player.totalMarks},${player.totalTimeTaken},${player.userName}`) // Data rows
  ];
  const csvStr = csvRows.join('\n');

  // Create a blob and object URL
  const blob = new Blob([csvStr], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);

  // Create a temporary download link
  const link = document.createElement('a');
  link.href = url;
  link.download = 'leaderboard.csv';
  document.body.appendChild(link);

  // Programmatically click the link and remove it
  link.click();
  document.body.removeChild(link);
});

document.querySelector(".action-button").addEventListener("click",()=>{
  if(localStorage.getItem("editedExamId")){
    localStorage.removeItem("editedExamId");
  }
  window.location.href = "createQuizPage.html";
})


const deleteExam =async (examId)=>{
  const token = localStorage.getItem("token");
  try {
    const response = await fetch(`http://localhost:3000/exams/delete-exam/${examId}`, {
      headers:{
        'content-type':'application/json',
        'Authorization': `Bearer ${token}`
      },
        method: "DELETE"
    });

    if (response.ok) {
        const result = await response.json();
        console.log("Exam deleted successfully:", result);
        alert("Exam deleted successfully!");
    } else {
        const error = await response.json();
        console.error("Error deleting exam:", error.message);
        alert(`Error: ${error.message}`);
    }
  } catch (error) {
      console.error("Network or server error:", error);
      alert("An error occurred while deleting the exam.");
  }
}