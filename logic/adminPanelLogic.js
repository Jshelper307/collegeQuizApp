// Simulated Data
const leaderboardData = [
  { rank: 1, name: 'Chitra', score: 95 ,time: '30s'},
  { rank: 2, name: 'Joy', score: 90, time:'27s' },
  { rank: 3, name: 'Debayan', score: 85, time:'26s' },
  { rank: 4, name: 'soham', score: 80, time:'25s' },
  { rank: 5, name: 'Neha', score: 75,time:'24s' },
];

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

