

const loginText = document.querySelector(".title-text .login");
const loginForm = document.querySelector("form.loginForm");
const loginFormBtn = document.querySelector(".loginFormBtn");
const signupFromBtn = document.querySelector(".signupFormBtn");
const signupLink = document.querySelector("form .signup-link a");

// console.log(loginText);
// console.log(loginFormBtn);
// console.log(loginBtn);
// console.log(signupFromBtn);
// console.log(signupLink);

signupFromBtn.onclick = () => {
    loginForm.style.marginLeft = "-50%";
    loginText.style.marginLeft = "-50%";
};

loginFormBtn.onclick = () => {
    loginForm.style.marginLeft = "0%";
    loginText.style.marginLeft = "0%";
};

signupLink.onclick = () => {
    signupFromBtn.click();
    return false;
};

const toggleLoginPassword = document.getElementById('toggleLoginPassword');
const loginPassword = document.getElementById('loginPassword');
toggleLoginPassword.addEventListener('click', () => {
    const type = loginPassword.type === 'password' ? 'text' : 'password';
    loginPassword.type = type;
    toggleLoginPassword.classList.toggle('fa-eye', type === 'password');
    toggleLoginPassword.classList.toggle('fa-eye-slash', type === 'text');
});

const toggleSignupPassword = document.getElementById('toggleSignupPassword');
const signupPassword = document.getElementById('signupPassword');
toggleSignupPassword.addEventListener('click', () => {
    const type = signupPassword.type === 'password' ? 'text' : 'password';
    signupPassword.type = type;
    toggleSignupPassword.classList.toggle('fa-eye', type === 'password');
    toggleSignupPassword.classList.toggle('fa-eye-slash', type === 'text');
});

// For registration
const signupBtn = document.getElementById("signupBtn");
const loginBtn = document.getElementById('loginBtn');
// console.log(signupBtn);

signupBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    const firstName = document.getElementById("firstNameInp").value;
    const lastName = document.getElementById("lastNameInp").value;
    const emailAddress = document.getElementById("emailAddressInp").value;
    const phone = document.getElementById("phoneInp").value;
    const collegeName = document.getElementById("collegeNameInp").value;
    const universityRollno = document.getElementById("universityRollnoInp").value;
    const signupPassword = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById("confirmPasswordInp").value;
    // console.log("First Name : ",firstName);
    // console.log("Last Name : ",lastName);
    // console.log("Email Address : ",emailAddress);
    // console.log("Phone : ",phone);
    // console.log("college Name : ",collegeName);
    // console.log("university Rollno : ",universityRollno);
    // console.log("signup Password : ",signupPassword);
    // console.log("confirm Password : ",confirmPassword);

    if (signupPassword === confirmPassword) {

        fetch('http://localhost:3000/auth/signup', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ firstName: firstName,lastName:lastName,emailAddress:emailAddress,phone:phone,collegeName:collegeName,universityRollno:universityRollno,password:signupPassword })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // console.log("response is running...",response);
            return response.json();
        })
        .then(data => {
            console.log("data is : ",data)
        })
        .catch(err => console.error('Error:', err));

        console.log("Registration successful!");
    } else {
        console.error("Registration failed due to mismatched passwords.");
    }
});



loginBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    const userName = document.getElementById('userNameInp').value;
    const password = document.getElementById("loginPassword").value;

    fetch('http://localhost:3000/auth/login', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({userName:userName,password:password})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // console.log("response is running...",response);
        return response.json();
    })
    .then(data => {
        console.log("data is : ",data)
    })
    .catch(err => console.error('Error:', err));

    // console.log("Login successful!");
})
/////////////////////////////
document.querySelector('.loginForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent form submission for validation
    
    let isValid = true;
    const inputs = document.querySelectorAll('.field input'); // Select all input fields inside .field
    
    inputs.forEach(input => {
        const errorMessage = input.nextElementSibling; // The next sibling is assumed to be the span for error messages

        // Check if the input value is empty
        if (input.value.trim() === '') {
            isValid = false;
            
            // Set the red border for the input
            input.style.borderColor = 'red';
            
            // Set the error message
            if (errorMessage) {
                errorMessage.textContent = 'This field is required.';
                errorMessage.style.display = 'block'; // Ensure the error message is visible
            }
        } else {
            // Reset the input border and error message if the field is not empty
            input.style.borderColor = '';
            if (errorMessage) {
                errorMessage.textContent = ''; // Clear the error message
                errorMessage.style.display = 'none'; // Hide the error message
            }
        }
    });

    // If the form is invalid, prevent submission and show feedback
    if (!isValid) {
        console.log("Please fill in all required fields.");
    } else {
        // Form is valid, you can proceed with form submission
        console.log("Form is valid! You can submit now.");
    }
});
