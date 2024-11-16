const express = require('express')
const path = require('path');
const cors = require('cors');

const dbService = require('./services/dbService');

const app = express()
const port = 3000
app.use(cors());
app.use(express.json()); // Add this line to parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // For parsing URL-encoded data

// Fetch data form acadamics table
app.get('/getAcadamics', (req, res) => {
  const db = dbService.getDbServiceInstance();
  const result = db.getAcadamics();
  result.then(data=>res.json({acadamicName:data})).catch(error=>console.log(error));
})

// add data in acadamics table
app.post('/addAcadamics',(req,res)=>{
  
})



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})