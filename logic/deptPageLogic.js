const loadDepartments = (data)=>{
    let box = document.querySelector(".box");

    let departments = data['departments']
    // console.log("data is : ",departments);

    if(departments){
        for(let i=0;i<departments.length;i++){
            box.innerHTML += `<div class="department" onClick='openAllYearsPage()'>
                <img src="${departments[i]['image_url']}" alt="this">
                <p>${departments[i]['department_names']}</p>
            </div>`
        }
    }
}


document.addEventListener('DOMContentLoaded',()=>{
    const acadamicName =localStorage.getItem("acadamicName");
    let url = `http://localhost:3000/getDepartments?acadamicName=${acadamicName}`
    fetch(url).then(response=>response.json()).then(data=>{
        loadDepartments(data);
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


const openAllYearsPage = ()=>{
    console.log("CLicked....");
}
