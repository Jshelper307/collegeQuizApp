const mysql = require('mysql2'); 
const express = require("express");
const router = express.Router();
const { addAcadamics } = require('../services/addDataInSQL'); // Import the function from acadamic to add academics

// POST route to add academic name
router.post('/', async (req, res) => {
    const { acadamic_names } = req.body;  // Get academic name from the request body

    if (!acadamic_names) {
        return res.status(400).json({ error: 'Academic name is required' });
    }

    try {
        const result = await addAcadamics(acadamic_names);  // Call function to add academic name to DB
        res.status(201).json({ message: 'Academic added successfully', result });
    } catch (error) {
        console.error("Error adding academic:", error);
        res.status(500).json({ error: 'Error adding academic' });
    }
});

// GET route to fetch all academic names
router.get('/', async (req, res) => {
    let connection;
    try {
        // Connect to the database
        const pool = mysql.createPool(connectionConfig);
        pool.execute('SELECT * FROM acadamics');
        
        // Send the data as a JSON response
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching academics:', error);
        res.status(500).json({ error: 'Error fetching academic names' });
    } finally {
        // Ensure the connection is closed properly
        if (connection) {
            await connection.end();
        }
    }
});

module.exports = router;
