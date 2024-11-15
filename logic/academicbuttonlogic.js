const {addAcadamics} = require('../Database/acadamic.js');


let button = document.getElementsByClassName("submitBtn")[0]; 

let academicname = document.querySelector(".input").value;

button.addEventListener("click", ()=>{
    console.log(academicname)
    console.log("clicked");
});
console.log(button);