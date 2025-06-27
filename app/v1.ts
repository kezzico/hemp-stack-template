import express from 'express';
import sendmail from './mailer';
import db from './db';
import { generateToken } from './auth';
import { authorize } from './auth';

const router = express.Router();

router.post('/signup', async (req, res) => {
    const { email } = req.body;
    console.log("[/v1/signup] got email address:", email);
    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }
    try {
        // Insert email into the logins table
        // Try to insert the email, and only send welcome email if it's a new signup
        const [result]: any = await db.query(
            `
            INSERT IGNORE INTO signups (email, created_at)
            VALUES (?, NOW())
            `,
            [email]
        );
        if (result.affectedRows === 0) {
            // Email already exists, do not send welcome email
            return res.redirect(303, '/thank-you.php');
        }
        // Send a welcome email to the user
        console.log("[/v1/signup] sending welcome email to:", email);
        await sendmail(
            email,
            'Welcome to Our Service',
            `<h2>Thank you for signing up!</h2>
            <p>We hope you enjoy our service.</p>`
        );

        return res.redirect(303, '/thank-you.php');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).json({ error: 'Failed to process signup' });
    }
});

// To test this endpoint with curl, use:
// curl -X POST http://localhost:3000/v1/otp -H "Content-Type: application/json" -d '{"email":"test@example.com"}'
router.post('/otp', async (req, res) => {
    // Example: handle POST /otp request
    const { email } = req.body;
    console.log("[/v1/otp] got email address:", email);

    if (!email) {
        return res.status(400).json({ error: 'Email is required' });
    }

    // Generate a 6-digit OTP code
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    try {
        // Insert email and OTP into the logins table
        await db.query(
            `
            INSERT INTO logins (email, otp, created_at)
            VALUES (?, ?, NOW())
            `,
            [email, otp]
        );

        // Send the OTP code to the user's email as a URL-encoded string
        console.log("[/v1/otp] sending OTP to email:", email);

        await sendmail(
            email,
            'Your OTP Code',
            `Your OTP code is: <b>${otp}</b>. Please enter this code to verify your email address.`
        );

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        res.status(500).json({ error: 'Failed to send OTP' });
    }
});

/*
To test the /verify endpoint with POST:
curl -X POST http://sandbox.dogcity.social/v1/verify -H "Content-Type: application/json" -d '{"email":"test@example.com","otp":"123456"}'
*/
router.post('/verify', async (req, res) => {
    // Example: handle GET /verify request
    const { email, otp } = req.body;
    console.log("[/v1/verify] got email and OTP:", email, otp);
    if (!email || !otp) {
        return res.status(400).json({ error: 'Email and OTP are required' });
    }
    
    try {
        // Check if the OTP exists in the logins table
        const [rows] = await db.query(
            `
            SELECT id, email
            FROM logins
            WHERE email = ?
            AND otp = ?
            AND created_at > NOW() - INTERVAL 1 DAY
            `,
            [email, otp]
        );
        if (rows.length === 0) {
            return res.status(400).json({ error: 'Invalid or Expired OTP' });
        }

        const loginId = rows[0].id;

        // Optionally, you can also log the successful verification
        console.log("[/v1/verify] OTP verified successfully for email:", email);

        await db.query(
            `
            UPDATE logins
            SET login_at = NOW()
            WHERE id = ?
            `,
            [loginId]
        );

        res.status(200).json({ jwt: generateToken(email), message: 'OTP verified successfully' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ error: 'Failed to verify OTP' });
    }
});

/*
curl -X POST https://sandbox.dogcity.social/v1/profile \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImxlZUBrZXp6aS5jbyIsImlhdCI6MTc0OTY2MjAyOCwiZXhwIjoxNzQ5NjY1NjI4fQ.OLvg2TjPtkoXPUerdcfujt5_OzIkoIQetzUKLfhqMnA"
*/
router.post('/profile', authorize, async (req, res) => {
    // Example: handle POST /profile request
    const { email } = req.auth;
    console.log("[/v1/profile] got email address:", email);

    try {
        const [rows] = await db.query(
            `
            SELECT login_at
            FROM logins
            WHERE email = ?
            ORDER BY login_at DESC
            LIMIT 1
            `,
            [email]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'No login record found' });
        }

        const lastLogin = rows[0].login_at;
        res.status(200).json({ email, lastLogin });
    } catch (error) {
        console.error('Error fetching last login:', error);
        res.status(500).json({ error: 'Failed to fetch last login' });
    }
});


export default router;


/** 
 * Tables used by this API:

 CREATE TABLE signups (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE logins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp VARCHAR(6) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    login_at DATETIME DEFAULT NULL,
    INDEX idx_email (email)
);

 */