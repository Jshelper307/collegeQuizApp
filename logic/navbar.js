let loggedIn = false;
let nameOfUser = "";

document.addEventListener("DOMContentLoaded",()=>{
    const navbar = document.querySelector(".nav__container");
    const token = localStorage.getItem("token");
    // console.log("loggend in : ",loggedIn);
    // console.log(token);
    if (!token) {
      // window.location.href = 'login.html'; // Redirect if no token
      console.log("no token");
    } else if(!loggedIn){
      setUserName(token);
      loggedIn = true;
    }
    navbar.innerHTML = getNavbar(loggedIn);
    if(loggedIn){
      document.getElementById("userDetails").addEventListener("click",()=>{
        showMenu();
      })
    }

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
              <li><a href="./adminPanel.html">Admin Panel</a></li>
          </ul>
       </li>
        <li><a href="contact.html">Contact</a></li>
        <li id="userDetails">${loggedIn?`<img src="../icons/user.svg" alt="userImage" height="25">${nameOfUser}`:`<a href="./register.html">Login/Regester</a>`}
          <ul class="clickDrop dropdown-menu" style="display: none;">
              <li id="logout">Logout</li>
          </ul>
        </li>
      </ul>`
}

const setUserName =(token)=>{
  try {
      const decoded = jwt_decode(token);
      nameOfUser = decoded.fullName.split(" ")[0];
      // console.log(decoded);
  } catch (error) {
      console.log('Invalid token',error);
      localStorage.removeItem('token');
      loggedIn = false;
      window.location.href = 'register.html'; // Redirect on invalid token
  } 
}



const showMenu = ()=>{
  if(document.querySelector(".clickDrop").style.display === "block"){
    document.querySelector(".clickDrop").style.display = "none";
  }
  else{
    document.querySelector(".clickDrop").style.display = "block";
  }
}