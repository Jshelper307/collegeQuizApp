// the data of the subjects load from surver
var first_year_subjects = [];
var second_year_subjects = [];
var third_year_subjects = [];
var fourth_year_subjects = [];


// Functions for load the subjects 
function load_first_year_subjects(first_year_subjects){
    var years = document.getElementById('firstyear_subjectHolder');
    if(first_year_subjects.length>0){
        for(var i=0;i<first_year_subjects.length;i++){
            const div = document.createElement("div");
            div.className = "subject";
            div.innerHTML = `<p>"${first_year_subjects[i]}"</p>`
            div.addEventListener("click",openSubjectQuiz);
            years.appendChild(div);
        }
        
    }
}
function load_second_year_subjects(second_year_subjects){
    var years = document.getElementById('secondyear_subjectHolder');
    if(second_year_subjects.length>0){
        for(var i=0;i<second_year_subjects.length;i++){
            const div = document.createElement("div");
            div.className = "subject";
            div.innerHTML = `<p>"${second_year_subjects[i]}"</p>`
            div.addEventListener("click",openSubjectQuiz);
            years.appendChild(div);
        }
    }
}
function load_third_year_subjects(third_year_subjects){
    var years = document.getElementById('thirdyear_subjectHolder');
    if(third_year_subjects.length>0){
        for(var i=0;i<third_year_subjects.length;i++){
            const div = document.createElement("div");
            div.className = "subject";
            div.innerHTML = `<p>"${third_year_subjects[i]}"</p>`
            div.addEventListener("click",openSubjectQuiz);
            years.appendChild(div);
        }
    }
}
function load_forth_year_subjects(fourth_year_subjects){
    var years = document.getElementById('fourthyear_subjectHolder');
    if(fourth_year_subjects.length>0){
        for(var i=0;i<fourth_year_subjects.length;i++){
            const div = document.createElement("div");
            div.className = "subject";
            div.innerHTML = `<p>"${fourth_year_subjects[i]}"</p>`
            div.addEventListener("click",openSubjectQuiz);
            years.appendChild(div);
        }
    }
}

// Function for load all year subjects at once
function load_all_years(first_year_subjects,second_year_subjects,third_year_subjects,fourth_year_subjects){
    load_first_year_subjects(first_year_subjects);
    load_second_year_subjects(second_year_subjects);
    load_third_year_subjects(third_year_subjects);
    load_forth_year_subjects(fourth_year_subjects);
}

const noSubjects = (id)=>{
    var years = document.getElementById(id);
    years.innerHTML = "<p class='noSubject'>............. No Subjects to Show .............</p>"
}

const openSubjectQuiz = (subject)=>{
    let subjectWithId = (subject.target.innerHTML).split("(")[0];
    console.log("clicked .....");
    subjectWithId = subjectWithId.replace("\"","");
    if(subjectWithId.includes("&")){
        subjectWithId = subjectWithId.replace("&amp;","&");
    }
    console.log(subjectWithId);
}

// code start here
document.addEventListener("DOMContentLoaded",()=>{
    const departmentName =localStorage.getItem("departmentName");
    const acadamicName =localStorage.getItem("acadamicName");
    // console.log(departmentName);
    // let url =`http://localhost:3000/getSubjects?departmentName=${departmentName}`
    let url =`http://localhost:3000/getAcadamics/${acadamicName}/getDepartments/${departmentName}/getSubjects`
    fetch(url).then(response=>response.json()).then(data=>{
        console.log(data);
        if(data['subjects'].length > 0){
            data['subjects'].map(item=>{
                if(item['year']==1){
                    first_year_subjects.push(`${item['subject_names']} (${item['subject_id']})`)
                }
                if(item['year']==2){
                    second_year_subjects.push(`${item['subject_names']} (${item['subject_id']})`)
                }
                if(item['year']==3){
                    third_year_subjects.push(`${item['subject_names']} (${item['subject_id']})`)
                }
                if(item['year']==4){
                    fourth_year_subjects.push(`${item['subject_names']} (${item['subject_id']})`)
                }
            })
            if(first_year_subjects.length == 0){
                noSubjects("firstyear_subjectHolder");
            }
            if(second_year_subjects.length==0){
                noSubjects('secondyear_subjectHolder');
            }
            if(third_year_subjects.length == 0){
                noSubjects('thirdyear_subjectHolder');
            }
            if(fourth_year_subjects.length==0){
                noSubjects('fourthyear_subjectHolder');
            }
             // load all year subjects in the page
            load_all_years(first_year_subjects,second_year_subjects,third_year_subjects,fourth_year_subjects);
        }
        else{
            noSubjects("firstyear_subjectHolder");
            noSubjects('secondyear_subjectHolder');
            noSubjects('thirdyear_subjectHolder');
            noSubjects('fourthyear_subjectHolder');
        }

       
    });
})

const btn = document.querySelector('.submitBtn');

btn.addEventListener('click',()=>{
    const subjectCode = document.getElementById('subjectCodeInp').value;
    const subjectName = document.getElementById('subjectInp').value;
    const year = document.getElementById('yearInp').value;
    const department_name = localStorage.getItem('departmentName');
    // console.log("Button Clicked...");
    // console.log("Subject Code : ",subjectCode);
    // console.log("Subject Name : ",subjectName);
    // console.log("Year : ",year);
    // console.log("department_name : ",department_name);

    if(subjectCode.length >5 && subjectName.length>=3 && year.length>0){
        fetch('http://localhost:3000/addSubjects',{
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ subjectCode: subjectCode,subjectName:subjectName,year:year,department_name:department_name })
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
            document.getElementById('subjectCodeInp').value = "";
            document.getElementById('subjectInp').value = "";
            document.getElementById('yearInp').value = false;
        })
        .catch(err => console.error('Error:', err));
    }
    else{
        alert("Please Enter correct imageUrl and Department Name!!!");
    }
})