

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
            if(data.success){
                console.log("Registration successful!");
            }
            else if(!data.success && !data.mailsend){
                console.log("We cant send mail to your mail address . Please check you mail or try again later");
            }
            else{
                console.log(data.error);
            }
        })
        .catch(err => console.error('Error:', err));

        
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
        console.log("data is : ",data);
        if(data.success){
            localStorage.setItem("token",data.token);
            window.open("../pages/index.html","_parent");
        }
        else{
            console.log(data.message);
        }
    })
    .catch(err => console.error('Error:', err));

    // console.log("Login successful!");
})