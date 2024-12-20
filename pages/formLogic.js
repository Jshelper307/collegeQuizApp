// Get form elements and controls
const loginFormBtn = document.getElementById('loginFormBtn');
const signupFormBtn = document.getElementById('signupFormBtn');
const sliderTab = document.querySelector('.slider-tab');
const formInner = document.querySelector('.form-inner');

// Toggling between login and signup forms
loginFormBtn.addEventListener('change', () => {
    sliderTab.style.transform = 'translateX(0)';
    formInner.style.marginLeft = '0';
});

signupFormBtn.addEventListener('change', () => {
    sliderTab.style.transform = 'translateX(100%)';
    formInner.style.marginLeft = '-100%';
});

// Show/hide password for login
const toggleLoginPassword = document.getElementById('toggleLoginPassword');
const loginPassword = document.getElementById('loginPassword');

toggleLoginPassword.addEventListener('click', () => {
    if (loginPassword.type === 'password') {
        loginPassword.type = 'text';
        toggleLoginPassword.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        loginPassword.type = 'password';
        toggleLoginPassword.classList.replace('fa-eye-slash', 'fa-eye');
    }
});

// Show/hide password for signup
const toggleSignupPassword = document.getElementById('toggleSignupPassword');
const signupPassword = document.getElementById('signupPassword');

toggleSignupPassword.addEventListener('click', () => {
    if (signupPassword.type === 'password') {
        signupPassword.type = 'text';
        toggleSignupPassword.classList.replace('fa-eye', 'fa-eye-slash');
    } else {
        signupPassword.type = 'password';
        toggleSignupPassword.classList.replace('fa-eye-slash', 'fa-eye');
    }
});

// Signup button functionality
const signupBtn = document.getElementById('signupBtn');
signupBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('confirmPasswordInp').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match. Please try again.');
    } else {
        alert('Signup successful!'); // You can replace this with an API call or logic for handling signup.
    }
});

// Login button functionality
const loginBtn = document.getElementById('loginBtn');
loginBtn.addEventListener('click', (e) => {
    e.preventDefault();
    const username = document.getElementById('userNameInp').value;
    const password = loginPassword.value;

    // Add your login validation or API call logic here
    if (username && password) {
        alert(`Welcome, ${username}!`); // Placeholder for successful login
    } else {
        alert('Please enter both username and password.');
    }
});
