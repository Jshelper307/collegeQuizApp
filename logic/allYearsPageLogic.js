// the data of the subjects load from surver
var first_year_subjects = ["Physics-I (BS-PH101)","Chemistry-I (BS-CH101)","Matematics-I A (BS-M101)","Basic Electrical Engineering (ES-EE101)","Physics-I (BS-PH201)","Chemistry-I (BS-CH201)","Matematics-II A (BS-M201)","Programming for problem solving (ES-CS201)","English (HM-HU201)"];
var second_year_subjects = ["Analog & Digital Electronics (ESC-301)","Data Structure & Algorithm (PCC-CS301)","Computer Organization (PCC-CS302)","Matematics-III(Differential Calculus) (BSC-301)","Economics for Engineers (Humanities-II) (HSMC-301)","Discrete Mathematics (PCC-CS 401)","Computer Architecture (PCC-CS 402)","Formal Language & Automata Theory (PCC-CS 403)","Design and Analysis of Algorithms (PCC-CS 404)","Biology (BSC 401)","Environmental Science (MC-401)"];
var third_year_subjects = ["Software Engineering (ESC-501)","Chemistry-I (BS-CH101)","Matematics-I A (BS-M101)","Basic Electrical Engineering (ES-EE101)","Physics-I (BS-PH201)","Chemistry-I (BS-CH201)","Matematics-II A (BS-M201)","Programming for problem solving (ES-CS201)","English (HM-HU201)"];
var fourth_year_subjects = ["Physics-I (BS-PH101)","Chemistry-I (BS-CH101)","Matematics-I A (BS-M101)","Basic Electrical Engineering (ES-EE101)","Physics-I (BS-PH201)","Chemistry-I (BS-CH201)","Matematics-II A (BS-M201)","Programming for problem solving (ES-CS201)","English (HM-HU201)"];


// Functions for load the subjects 
function load_first_year_subjects(){
    var first_subject_chip = "";

    for(var i=0;i<first_year_subjects.length;i++){
        first_subject_chip+= "<div class=\"subject\"><p>"+first_year_subjects[i]+"</p></div>"
    }
    var years = document.getElementById('firstyear_subjectHolder');
    years.innerHTML = first_subject_chip;
}
function load_second_year_subjects(){
    var second_subject_chip = "";

    for(var i=0;i<second_year_subjects.length;i++){
        second_subject_chip+= "<div class=\"subject\"><p>"+second_year_subjects[i]+"</p></div>"
    }
    var years = document.getElementById('secondyear_subjectHolder');
    years.innerHTML = second_subject_chip;
}
function load_third_year_subjects(){
    var third_subject_chip = "";

    for(var i=0;i<third_year_subjects.length;i++){
        third_subject_chip+= "<div class=\"subject\"><p>"+third_year_subjects[i]+"</p></div>"
    }
    var years = document.getElementById('thirdyear_subjectHolder');
    years.innerHTML = third_subject_chip;
}
function load_forth_year_subjects(){
    var fourth_subject_chip = "";

    for(var i=0;i<fourth_year_subjects.length;i++){
        fourth_subject_chip+= "<div class=\"subject\"><p>"+fourth_year_subjects[i]+"</p></div>"
    }
    var years = document.getElementById('fourthyear_subjectHolder');
    years.innerHTML = fourth_subject_chip;
}

// Function for load all year subjects at once
function load_all_years(){
    load_first_year_subjects();
    load_second_year_subjects();
    load_third_year_subjects();
    load_forth_year_subjects();
}

// when the window is loaded the load_all_years function is run automatically
window.onload = load_all_years;



// code start here
document.addEventListener("DOMContentLoaded",()=>{
    const departmentName =localStorage.getItem("departmentName");
    console.log(departmentName);
    let url =`http://localhost:3000/getSubjects?departmentName=${departmentName}`
    fetch(url).then(response=>response.json()).then(data=>{
        console.log(data);
    });
})

const btn = document.querySelector('.submitBtn');

btn.addEventListener('click',()=>{
    const subjectCode = document.getElementById('subjectCodeInp').value;
    const subjectName = document.getElementById('subjectInp').value;
    const year = document.getElementById('yearInp').value;
    const department_name = localStorage.getItem('departmentName');
    console.log("Button Clicked...");
    console.log("Subject Code : ",subjectCode);
    console.log("Subject Name : ",subjectName);
    console.log("Year : ",year);

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
        })
        .catch(err => console.error('Error:', err));
    }
    else{
        alert("Please Enter correct imageUrl and Department Name!!!");
    }
})