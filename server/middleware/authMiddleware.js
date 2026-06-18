import jwt from 'jsonwebtoken';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';

// Optional protect middleware (doesn't reject if no token is present)
export const optionalProtect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'paper_plane_secret_jwt_key');

      if (isSupabaseConfigured()) {
        const { data: user } = await supabase
          .from('users')
          .select('id, name, email, role')
          .eq('id', decoded.id)
          .single();
        if (user) {
          req.user = { _id: user.id, ...user };
        }
      } else {
        const { memoryUsers } = await import('../controllers/authController.js');
        req.user = memoryUsers.find((u) => u._id === decoded.id);
      }
    } catch (error) {
      console.log('Optional token validation failed:', error.message);
    }
  }

  next();
};

// In-memory users shared export from authController (will import dynamically or define access)
// To prevent circular imports, we check both DB and an in-memory user list
export const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Decode token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'paper_plane_secret_jwt_key');

      if (isSupabaseConfigured()) {
        const { data: user } = await supabase
          .from('users')
          .select('id, name, email, role')
          .eq('id', decoded.id)
          .single();
        if (user) {
          req.user = { _id: user.id, ...user };
        }
      } else {
        // Import memoryUsers dynamically or use global reference
        const { memoryUsers } = await import('../controllers/authController.js');
        req.user = memoryUsers.find((u) => u._id === decoded.id);
      }

      if (!req.user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      return next(new Error('Not authorized, token failed'));
    }
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token'));
  }
};

// Admin middleware
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    return next(new Error('Not authorized as an admin'));
  }
};
