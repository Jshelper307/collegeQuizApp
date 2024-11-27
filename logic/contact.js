// // Contact Form Submission
document.getElementById('contactForm').addEventListener('submit', function (event) {
  event.preventDefault(); // Prevents the default form submission

  alert('Thank you for reaching out! We will get back to you soon.');

  // Use a short delay before submitting the form
  setTimeout(() => {
      // Manually submit the form
      this.submit();

      // Clear form fields after submission
      this.reset();
  }, 500); // Delay of 500ms
});
