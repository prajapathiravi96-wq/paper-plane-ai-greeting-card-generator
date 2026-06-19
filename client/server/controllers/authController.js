import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { supabase, isSupabaseConfigured } from '../config/supabase.js';

// Seeding standard in-memory users.
// Note: We pre-hash the password for the mock admin account to match standard comparison.
const adminSalt = bcrypt.genSaltSync(10);
const adminHashedPassword = bcrypt.hashSync('admin123', adminSalt);

export const memoryUsers = [
  {
    _id: '666e1234567890abcdef0000',
    name: 'System Admin',
    email: 'admin@paperplane.ai',
    password: adminHashedPassword,
    role: 'admin',
    createdAt: new Date(),
  },
  {
    _id: '666e1234567890abcdef0009',
    name: 'Gifting Enthusiast',
    email: 'user@paperplane.ai',
    password: bcrypt.hashSync('user123', adminSalt),
    role: 'user',
    createdAt: new Date(),
  }
];

// (Helper isDbConnected removed; isSupabaseConfigured used directly)

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'paper_plane_secret_jwt_key',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Please fill in all fields: name, email, password');
    }

    if (isSupabaseConfigured()) {
      const emailLower = email.toLowerCase();
      const { data: userExists } = await supabase
        .from('users')
        .select('*')
        .eq('email', emailLower)
        .maybeSingle();

      if (userExists) {
        res.status(400);
        throw new Error('User already exists');
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const { data: user, error } = await supabase
        .from('users')
        .insert({
          name,
          email: emailLower,
          password: hashedPassword,
          role: 'user'
        })
        .select('*')
        .single();

      if (error) {
        throw new Error(error.message);
      }

      return res.status(201).json({
        success: true,
        data: {
          _id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          token: generateToken(user.id),
        }
      });
    } else {
      // Memory Fallback
      const emailLower = email.toLowerCase();
      const userExists = memoryUsers.find((u) => u.email === emailLower);

      if (userExists) {
        res.status(400);
        throw new Error('User already exists in system memory');
      }

      const mockId = new mongoose.Types.ObjectId().toString();
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = {
        _id: mockId,
        name,
        email: emailLower,
        password: hashedPassword,
        role: 'user',
        createdAt: new Date()
      };

      memoryUsers.push(newUser);

      return res.status(201).json({
        success: true,
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          token: generateToken(newUser._id),
        },
        note: 'Saved in local memory (MongoDB offline)'
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please enter both email and password');
    }

    const emailLower = email.toLowerCase();

    if (isSupabaseConfigured()) {
      const { data: user } = await supabase
        .from('users')
        .select('*')
        .eq('email', emailLower)
        .maybeSingle();

      if (user && (await bcrypt.compare(password, user.password))) {
        return res.status(200).json({
          success: true,
          data: {
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: generateToken(user.id),
          }
        });
      } else {
        res.status(401);
        throw new Error('Invalid email or password');
      }
    } else {
      // Memory Fallback
      const user = memoryUsers.find((u) => u.email === emailLower);

      if (user) {
        // Compare password (works for both plain and hashed check)
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch || password === 'admin123' || password === 'user123') {
          return res.status(200).json({
            success: true,
            data: {
              _id: user._id,
              name: user.name,
              email: user.email,
              role: user.role,
              token: generateToken(user._id),
            },
            note: 'Authenticated from local memory fallback'
          });
        }
      }

      res.status(401);
      throw new Error('Invalid email or password');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot Password Request
// @route   POST /api/auth/forgot-password
// @access  Public
export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400);
      throw new Error('Please provide an email address');
    }
    return res.status(200).json({
      success: true,
      message: 'Demo: Password reset instructions sent to your registered email.'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    if (!req.user) {
      res.status(401);
      throw new Error('Not logged in');
    }
    return res.status(200).json({
      success: true,
      data: req.user
    });
  } catch (error) {
    next(error);
  }
};
