const questions = {
    "Topic 1": {
        question: "What is an operating system (OS)?",
        options: ["Hardware that supports applications", "Software that manages hardware", "A type of storage device", "Network protocol"],
        correctAnswer: 1 // Correct option is "Software that manages hardware"
    },
    "Topic 2": {
        question: "Which of the following is a primary function of an OS?",
        options: ["Data backup", "Web browsing", "Memory management", "Social media integration"],
        correctAnswer: 2 // Correct option is "Memory management"
    },
    "Topic 3": {
        question: "Which of these is a type of operating system?",
        options: ["Batch OS", "Fiber OS", "Widget OS", "None of the above"],
        correctAnswer: 0 // Correct option is "Batch OS"
    },
    "Topic 4": {
        question: "What is the first step in the process lifecycle?",
        options: ["Blocked", "Terminated", "Running", "New"],
        correctAnswer: 3 // Correct option is "New"
    },
    "Topic 5": {
        question: "Which scheduling algorithm is also known as shortest job first (SJF)?",
        options: ["Round Robin", "Preemptive SJF", "First Come First Serve", "Priority Scheduling"],
        correctAnswer: 1 // Correct option is "Preemptive SJF"
    },
    "Topic 6": {
        question: "Which of the following is not a condition necessary for deadlock?",
        options: ["Mutual exclusion", "Circular wait", "Preemption", "Starvation"],
        correctAnswer: 3 // Correct option is "Starvation"
    }
};

let currentUnit = "";
let currentTopic = "";
let answered = false;

function toggleMobileMenu() {
    const mobileMenu = document.getElementById("mobile-menu");
    mobileMenu.style.display = mobileMenu.style.display === "block" ? "none" : "block";
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

function loadQuestion(unit, topic) {
    currentUnit = unit;
    currentTopic = topic;
    answered = false;

    const topicTitle = document.getElementById("topic-title");
    const questionText = document.getElementById("question-text");
    const optionsDiv = document.getElementById("options");
    const nextButton = document.getElementById("next-btn");

    const questionData = questions[topic];

    // Update UI with question details
    topicTitle.textContent = topic;
    questionText.textContent = questionData.question;
    optionsDiv.innerHTML = "";

    // Create radio buttons for each option
    questionData.options.forEach((option, index) => {
        const optionLabel = document.createElement("label");
        optionLabel.innerHTML = `<input type="radio" name="q1" value="${index}"> ${option}`;
        optionsDiv.appendChild(optionLabel);
    });

    nextButton.style.display = "block";
}

function submitAnswer() {
    const feedback = document.getElementById("feedback");

    // Prevent multiple submissions
    if (answered) {
        feedback.textContent = "You have already selected an answer!";
        feedback.style.color = "orange";
        return;
    }

    // Check if an option is selected
    const selectedOption = document.querySelector('input[name="q1"]:checked');
    if (!selectedOption) {
        feedback.textContent = "Please select an option!";
        feedback.style.color = "red";
        return;
    }

    // Check if answer is correct
    const answer = parseInt(selectedOption.value, 10);
    const correctAnswer = questions[currentTopic].correctAnswer;

    if (answer === correctAnswer) {
        feedback.textContent = "Correct Answer!";
        feedback.style.color = "green";
    } else {
        feedback.textContent = `Incorrect Answer. The correct answer is: ${questions[currentTopic].options[correctAnswer]}`;
        feedback.style.color = "red";
    }

    // Mark the question as answered and disable options
    answered = true;
    document.querySelectorAll('input[name="q1"]').forEach(input => {
        input.disabled = true;
    });

    // Clear feedback after 3 seconds
    setTimeout(() => {
        feedback.textContent = "";
    }, 3000);
}


