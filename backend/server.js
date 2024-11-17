const express = require("express");
const path = require("path");
const cors = require("cors");
const session = require("express-session");
const dbService = require("./services/dbService");

const app = express();
const port = 3000;
app.use(cors());
app.use(express.json()); // Add this line to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data
app.use(
  session({
    secret: "my-secret",
    resave: false,
    saveUninitialized: true,
  })
);

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
  const db = dbService.getDbServiceInstance();
  const result = db.getDepartments();
  console.log(result);
  result
    .then((data) => res.json({ departments: data }))
    .catch((error) => console.log(error));
});
// add data in departments Table
app.post("/addDepartments", (req, res) => {
  // const {acadamicName} = req.body;
  // const db = dbService.getDbServiceInstance();
  // const result = db.addAcadamics(acadamicName);
  // const { acadamicName } = req.session.data; // Extract from request body
  // console.log("Received acadamicName: ", req.session.data);
  res.send({
    success: true,
  });
  // result.then(data=>res.json({success:true})).catch(error=>console.log(error))
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
