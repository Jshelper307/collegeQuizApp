// Script to handle interactivity
document.querySelector('.done').addEventListener('click', () => {
    alert('Test saved successfully!');
  });
  
  document.querySelector('.delete').addEventListener('click', () => {
    if (confirm('Are you sure you want to delete this question?')) {
      alert('Question deleted!');
    }
  });

let totalQuestions = 0;
let questions = [];

// Function to add question and update the recent question display
function addQuestion() {
  // Get input values
  const questionText = document.getElementById('question').value;
  const option1 = document.getElementById('option1').value;
  const option2 = document.getElementById('option2').value;
  const option3 = document.getElementById('option3').value;
  const option4 = document.getElementById('option4').value;
  
  const correct1 = document.getElementById('correct1');
  const correct2 = document.getElementById('correct2');
  const correct3 = document.getElementById('correct3');
  const correct4 = document.getElementById('correct4');

  correct1.value = option1;
  correct2.value = option2;
  correct3.value = option3;
  correct4.value = option4;

  const correctOption = document.getElementsByName("correctOption");

  for(let i=0;i<correctOption.length;i++){
    if(correctOption[i].checked){
      questions.push({
        question : questionText,
        options : [option1,option2,option3,option4],
        answer: correctOption[i].value
      })
    }
  }
  console.log(questions);
  // Show the preview questions
  showPreviewQuestion(questions);
  // Update the total added questions
  totalQuestions++;
  document.getElementById('total-questions').textContent = totalQuestions;

  // Clear the input fields for the next question
  document.getElementById('question').value = '';
  document.getElementById('option1').value = '';
  document.getElementById('option2').value = '';
  document.getElementById('option3').value = '';
  document.getElementById('option4').value = '';
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

  editBtn.addEventListener("click",(e)=>{
    console.log(e);
  })
}

const showPreviewQuestion = (questions)=>{

  const preview_area = document.getElementById('recent-questions');
  preview_area.innerHTML = "";
  questions.map(question=>{
    return preview_area.innerHTML += `
    <div class='question-container'>
      <p><strong>Question :</strong> ${question['question']}</p>
      <p ${question['answer']===question['options'][0] && "class='green'"}'>Option 1: ${question['options'][0]}</p>
      <p ${question['answer']===question['options'][1] && "class='green'"}'>Option 2: ${question['options'][1]}</p>
      <p ${question['answer']===question['options'][2] && "class='green'"}'>Option 3: ${question['options'][2]}</p>
      <p ${question['answer']===question['options'][3] && "class='green'"}'>Option 4: ${question['options'][3]}</p>
      <div class="button-Holder">
        <button class="editBtn"><img src="../icons/icons8-edit.svg" alt="edit" height="20"></button>
        <button class="deleteBtn"><img src="../icons/icons8-delete.svg" alt="delete" height="20"></button>
      </div>
    </div>
  `;
  })
}

document.querySelector(".add-more").addEventListener("click",()=>{
  addQuestion();
})


