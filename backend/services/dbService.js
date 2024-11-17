const mysql = require('mysql2');
let instance = null;

// create connection
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database: "collegequiz",
});

connection.connect((error)=>{
    if(error){
        console.log(error.message);
    }
    console.log("db is connected..");
})

class DbService{
    static getDbServiceInstance(){
        return instance ? instance : new DbService();
    }

    // Get data from acadamic table
    async getAcadamics(){
        try{
            const response = await new Promise((resolve,reject)=>{
                const query = "SELECT * FROM acadamics;";
                connection.query(query,(error,result)=>{
                    if(error){
                        reject(new Error(error.message));
                    }
                    resolve(result);
                })
            })

            // console.log(response);
            return response;
        }
        catch(error){
            console.log(error);
        }
    }

    // Insert data into acadamic table
    async addAcadamics(acadamic_name){
        try{
            const response = await new Promise((resolve,reject)=>{
                let query = "INSERT INTO acadamics(acadamic_names) VALUES (?)";
                connection.execute(query,[acadamic_name],(error,result)=>{
                    if(error){
                        reject(new Error(error.message));
                    }
                    resolve(result);
                })

            })
            return response;
        }
        catch(e){
            console.log(e);
        }
    }

    // get data from departments table
    async getDepartments(){
        try{
            const response = await new Promise((resolve,reject)=>{
                const query = "SELECT * FROM departments;";
                connection.query(query,(error,result)=>{
                    if(error){
                        reject(new Error(error.message));
                    }
                    resolve(result);
                })
            })

            console.log(response);
            return response;
        }
        catch(error){
            console.log(error);
        }
    }

    // Insert data into department table
    calculateShortName = (name = "") => {
        let words = name.split(" ");
        let shortName = "";
        words.forEach((word) => {
            shortName += word.charAt(0).toUpperCase();
        });
        return shortName;
    };

    calculateAcadamicId = async (acadamic_name) => {
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

    addDepartment = async (department_name,image_url,acadamic) => {
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
            let query = "INSERT INTO departments(department_id,department_names,image_url,acadamic_id) VALUES (?,?,?,?)";
            connection.execute(query, [department_id,department_name,image_url, acadamic_id], (error, res) => {
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
}

module.exports = DbService;