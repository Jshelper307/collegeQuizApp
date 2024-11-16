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
        }
        catch(e){
            console.log(e);
        }
    }
}

module.exports = DbService;