// const { response } = require("express");

const loadAcadamicNames = (data)=>{
    let container = document.querySelector('#acadamicNameContainer');
    // console.log(container);
    // console.log(data);
    let names = data['acadamicName'];
    // console.log(names);
    for(let i=0;i<names.length;i++){
        container.innerHTML += `<li>${names[i]["acadamic_names"]}</li>`
    }
}


document.addEventListener("DOMContentLoaded",()=>{
    fetch("http://localhost:3000/getAcadamics").then(response=>response.json()).then(data=>{
        loadAcadamicNames(data);
    });
    
});

// Get the submit button
let button = document.querySelector(".submitBtn");

// add eventlistener to the button
button.addEventListener('click',()=>{
    const acadamicInp = document.getElementById("academicInp");
    const acadamicName = acadamicInp.value;
    console.log(acadamicName);

    fetch('http://localhost:3000/addAcadamics', {
        headers: {
            'Content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({ acadamicName: acadamicName })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        // console.log("response is running...",response);
        return response.json();
    })
    .then(data => {
        console.log("data is 12: ",data)
    })
    .catch(err => console.error('Error:', err));
    
});

function insertIntoTable(data){

}
