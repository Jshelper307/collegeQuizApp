let loggedIn = false;
let nameOfUser = "";
let isTeacher = false;

document.addEventListener("DOMContentLoaded",()=>{
    const navbar = document.querySelector(".nav__container");
    const token = localStorage.getItem("token");
    // console.log("loggend in : ",loggedIn);
    // console.log(token);
    if (!token) {
      // window.location.href = 'login.html'; // Redirect if no token
      console.log("no token");
    } else if(!loggedIn){
      const isSet=setUserName(token);
      isSet?loggedIn = true:loggedIn=false;
    }
    navbar.innerHTML = getNavbar(loggedIn);
    document.getElementById("logout").addEventListener("click",()=>{
      localStorage.removeItem("token");
      loggedIn = false;
      navbar.innerHTML = getNavbar(loggedIn);
      window.location.reload();
    })
      
})

const getNavbar = (loggedIn)=>{
  return `<a href="index.html"><h4>QuizMania</h4></a>
     <ul  class="nav__menue">
        <li><a href="index.html">Home</a></li>
        <li><a href="about.html">About</a></li>
        <li class="dropdown">
          Academic
          <ul class="dropdown-menu">
              <li><a href="./academic.html">Question Practice</a></li>
              <li>${isTeacher?`<a href="./adminPanel.html">Admin Panel</a>`:`<p>Admin Panel</p>`}</li>
          </ul>
       </li>
        <li><a href="contact.html">Contact</a></li>
        <li ${loggedIn?`id="userDetails"`:""}>${loggedIn?`<img src="../icons/user.svg" alt="userImage" height="25">${nameOfUser}`:`<a href="./register.html">Login/Regester</a>`}
          <ul class="dropdown-menu">
              <li id="logout"><img src="../icons/logout.svg" alt="logoutLogo" height="25">Logout</li>
          </ul>
        </li>
      </ul>`
}

const setUserName =(token)=>{
  try {
      const decoded = jwt_decode(token);
      nameOfUser = decoded.fullName.split(" ")[0];
      isTeacher = decoded.isTeacher;
      return true;
      // console.log(decoded);
  } catch (error) {
      console.log('Invalid token',error);
      localStorage.removeItem('token');
      loggedIn = false;
      window.location.href = 'register.html'; // Redirect on invalid token
  } 
}
