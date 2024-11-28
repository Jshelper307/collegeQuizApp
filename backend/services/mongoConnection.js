const mongoose = require('mongoose');

// MongoDB connection string (replace with your MongoDB URI)
const uri = 'mongodb://localhost:27017/examDb'; // For local MongoDB
// Example for cloud database (MongoDB Atlas): 
// const uri = 'mongodb+srv://<username>:<password>@cluster.mongodb.net/exam-platform?retryWrites=true&w=majority';

const connectDB = async () => {
    try {
        await mongoose.connect(uri);
        console.log('MongoDB connected successfully!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error.message);
        process.exit(1); // Exit with failure
    }
};

module.exports = connectDB;