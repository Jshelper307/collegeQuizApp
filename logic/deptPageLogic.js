document.addEventListener('DOMContentLoaded',()=>{
    console.log(localStorage.getItem("acadamicName"))
    fetch('http://localhost:3000/getDepartments').then(response=>response.json()).then(data=>{
        console.log("data is : ",data);
    });
})





