// Simulated Data
const leaderboardData = [
  { rank: 1, name: 'Chitra', score: 95 ,time: '30s'},
  { rank: 2, name: 'Joy', score: 90, time:'27s' },
  { rank: 3, name: 'Debayan', score: 85, time:'26s' },
  { rank: 4, name: 'soham', score: 80, time:'25s' },
  { rank: 5, name: 'Neha', score: 75,time:'24s' },
];


document.addEventListener('DOMContentLoaded',()=>{
  const token = localStorage.getItem("token");
  getTeacherData(token);
})

const getTeacherData = (token)=>{
  const url = `http://localhost:3000/teacher/getTeacher`;
  fetch(url,{
    headers:{
      'content-type':'application/json',
      'Authorization': `Bearer ${token}`
    },
    method:"POST",
  }).then(response=>response.json())
  .then(data=>{
    console.log("Data from adminpanel.js : ",data);
    if(data.success){
      loadData(data.exams);
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
  div.innerHTML = `<h3>${exam.details.exam_title}</h3>
              <h4>${exam.details.examStartDate} to ${exam.details.examEndDate}</h4>`
  div.addEventListener("click",()=>{
    console.log("clicked in : ",exam.examId);
  })
  upcommingTestsDiv.appendChild(div);
}

const addLiveAndFinished = (exam)=>{
  const liveAndFinishedTestsDiv = document.getElementById("liveAndFinishedTests");
  const div = document.createElement("div");
  div.className = "box";
  div.innerHTML = `<h3>${exam.details.exam_title}</h3>
              <h4>${exam.details.examStartDate} to ${exam.details.examEndDate}</h4>`
  div.addEventListener("click",()=>{
    console.log("clicked in : ",exam.examId);
  })
  liveAndFinishedTestsDiv.appendChild(div);
}

















// Reference to the leaderboard list
const leaderboardList = document.getElementById('leaderboard');

// Function to render the leaderboard
function renderLeaderboard(data) {
  // Clear existing items
  leaderboardList.innerHTML = '';

  // Iterate over the data and create list items
  data.forEach(player => {
    const listItem = document.createElement('li');
    listItem.classList.add('leaderboard-item');

    listItem.innerHTML = `
      <span class="rank">${player.rank}</span>
      <span class="name">${player.name}</span>
      <span class="score">${player.score}</span>
      <span class="time">${player.time}</span>
    `;

    // Append the item to the leaderboard list
    leaderboardList.appendChild(listItem);
  });
}

// Render the leaderboard on page load
renderLeaderboard(leaderboardData);


// Download the Leader board in csv format


document.getElementById('download-btn').addEventListener('click', () => {
  // Convert leaderboard data to CSV string
  const csvRows = [
    'Rank,Name,Score,Time', // Header row
    ...leaderboardData.map(player => `${player.rank},${player.name},${player.score},${player.time}`) // Data rows
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
  window.location.href = "createQuizPage.html";
})