const mysql = require('mysql2');
const dotenv = require('dotenv');
let instance = null;
dotenv.config();
// create connection
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DB_PORT || 3307,
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
    async getDepartments(acadamicname){
        try{
            const acadamic_id = await this.calculateAcadamicId(acadamicname);
            const response = await new Promise((resolve,reject)=>{
                const query = "SELECT * FROM departments where acadamic_id=?;";
                connection.query(query,[acadamic_id],(error,result)=>{
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

    // Insert data into department table
    calculateShortName(name = ""){
        let words = name.split(" ");
        let shortName = "";
        words.forEach((word) => {
            shortName += word.charAt(0).toUpperCase();
        });
        return shortName;
    };

    async calculateAcadamicId(acadamic_name){
        let query = "SELECT acadamic_id FROM acadamics WHERE acadamic_names=?";
        
        // Use promise to handle asynchronous operation
        return new Promise((resolve, reject) => {
            connection.execute(query, [acadamic_name], (error, res) => {
                if (error) {
                    console.log(error);
                    reject(error);
                } else {
                    // console.log("Acadamic ID is: ", res[0].acadamic_id);
                    resolve(res[0].acadamic_id);
                }
            });
        });
    };

    async addDepartment(department_name,image_url,acadamic){
        try {
            // Fetch the next department ID
            let departmentQuery = "SELECT COUNT(department_id) AS totalrow FROM departments";
            
            const department_id = await new Promise((resolve, reject) => {
                connection.execute(departmentQuery, (e, r) => {
                    if (e) {
                        console.log(e);
                        reject(e);
                    } else {
                        let newDepartmentId = "0" + (r[0].totalrow + 1) + this.calculateShortName(department_name);
                        // console.log("Department ID is: ", newDepartmentId);
                        resolve(newDepartmentId);
                    }
                });
            });

            // Fetch the acadamic ID
            const acadamic_id = await this.calculateAcadamicId(acadamic);
            // console.log("Acadamic ID in addDepartment: ", acadamic_id);

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

    // get data from subject table
    async getSubjects(department_name){
        try{
            const department_id = await this.calculateDepartmentId(department_name);
            const response = await new Promise((resolve,reject)=>{
                const query = "SELECT * FROM subjects where department_id=?;";
                connection.query(query,[department_id],(error,result)=>{
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

    // Insert data into subject table
    calculateDepartmentId = (department_name)=>{
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
    addSubject = async (subject_id,subject_name,department_name,year)=>{
        let department_id = await this.calculateDepartmentId(department_name);
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
}
module.exports = DbService;