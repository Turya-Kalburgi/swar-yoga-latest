import express from 'express';
import User from '../models/User.js';
import crypto from 'crypto';

const router = express.Router();

// ===== UTILITY FUNCTIONS =====

// Hash password with salt
function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return `${salt}:${hash}`;
}

// Verify password
function verifyPassword(password, storedHash) {
  const [salt, hash] = storedHash.split(':');
  const hashVerify = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
  return hash === hashVerify;
}

// Generate stable userId from email (base64)
function generateUserId(email) {
  const normalized = email.toLowerCase();
  return Buffer.from(normalized).toString('base64').replace(/=/g, '').substring(0, 20);
}

// ===== REGISTER NEW USER =====
router.post('/register', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      confirmPassword,
      countryCode,
      country,
      state,
      gender,
      age,
      profession
    } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const normalizedEmail = email.toLowerCase();
    const userId = generateUserId(normalizedEmail);

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ email: normalizedEmail }, { userId }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user
    const newUser = new User({
      userId,
      email: normalizedEmail,
      name,
      phone: phone || null,
      countryCode: countryCode || '+91',
      country: country || null,
      state: state || null,
      gender: gender || null,
      age: age || null,
      profession: profession || null,
      passwordHash: hashPassword(password),
      accountStatus: 'active',
      emailVerified: false,
      signupDate: new Date()
    });

    await newUser.save();

    // Return user data (excluding password)
    const userData = {
      id: userId,
      email: newUser.email,
      name: newUser.name,
      phone: newUser.phone,
      countryCode: newUser.countryCode,
      country: newUser.country,
      state: newUser.state,
      gender: newUser.gender,
      age: newUser.age,
      profession: newUser.profession
    };

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: userData
    });
  } catch (error) {
    console.error('❌ Error registering user:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
});

// ===== SIGN IN =====
router.post('/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    const normalizedEmail = email.toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if account is active
    if (user.accountStatus !== 'active') {
      return res.status(403).json({
        success: false,
        message: `Account is ${user.accountStatus}. Please contact support.`
      });
    }

    // Verify password
    if (!verifyPassword(password, user.passwordHash)) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Update login info
    user.lastLogin = new Date();
    user.loginCount += 1;
    
    // Add to login history
    if (!user.metadata.loginHistory) {
      user.metadata.loginHistory = [];
    }
    user.metadata.loginHistory.push({
      date: new Date(),
      device: req.body.deviceType || 'web',
      browser: req.body.browser || 'unknown',
      ipAddress: req.ip || 'unknown'
    });

    await user.save();

    // Return user data (excluding password)
    const userData = {
      id: user.userId,
      email: user.email,
      name: user.name,
      phone: user.phone,
      countryCode: user.countryCode,
      country: user.country,
      state: user.state,
      gender: user.gender,
      age: user.age,
      profession: user.profession,
      accountStatus: user.accountStatus,
      lastLogin: user.lastLogin
    };

    res.json({
      success: true,
      message: 'Signed in successfully',
      data: userData
    });
  } catch (error) {
    console.error('❌ Error signing in:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error signing in',
      error: error.message
    });
  }
});

// ===== GET USER PROFILE =====
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = {
      id: user.userId,
      email: user.email,
      name: user.name,
      phone: user.phone,
      countryCode: user.countryCode,
      country: user.country,
      state: user.state,
      gender: user.gender,
      age: user.age,
      profession: user.profession,
      profilePicture: user.profilePicture,
      bio: user.bio,
      accountStatus: user.accountStatus,
      emailVerified: user.emailVerified,
      lastLogin: user.lastLogin,
      signupDate: user.signupDate,
      preferences: user.preferences
    };

    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('❌ Error fetching user profile:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching user profile',
      error: error.message
    });
  }
});

// ===== GET USER BY EMAIL =====
router.get('/email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    const normalizedEmail = email.toLowerCase();

    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const userData = {
      id: user.userId,
      email: user.email,
      name: user.name,
      phone: user.phone,
      countryCode: user.countryCode,
      country: user.country,
      state: user.state,
      gender: user.gender,
      age: user.age,
      profession: user.profession,
      profilePicture: user.profilePicture,
      bio: user.bio,
      accountStatus: user.accountStatus,
      emailVerified: user.emailVerified,
      lastLogin: user.lastLogin,
      signupDate: user.signupDate
    };

    res.json({
      success: true,
      data: userData
    });
  } catch (error) {
    console.error('❌ Error fetching user by email:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error fetching user',
      error: error.message
    });
  }
});

// ===== UPDATE USER PROFILE =====
router.put('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const updates = req.body;

    // Remove sensitive fields
    delete updates.userId;
    delete updates.email;
    delete updates.passwordHash;
    delete updates.accountStatus;
    delete updates.loginCount;

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update allowed fields
    Object.assign(user, updates);
    await user.save();

    const userData = {
      id: user.userId,
      email: user.email,
      name: user.name,
      phone: user.phone,
      countryCode: user.countryCode,
      country: user.country,
      state: user.state,
      gender: user.gender,
      age: user.age,
      profession: user.profession,
      profilePicture: user.profilePicture,
      bio: user.bio,
      accountStatus: user.accountStatus
    };

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: userData
    });
  } catch (error) {
    console.error('❌ Error updating profile:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
});

// ===== CHANGE PASSWORD =====
router.post('/change-password/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const { oldPassword, newPassword, confirmPassword } = req.body;

    if (!oldPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Old password and new password are required'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: 'Passwords do not match'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Verify old password
    if (!verifyPassword(oldPassword, user.passwordHash)) {
      return res.status(401).json({
        success: false,
        message: 'Old password is incorrect'
      });
    }

    user.passwordHash = hashPassword(newPassword);
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    console.error('❌ Error changing password:', error.message);
    res.status(500).json({
      success: false,
      message: 'Error changing password',
      error: error.message
    });
  }
});

export default router;
