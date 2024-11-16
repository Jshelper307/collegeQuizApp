// import database logics from Database
const acadamic = require('../Database/acadamic');

// Get the button
let button = document.getElementsByClassName("submitBtn")[0];

// Add event listener in this button
button.addEventListener("click", ()=>{
    const academicname = document.getElementById("academicInp").value;
    console.log(academicname);
    acadamic.addAcadamics(academicname);
    academicname.value = "";
    console.log("clicked");
});


