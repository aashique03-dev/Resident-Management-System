import { poolPromise } from '../config/db.js';
import sql from 'mssql';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        const pool = await poolPromise;

        // Query Residents table for login
        const result = await pool.request()
            .input('email', sql.VarChar, email)
            .input('password', sql.VarChar, password)
            .query(`select id, name, email, role, houseId from Residents WHERE email = @email AND password = @password`);

        if (result.recordset.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const user = result.recordset[0];

        // Create JWT token with proper secret
        const token = jwt.sign(
            {
                id: user.id,
                role: user.role,
                email: user.email
            },
            process.env.JWT_SECRET || 'your-secret-key-change-this-in-production',
            { expiresIn: '24h' }
        );

        // Return structured response
        res.json({
            success: true,
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                houseId: user.houseId
            }
        });

    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({
            success: false,
            message: 'Server error during login',
            error: err.message
        });
    }
};
