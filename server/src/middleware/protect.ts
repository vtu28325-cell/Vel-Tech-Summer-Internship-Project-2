import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';

// Extend the Express Request type to include our custom user field
export interface AuthRequest extends Request {
  user?: any;
}

// @desc    Protect routes — only logged-in users can access
// @usage   Add as middleware in any route: router.get('/profile', protect, getProfile)
const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  let token: string | undefined;

  // JWT tokens are sent in the Authorization header as "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Extract the token after the "Bearer " prefix
      token = req.headers.authorization.split(' ')[1];

      // Verify the token using our secret key
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'supersecretkey12345') as { id: string };

      // Find the user in the database using the ID stored in the token payload
      // We select all fields except the password for security
      req.user = await User.findById(decoded.id).select('-password');

      // Token is valid — pass control to the next handler
      next();
    } catch (error) {
      // Token is invalid or expired
      res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  }

  if (!token) {
    // No token was found in the request header at all
    res.status(401).json({ message: 'Not authorized, no token provided' });
  }
};

// @desc    Admin middleware — only users with role 'admin' can access
export const admin = (req: AuthRequest, res: Response, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

export default protect;
