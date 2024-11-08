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
    toggleButton(true);
}

//button and inputtext box will be seen when the faculty is used
function toggleButton(value) {
    const button = document.getElementById('additem');
    const text = document.getElementById('inputnewitem');
    button.style.display = value ? 'block' : 'none';
    text.style.display = value ? 'block' : 'none';
  }
  
// when the window is loaded the load_all_years function is run automatically
window.onload = load_all_years;

