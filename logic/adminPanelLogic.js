// Simulated Data
let leaderboardData = [];
// {fullName: "Joy Sarkar",totalMarks: 4 ,totalTimeTaken: 6 ,userName: "27600121023JS"}

document.addEventListener('DOMContentLoaded',()=>{
  const token = localStorage.getItem("token");
  loadTeacherData(token);
  const isUpdate = localStorage.getItem("isUpdate");
  if(isUpdate){
    // alert("Exam updated successfully!");
    new Notification({
      text: "Exam updated successfully!",
      style: {
        background: '#222',
        color: '#fff',
        transition: 'all 350ms linear',
        // more CSS styles here
      },
      autoClose: 3000,
    });
    localStorage.removeItem("isUpdate");
  }
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
  const examDivHolder = document.createElement("div");
  examDivHolder.style.border = "2px solid red";
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
    // console.log("Edited : ",exam.examId);
    localStorage.setItem("editedExamId",exam.examId);
    window.location.href = "createQuizPage.html";
  })
  const deleteBtn = document.createElement("button");
  deleteBtn.className = "Btn";
  deleteBtn.innerHTML = `<img src="../icons/icons8-delete.svg" alt="delete">`
  deleteBtn.addEventListener("click",()=>{
    // console.log("Deleted : ",exam.examId);
    if(confirm("Are you want to delete this exam ?")){
      deleteExam(exam.examId);
    }
  })
  const copyLink = document.createElement("button");
  copyLink.className = "Btn";
  copyLink.innerHTML = `<img src="../icons/copy.svg" alt="delete">`;
  copyLink.onclick = ()=>{
    copyLinkAddress(exam);
  }

  buttonHolderDiv.appendChild(copyLink);
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
  const examHolderDiv = document.createElement("div");
  examHolderDiv.className = "examHolder";
  const div = document.createElement("div");
  div.className = "box";
  const descDiv = document.createElement("div");
  descDiv.className = "descriptionContainer";
  descDiv.innerHTML = `Description<p>${exam.details.exam_description}</p>`
  const titleDiv = document.createElement("h3");
  titleDiv.innerHTML = `Title : ${exam.details.exam_title}`;
  const datesDiv = document.createElement("div");
  datesDiv.innerHTML = `Start : <span>${exam.details.examStartDate}</span><br>End : <span>${exam.details.examEndDate}</span>`;
  div.appendChild(descDiv);
  div.appendChild(titleDiv);
  div.appendChild(datesDiv);
  div.addEventListener("click",()=>{
    showLeaderBoard(exam.examId);
  })
  const status = document.createElement("div");
  status.className = "examStatus";
  const copyLink = document.createElement("button");
  copyLink.className = "Btn";
  copyLink.innerHTML = `<img src="../icons/copy.svg" alt="delete">`;
  copyLink.onclick = ()=>{
    copyLinkAddress(exam);
  }
  status.appendChild(copyLink);
  if(exam.status === 'Live'){
    const live = document.createElement("span");
    live.innerHTML = `🔴 Live`;
    live.style.color = "white";
    status.appendChild(live);
  }
  else{
    const deleteBtn = document.createElement("button");
    deleteBtn.className = "Btn";
    deleteBtn.innerHTML = `<img src="../icons/icons8-delete.svg" alt="delete">`
    deleteBtn.addEventListener("click",()=>{
      // console.log("Deleted : ",exam.examId);
      if(confirm("Are you want to delete this exam ?")){
        deleteExam(exam.examId);
      }
    })
    status.appendChild(deleteBtn);
  }
  examHolderDiv.appendChild(div);
  examHolderDiv.appendChild(status);
  liveAndFinishedTestsDiv.appendChild(examHolderDiv);
}

