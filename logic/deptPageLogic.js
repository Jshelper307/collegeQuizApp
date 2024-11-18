document.addEventListener('DOMContentLoaded',()=>{
    fetch('http://localhost:3000/getDepartments').then(response=>response.json()).then(data=>{
        console.log("data is : ",data);
    });
})


const submitBtn = document.querySelector(".submitBtn");

submitBtn.addEventListener("click",()=>{
    const departmentName = document.querySelector("#departmentName").value;
    const imageUrl = document.querySelector("#imageUrl").value;
    const acadamicName =localStorage.getItem("acadamicName");
    console.log("departmentName : ",departmentName);
    console.log("imageUrl : ",imageUrl);

    if(imageUrl.length >5 && departmentName.length>=3){
        fetch('http://localhost:3000/addDepartments',{
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ departmentName: departmentName,imageUrl:imageUrl,acadamicName:acadamicName })
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            // console.log("response is running...",response);
            return response.json();
        })
        .then(data => {
            console.log("data is : ",data)
        })
        .catch(err => console.error('Error:', err));
    }
    else{
        alert("Please Enter correct imageUrl and Department Name!!!");
    }
})



