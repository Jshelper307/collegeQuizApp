document.getElementById('registrationForm').addEventListener('submit', function (event) {
  event.preventDefault();

  let isValid = true;

  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const department = document.getElementById('department').value.trim();
  const contact = document.getElementById('contact').value.trim();
  const password = document.getElementById('password').value.trim();
  const confirmPassword = document.getElementById('confirm-password').value.trim();

  document.querySelectorAll('.error-message').forEach(el => el.textContent = '');
  document.querySelectorAll('input, select').forEach(el => el.style.borderColor = '');

// Form validation
document.getElementById('registrationForm').addEventListener('submit', function(event) {
  
  let isValid = true;
  const inputs = document.querySelectorAll('.form-group input');
  inputs.forEach(input => {
    const errorMessage = input.nextElementSibling;
    if (input.value.trim() === '') {
      isValid = false;
      input.style.borderColor = 'red';
      errorMessage.textContent = 'Please fill this field.';
      errorMessage.style.color = 'red';
    } else {
      input.style.borderColor = '';
      errorMessage.textContent = '';
    }
  });
  // Validate Name
  const nameInput = document.getElementById('name');
  const nameError = nameInput.nextElementSibling;
  const nameValue = nameInput.value.trim();
  const validNameRegex = /^[a-zA-Z\s'-]+$/;

  if (nameValue === '') {
    isValid = false;
    nameError.textContent = 'Full Name is required.';
    nameInput.style.borderColor = 'red';
  } else if (!validNameRegex.test(nameValue)) {
    isValid = false;
    nameError.textContent = 'Full Name must not contain numbers or invalid special characters.';
    nameInput.style.borderColor = 'red';
  } else {
    nameError.textContent = '';
    nameInput.style.borderColor = '';
  }

  // Validate Contact
  const contactInput = document.getElementById('contact');
  const contactError = contactInput.nextElementSibling;
  const contactValue = contactInput.value.trim();
  const validContactRegex = /^[0-9]{10}$/;

  if (contactValue === '') {
    isValid = false;
    contactError.textContent = 'Contact number is required.';
    contactInput.style.borderColor = 'red';
  } else if (!validContactRegex.test(contactValue)) {
    isValid = false;
    contactError.textContent = 'Contact number must be exactly 10 digits with no alphabets or special characters.';
    contactInput.style.borderColor = 'red';
  } else {
    contactError.textContent = '';
    contactInput.style.borderColor = '';
  }

// Validate Department Dropdown
const departmentSelect = document.getElementById('department');
const departmentError = departmentSelect.nextElementSibling;
const departmentValue = departmentSelect.value;

if (departmentValue === 'Select the Department') { // Default option value
  isValid = false;
  departmentError.textContent = 'Please select a valid department.';
  departmentSelect.classList.add('error'); // Add the error class
} else {
  departmentError.textContent = '';
  departmentSelect.classList.remove('error'); // Remove the error class
}
  // Prevent form submission if validation fails
  if (!isValid) {
    event.preventDefault();
  }
});
      
// Toggle Password Visibility
function togglePassword(id) {
  const input = document.getElementById(id);
  const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
  input.setAttribute('type', type);
}

  fetch('http://localhost:3000/auth/teacher/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, department, contact, password }),
  })
      .then(response => {
          if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
          return response.json();
      })
      .then(data => {
          alert(data.message);
          document.getElementById('registrationForm').reset();
      })
      .catch(error => {
          console.error('Error:', error);
          alert('An error occurred during registration. Please try again.');
      });
});

function showError(id, message) {
  const input = document.getElementById(id);
  const error = input.nextElementSibling;
  input.style.borderColor = 'red';
  error.textContent = message;
  error.style.color = 'red';
}

function togglePassword(id) {
  const input = document.getElementById(id);
  const type = input.getAttribute('type') === 'password' ? 'text' : 'password';
  input.setAttribute('type', type);
}