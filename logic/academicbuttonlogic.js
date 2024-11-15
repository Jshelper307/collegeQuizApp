import acadamic from '../Database/acadamic';


let button = document.getElementsByClassName("submitBtn")[0]; 

let academicname = document.getElementsByClassName("input");

button.addEventListener("click", ()=>{
    console.log(academicname)
    console.log("clicked");
});
console.log(button);