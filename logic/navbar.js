document.addEventListener("DOMContentLoaded",()=>{
    const navbar = document.querySelector(".nav__container");
    navbar.innerHTML = `<a href="index.html"><h4>QuizMania</h4></a>
     <ul  class="nav__menue">
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li class="dropdown">
          Academic
          <ul class="dropdown-menu">
              <li><a href="./academic.html">Question Practice</a></li>
              <li><a href="./Teacharpage.html">Create Test</a></li>
          </ul>
       </li>
        <li><a href="contact.html">Contact</a></li>
        <li id="userDetails"><a href="./register.html">Login/Regester</a></li>
      </ul>`
})