// this function copy link address to the clipboard
const copyLinkAddress = (exam) => {
  const examLink = `http://localhost:5500/pages/test.html?id=${exam.examId}`;
  
  // Copy the link to the clipboard
  navigator.clipboard.writeText(examLink)
    .then(() => {
      // console.log("Exam link copied successfully:", examLink);
      
      // Show notification
      new Notification({
        text: "Exam link copied successfully .",
        style: {
          background: '#222',
          color: '#fff',
          transition: 'all 350ms linear',
          // more CSS styles here
        },
        autoClose: 3000,
      });
    })
    .catch((err) => {
      // console.error("Failed to copy the link:", err);
      new Notification({
        text: "Failed to copy the link .",
        style: {
          background: '#222',
          color: '#fff',
          transition: 'all 350ms linear',
          // more CSS styles here
        },
        autoClose: 3000,
      });
    });
};


const showLeaderBoard = (examId)=>{
  const url = `http://localhost:3000/exams/exam/${examId}/get_results`
  fetch(url)
  .then(response=>response.json())
  .then(data=>{
    // console.log(data.examResults.results);
    renderLeaderboard(data.examResults.results);
    leaderboardData = data.examResults.results;
  })
  .catch(error=>{
    console.log("error from showLeaderBoard : ",error);
  })
}

// Function to render the leaderboard
function renderLeaderboard(data) {
  const leaderboard_header = document.querySelector(".leaderboard-header");
  const leaderboaedHolder = document.querySelector(".leaderboaedHolder");
  const tableHeader = document.querySelector(".tableHeader");
  tableHeader.style.display = "flex";
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
    let time = "0S";
    if(player.totalTimeTaken>=60 && player.totalTimeTaken<3600){
      time = secToMin(player.totalTimeTaken);
    }
    else if(player.totalTimeTaken>=3600){
      time = secToHour(player.totalTimeTaken);
    }
    else{
      time = `00 : 00 : ${String(player.totalTimeTaken).padStart(2,'0')}`;
    }

    listItem.innerHTML = `
      <span class="rank">${index+1}</span>
      <span class="name">${player.fullName}</span>
      <span class="score">${player.totalMarks}</span>
      <span class="time">${time}</span>
    `;

    // Append the item to the leaderboard list
    leaderboardList.appendChild(listItem);
  });
}


// Download the Leader board in csv format


document.getElementById('download-btn').addEventListener('click', () => {
  console.log("leaderboard Data : ",leaderboardData);
  // Convert leaderboard data to CSV string
  const csvRows = [
    'Rank,UserName,Name,Score,Time', // Header row
    ...leaderboardData.map((player,index) =>`${index+1},${player.userName},${player.fullName},${player.totalMarks},${player.totalTimeTaken} Sec`) // Data rows
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
        // const result = await response.json();
        await response.json();
        // console.log("Exam deleted successfully:", result);
        new Notification({
          text: "Exam deleted successfully!",
          style: {
            background: '#222',
            color: '#fff',
            transition: 'all 350ms linear',
            // more CSS styles here
          },
          autoClose: 3000,
        });
    } else {
        const error = await response.json();
        console.error("Error deleting exam:", error.message);
        new Notification({
          text: `Error: ${error.message}`,
          style: {
            background: '#222',
            color: '#fff',
            transition: 'all 350ms linear',
            // more CSS styles here
          },
          autoClose: 3000,
        });
    }
  } catch (error) {
      // console.error("Network or server error:", error);
      new Notification({
        text: "An error occurred while deleting the exam.",
        style: {
          background: '#222',
          color: '#fff',
          transition: 'all 350ms linear',
          // more CSS styles here
        },
        autoClose: 3000,
      });
      // alert("An error occurred while deleting the exam.");
  }
}

const secToMin=(sec)=>{
  let min=String(Math.floor(sec/60)).padStart(2,'0');
  let remsec = String(sec%60).padStart(2,'0');
  return `00 : ${min} : ${remsec}`;
}

const secToHour=(sec)=>{
  let hr = String(Math.floor(sec/(60*60))).padStart(2,'0');
  let min=String(Math.floor((sec-(60*60))/60)).padStart(2,'0');
  let remsec = String((sec-(60*60))%60).padStart(2,'0');
  return `${hr} : ${min} : ${remsec}`;
}