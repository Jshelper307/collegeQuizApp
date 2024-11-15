// necessary imports
const mysql = require("mysql2");

// create connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Soham123@",
    database: "collegequiz",
  });

// Insert data into acadamic table
const addAcadamics = (acadamic_name)=>{
    try{
        let query = "INSERT INTO acadamics(acadamic_names) VALUES (?)";
        connection.execute(query,[acadamic_name],(error,res)=>{
            if(error){
                console.log("Error is : ",error);
            }
        })
    }
    catch(e){
        console.log(e);
    }
}

// Insert data into department table
const calculateShortName = (name = "") => {
    let words = name.split(" ");
    let shortName = "";
    words.forEach((word) => {
        shortName += word.charAt(0).toUpperCase();
    });
    return shortName;
};

const calculateAcadamicId = async (acadamic_name) => {
    let query = "SELECT acadamic_id FROM acadamics WHERE acadamic_names=?";
    
    // Use promise to handle asynchronous operation
    return new Promise((resolve, reject) => {
        connection.execute(query, [acadamic_name], (error, res) => {
            if (error) {
                console.log(error);
                reject(error);
            } else {
                console.log("Acadamic ID is: ", res[0].acadamic_id);
                resolve(res[0].acadamic_id);
            }
        });
    });
};

const addDepartment = async (department_name, acadamic) => {
    try {
        // Fetch the next department ID
        let departmentQuery = "SELECT COUNT(department_id) AS totalrow FROM departments";
        
        const department_id = await new Promise((resolve, reject) => {
            connection.execute(departmentQuery, (e, r) => {
                if (e) {
                    console.log(e);
                    reject(e);
                } else {
                    let newDepartmentId = "0" + (r[0].totalrow + 1) + calculateShortName(department_name);
                    console.log("Department ID is: ", newDepartmentId);
                    resolve(newDepartmentId);
                }
            });
        });

        // Fetch the acadamic ID
        const acadamic_id = await calculateAcadamicId(acadamic);
        console.log("Acadamic ID in addDepartment: ", acadamic_id);

        // Now insert into departments table
        let query = "INSERT INTO departments(department_id,department_names,acadamic_id) VALUES (?,?,?)";
        connection.execute(query, [department_id,department_name, acadamic_id], (error, res) => {
            if (error) {
                console.log("Error while inserting department: ", error);
            } else {
                console.log("Department added successfully!");
            }
        });

    } catch (error) {
        console.log("Error occurred: ", error);
    }
};

// Insert data into subject table
const calculateDepartmentId = (department_name)=>{
    let query = "SELECT department_id FROM departments WHERE department_names=?";
    
    // Use promise to handle asynchronous operation
    return new Promise((resolve, reject) => {
        try{
            connection.execute(query, [department_name], (error, res) => {
                if (error) {
                    console.log("This is the error : ",error);
                    reject(error);
                } 
                else if(res.length==0){
                    console.log("Data is not present");
                }
                else {
                    console.log("Acadamic ID is: ", res);
                    console.log("Acadamic ID is: ", res[0].department_id);
                    resolve(res[0].department_id);
                }
            });
        }
        catch(e){
            console.log(e);
        }
    });
}
const addSubject = async (subject_id,subject_name,department_name,year)=>{
    let department_id = await calculateDepartmentId(department_name);
    try{
        let query = "INSERT INTO subjects(subject_id,subject_names,department_id,year) VALUES (?,?,?,?)"
        connection.execute(query,[subject_id,subject_name,department_id,year],(error,res)=>{
            if(error){
                console.log(error);
            }
            else{
                console.log("Successfully added");
            }
        })
    }
    catch(e){
        console.log(e);
    }
}


// test
 addAcadamics("MBA");
// addDepartment("Computer Science and Engineering","B.Tech");
// addSubject("BS-PH102","Physics-II","Computer",1);
export {
    addAcadamics,
    addDepartment,
    addSubject,
    calculateAcadamicId,
    calculateDepartmentId,
    calculateShortName
};
