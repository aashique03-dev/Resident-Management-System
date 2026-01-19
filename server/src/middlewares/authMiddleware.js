import jwt from 'jsonwebtoken';

// Check if JWT exists & is valid
export const authenticateToken = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer token

        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'No token provided. Please login.' 
            });
        }

        // Verify token
        jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key-change-this-in-production', (err, decoded) => {
            if (err) {
                console.error('Token verification failed:', err.message);
                return res.status(403).json({ 
                    success: false,
                    message: 'Invalid or expired token. Please login again.' 
                });
            }
            
            // Attach user info to request
            req.user = decoded; // { id, role, email }
            next();
        });
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Authentication error' 
        });
    }
};

// Restrict access by roles
export const authorizeRoles = (...allowedRoles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ 
            success: false,
            message: 'User not authenticated' 
        });
    }

    if (!allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ 
            success: false,
            message: `Access denied. Required role: ${allowedRoles.join(' or ')}` 
        });
    }
    
    next();
};