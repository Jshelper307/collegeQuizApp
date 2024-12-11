const express = require("express");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");
const mysql = require("mysql2");  // Ensure mysql is imported

// Direct MySQL connection setup
const connection = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DB_PORT || 3307,
});

connection.connect((error) => {
    if (error) {
        console.log("Database connection failed: " + error.message);
    } else {
        console.log("Database connected successfully...");
    }
});

const router = express.Router();

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: process.env.SMTP_PORT === '465',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

let verificationCode = {};

// Send verification code to email
router.post('/send-code', (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.json({ success: false, message: 'Email is required.' });
    }

    connection.query(
        `SELECT studentid AS id, firstname AS name, email, phone, college, universityrollnumber AS rollnumber, 'student' AS user_type
         FROM studentdetails WHERE email = ?
         UNION
         SELECT teacherid AS id, name, email, contact AS phone, department AS college, NULL AS rollnumber, 'teacher' AS user_type
         FROM teacherdetails WHERE email = ?`,
        [email, email],
        (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.json({ success: false, message: 'Database error.' });
            }

            if (results.length === 0) {
                return res.json({ success: false, message: 'Email not found.' });
            }

            // Generate a 6-digit code for verification
            const code = Math.floor(100000 + Math.random() * 900000);
            verificationCode[email] = code;

            const mailOptions = {
                from: process.env.SMTP_USER,
                to: email,
                subject: "Password Reset Code",
                text: `Your verification code is ${code}`,
            };

            transporter.sendMail(mailOptions, (error) => {
                if (error) {
                    console.error("Error sending email:", error);
                    return res.json({ success: false, message: 'Failed to send email.' });
                }
                res.json({ success: true, message: 'Verification code sent.' });
            });
        }
    );
});

// Verify code
router.post('/verify-code', (req, res) => {
    const { email, code } = req.body;
    if (!email || !code) {
        return res.json({ success: false, message: 'Email and code are required.' });
    }

    if (verificationCode[email] == code) {
        return res.json({ success: true, message: 'Code verified.' });
    }

    res.json({ success: false, message: 'Invalid code.' });
});

// Reset password
router.post('/reset-password', (req, res) => {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
        return res.json({ success: false, message: 'Email and new password are required.' });
    }

    bcrypt.hash(newPassword, 10, (err, hash) => {
        if (err) {
            console.error("Error hashing password:", err);
            return res.json({ success: false, message: 'Error hashing password.' });
        }

        // Check if the user is a student or teacher, then update password
        connection.query('SELECT studentid FROM studentdetails WHERE email = ?', [email], (err, results) => {
            if (err) {
                console.error('Database error:', err);
                return res.json({ success: false, message: 'Database error.' });
            }

            if (results.length > 0) {
                // If student exists, update the student password
                const studentId = results[0].studentid;
                const updateStudentQuery = 'UPDATE loginCredentials SET password = ? WHERE username = ?';
                connection.query(updateStudentQuery, [hash, studentId], (err) => {
                    if (err) {
                        console.error('Database error during student update:', err);
                        return res.json({ success: false, message: 'Database error during student update.' });
                    }
                    sendPasswordResetConfirmation(email, newPassword, res);
                });
            } else {
                // If student not found, check for teacher
                connection.query('SELECT teacherid FROM teacherdetails WHERE email = ?', [email], (err, results) => {
                    if (err) {
                        console.error('Database error:', err);
                        return res.json({ success: false, message: 'Database error.' });
                    }

                    if (results.length > 0) {
                        // If teacher exists, update the teacher password
                        const teacherId = results[0].teacherid;
                        const updateTeacherQuery = 'UPDATE loginCredentials SET password = ? WHERE username = ?';
                        connection.query(updateTeacherQuery, [hash, teacherId], (err) => {
                            if (err) {
                                console.error('Database error during teacher update:', err);
                                return res.json({ success: false, message: 'Database error during teacher update.' });
                            }
                            sendPasswordResetConfirmation(email, newPassword, res);
                        });
                    } else {
                        res.json({ success: false, message: 'Email not found.' });
                    }
                });
            }
        });
    });
});

// Helper function to send password reset confirmation email
function sendPasswordResetConfirmation(email, newPassword, res) {
    const mailOptions = {
        from: process.env.SMTP_USER,
        to: email,
        subject: "Your Password Reset Request",
        text: `Your password has been reset successfully. Please log in with your new password: ${newPassword}`,
    };

    transporter.sendMail(mailOptions, (error) => {
        if (error) {
            console.error('Failed to send password reset confirmation email:', error);
            return res.json({ success: false, message: 'Failed to send confirmation email.' });
        }

        delete verificationCode[email];
        res.json({ success: true, message: 'Password updated successfully.' });
    });
}

module.exports = router;
