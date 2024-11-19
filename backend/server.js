const express = require("express");
const path = require("path");
const cors = require("cors");
const dotenv = require('dotenv')
const dbService = require("./services/dbService");
const questions = require("./routes/questions");
dotenv.config();

const app = express();
const port = process.env.PORT||3001;
app.use(cors());
app.use(express.json()); // Add this line to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data
app.use("/api",questions);
// Fetch data form acadamics table
app.get("/getAcadamics", (req, res) => {
  const db = dbService.getDbServiceInstance();
  const result = db.getAcadamics();
  result
    .then((data) => {
      res.json({ acadamicName: data });
    })
    .catch((error) => console.log(error));
});

// add data in acadamics table
app.post("/addAcadamics", (req, res) => {
  const { acadamicName } = req.body;
  const db = dbService.getDbServiceInstance();
  const result = db.addAcadamics(acadamicName);

  result
    .then((data) => res.json({ success: true }))
    .catch((error) => console.log(error));
});

// Fetch data from departments Table
app.get("/getDepartments", (req, res) => {
  const acadamicName = req.query.acadamicName;
  const db = dbService.getDbServiceInstance();
  const result = db.getDepartments(acadamicName);
  // console.log(result);
  result
    .then((data) => res.json({ departments: data }))
    .catch((error) => console.log(error));
});
// add data in departments Table
app.post("/addDepartments", (req, res) => {
  const {departmentName,imageUrl,acadamicName} = req.body;

  const db = dbService.getDbServiceInstance();
  const result = db.addDepartment(departmentName,imageUrl,acadamicName);
  result.then(data=>res.json({success:true})).catch(error=>console.log(error))
});

// Fetch data from departments Table
app.get("/getSubjects", (req, res) => {
  const department_name = req.query.departmentName;
  const db = dbService.getDbServiceInstance();
  const result = db.getSubjects(department_name);
  // console.log(result);
  result
    .then((data) => res.json({ departments: data }))
    .catch((error) => console.log(error));
});
// add data in departments Table
app.post("/addSubjects", (req, res) => {
  const {subjectCode,subjectName,year,department_name } = req.body;

  const db = dbService.getDbServiceInstance();
  const result = db.addSubject(subjectCode,subjectName,year,department_name );
  result.then(data=>res.json({success:true})).catch(error=>console.log(error))
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
