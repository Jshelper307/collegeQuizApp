const mysql = require('mysql2'); 
const express = require("express");
const router = express.Router();
const { addDepartment} = require('../Database/acadamic'); // Import the function from acadamic to add academics

// POST route to add academic name
router.post('/department', async (req, res) => {
    const { dept_name } = req.body;  // Get academic name from the request body

    if (!dept_name) {
        return res.status(400).json({ error: 'dept name is required' });
    }

    try {
        const result = await addDepartment(dept_name);  // Call function to add academic name to DB
        res.status(201).json({ message: 'dept added successfully', result });
    } catch (error) {
        console.error("Error adding dept:", error);
        res.status(500).json({ error: 'Error adding dept' });
    }
});

// // GET route to fetch all academic names
// router.get('/academics', async (req, res) => {
//     let connection;
//     try {
//         // Connect to the database
//         const pool = mysql.createPool(connectionConfig);
//         pool.execute('SELECT * FROM acadamics');
        
//         // Send the data as a JSON response
//         res.status(200).json(rows);
//     } catch (error) {
//         console.error('Error fetching academics:', error);
//         res.status(500).json({ error: 'Error fetching academic names' });
//     } finally {
//         // Ensure the connection is closed properly
//         if (connection) {
//             await connection.end();
//         }
//     }
// });

module.exports = router;