// Function to clear all error messages and styles
function clearErrors() {
  document.querySelectorAll(".error-message").forEach((el) => (el.textContent = ""));
  document.querySelectorAll("input, select").forEach((el) => (el.style.borderColor = ""));
}

// Function to show error messages
function showError(inputId, message) {
  const input = document.getElementById(inputId);
  const error = input.parentElement.querySelector(".error-message");
  input.style.borderColor = "red";
  error.textContent = message;
  error.style.color = "red";
}

// Function to validate inputs
function validateInputs() {
  let isValid = true;

  const inputs = [
    { id: "name", message: "Full Name is required.", regex: /^[a-zA-Z\s'-]+$/, invalidMessage: "Full Name must not contain numbers or invalid special characters." },
    { id: "contact", message: "Contact number is required.", regex: /^[0-9]{10}$/, invalidMessage: "Contact number must be exactly 10 digits." },
    { id: "email", message: "Email is required." },
    { id: "password", message: "Password is required." },
    { id: "confirm-password", message: "Confirm Password is required." },
  ];

  inputs.forEach(({ id, message, regex, invalidMessage }) => {
    const value = document.getElementById(id).value.trim();
    if (!value) {
      isValid = false;
      showError(id, message);
    } else if (regex && !regex.test(value)) {
      isValid = false;
      showError(id, invalidMessage);
    }
  });

  const departmentSelect = document.getElementById("department");
  if (departmentSelect.value === "Select the Department") {
    isValid = false;
    showError("department", "Please select a valid department.");
  }

  return isValid;
}

// Function to handle form submission
async function submitForm(data) {
  try {
    const response = await fetch("http://localhost:3000/auth/teacher/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    // if(!response.ok){
    //   throw new Error(`HTTP error! status: ${response.status}`);
    // }
    const result = await response.json();

    // console.log(result);
    // console.log("Data from teacher Registration:", result);
    return result;
  } catch (error) {
    console.error("Error Message :", error.message);
    return error;
  }
}

// Add event listener to the form
const registrationForm = document.getElementById("registrationForm");
registrationForm.addEventListener("submit",async (event) => {
  event.preventDefault();

  clearErrors();

  if (validateInputs()) {
    const data = {
      name: document.getElementById("name").value.trim(),
      email: document.getElementById("email").value.trim(),
      department: document.getElementById("department").value.trim(),
      contact: document.getElementById("contact").value.trim(),
      password: document.getElementById("password").value.trim(),
    };
    const confirmPassword = document.getElementById("confirm-password").value.trim();
    if(data.password === confirmPassword){
      const result = await submitForm(data);
      if(result.success){
        document.getElementById("registrationForm").reset();
        // console.log(result.message);
        new Notification({
          text: result.message,
          style: {
            background: '#222',
            color: '#fff',
            transition: 'all 350ms linear',
            // more CSS styles here
          },
          autoClose: 5000,
        });
        new Notification({
          text: "UserName and Password is send to your Email . Please check your email and login through it ..",
          style: {
            background: '#222',
            color: '#fff',
            transition: 'all 350ms linear',
            // more CSS styles here
          },
          autoClose: 5000,
        });
      }
      else if(!result.success && result.message==="Already have an account"){
        // console.log("Failed to send email. Please check your email address or try again later.")
        new Notification({
          text: "Already have an account",
          style: {
            background: '#222',
            color: '#fff',
            transition: 'all 350ms linear',
            // more CSS styles here
          },
          autoClose: 5000,
        });
      }
      else if(!result.success && !result.mailSend){
        // console.log("Failed to send email. Please check your email address or try again later.")
        new Notification({
          text: "Failed to send email. Please check your email address or try again later.",
          style: {
            background: '#222',
            color: '#fff',
            transition: 'all 350ms linear',
            // more CSS styles here
          },
          autoClose: 5000,
        });
      }
      else{
        console.log(result);
        new Notification({
          text: result.message,
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
    else{
      // console.log("Password and confirm passsword must be same .");
      new Notification({
        text: "Password and confirm passsword must be same .",
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

// Function to toggle password visibility
function togglePassword(id) {
  const input = document.getElementById(id);
  const type = input.type === "password" ? "text" : "password";
  input.type = type;
}
