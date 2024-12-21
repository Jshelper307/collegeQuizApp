

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
    const firstName = document.getElementById("firstNameInp");
    const lastName = document.getElementById("lastNameInp");
    const emailAddress = document.getElementById("emailAddressInp");
    const phone = document.getElementById("phoneInp");
    const collegeName = document.getElementById("collegeNameInp");
    const universityRollno = document.getElementById("universityRollnoInp");
    const signupPassword = document.getElementById("signupPassword");
    const confirmPassword = document.getElementById("confirmPasswordInp");
    // console.log("First Name : ",firstName);
    // console.log("Last Name : ",lastName);
    // console.log("Email Address : ",emailAddress);
    // console.log("Phone : ",phone);
    // console.log("college Name : ",collegeName);
    // console.log("university Rollno : ",universityRollno);
    // console.log("signup Password : ",signupPassword);
    // console.log("confirm Password : ",confirmPassword);

    if(isValidForm([firstName,lastName,emailAddress,phone,collegeName,universityRollno,signupPassword,confirmPassword])){
        if (signupPassword.value === confirmPassword.value) {

            fetch('http://localhost:3000/auth/signup', {
                headers: {
                    'Content-type': 'application/json'
                },
                method: 'POST',
                body: JSON.stringify({ firstName: firstName.value,lastName:lastName.value,emailAddress:emailAddress.value,phone:phone.value,collegeName:collegeName.value,universityRollno:universityRollno.value,password:signupPassword.value })
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                // console.log("response is running...",response);
                return response.json();
            })
            .then(data => {
                // console.log("data is : ",data)
                if(data.success){
                    // console.log("Registration successful!");
                    new Notification({
                        text: 'Registration successful!',
                        position: 'top-center',
                        style: {
                        background: '#222',
                        color: '#fff',
                        transition: 'all 350ms linear',
                        // more CSS styles here
                        },
                        autoClose: 5000,
                    });
                    clearForm([firstName,lastName,emailAddress,phone,collegeName,universityRollno,signupPassword,confirmPassword]);
                }
                else if(!data.success && !data.mailsend){
                    new Notification({
                        text: 'We cant send mail to your mail address . Please check you mail or try again later',
                        position: 'top-center',
                        style: {
                        background: '#222',
                        color: '#fff',
                        transition: 'all 350ms linear',
                        // more CSS styles here
                        },
                        autoClose: 5000,
                    });
                    // console.log("We cant send mail to your mail address . Please check you mail or try again later");
                }
                else{
                    new Notification({
                        text: data.error,
                        position: 'top-center',
                        style: {
                        background: '#222',
                        color: '#fff',
                        transition: 'all 350ms linear',
                        // more CSS styles here
                        },
                        autoClose: 5000,
                    });
                    console.log(data.error);
                }
            })
            .catch(err => console.error('Error:', err));

        } else {
            // console.error("Registration failed due to mismatched passwords.");
            new Notification({
                text: "Password and confirmpassword must be same .",
                position: 'top-center',
                style: {
                background: '#222',
                color: '#fff',
                transition: 'all 350ms linear',
                // more CSS styles here
                },
                autoClose: 5000,
            });
        }
    }
});


loginBtn.addEventListener("click",(e)=>{
    e.preventDefault();
    const userName = document.getElementById('userNameInp');
    const password = document.getElementById("loginPassword");

    if(isValidForm([userName,password])){
        fetch('http://localhost:3000/auth/login', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({userName:userName.value,password:password.value})
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // console.log("response is running...",response);
            return response.json();
        })
        .then(data => {
            // console.log("data is : ",data);
            if(data.success){
                localStorage.setItem("token",data.token);
                window.open("../pages/index.html","_parent");
            }
            else{
                new Notification({
                    text: data.message,
                    style: {
                      background: '#222',
                      color: '#fff',
                      transition: 'all 350ms linear',
                      // more CSS styles here
                    },
                    autoClose: 3000,
                  });
                console.log(data.message);
            }
        })
        .catch(err => console.error('Error:', err));
    }
    // console.log("Login successful!");
})

const isValidForm=(formFields)=>{
    for(let i=0;i<formFields.length;i++){
        if(formFields[i].value === ""){
            formFields[i].style.border = "2px solid red";
            return false;
        }
        else if(formFields[i].style.border){
            formFields[i].style.border = "none";
        }
    }
    return true;
}

const clearForm = (formFields)=>{
    for(let i=0;i<formFields.length;i++){
        formFields[i].value = "";
    }
    // console.log("complete clearing form");
}