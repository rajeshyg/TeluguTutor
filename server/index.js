import express from 'express';
import cors from 'cors';
import { userOps, sessionOps, profileOps, masteryOps, practiceOps } from './database.js';

const app = express();
const PORT = process.env.PORT || 3003;

// Start server with strict port - fail if port is already in use
const server = app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoints available:`);
  console.log(`  POST /api/auth/register - Register new user`);
  console.log(`  POST /api/auth/login - Login with email/password`);
  console.log(`  POST /api/auth/login-username - Login with username`);
  console.log(`  POST /api/auth/guest - Continue as guest`);
  console.log(`  GET  /api/auth/me - Get current user`);
  console.log(`  GET  /api/auth/users - Get all users`);
  console.log(`  POST /api/auth/logout - Logout`);
  console.log(`  GET  /api/profile - Get user profile`);
  console.log(`  PATCH /api/profile - Update user profile`);
  console.log(`  GET  /api/mastery - Get mastery records`);
  console.log(`  POST /api/mastery - Update mastery record`);
  console.log(`  POST /api/practice - Create practice session`);
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ ERROR: Port ${PORT} is already in use!`);
    console.error(`Please close any existing processes using port ${PORT} or change the PORT environment variable.`);
    process.exit(1);
  } else {
    throw err;
  }
});

// Middleware
app.use(cors({
  origin: ['http://localhost:5175', 'http://localhost:3000', 'http://127.0.0.1:5175'],
  credentials: true
}));
app.use(express.json());

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];
  const session = sessionOps.findByToken(token);
  
  if (!session) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.user = {
    id: session.user_id,
    email: session.email,
    phone: session.phone,
    name: session.name,
    isGuest: session.is_guest === 1
  };
  req.token = token;
  next();
};

// Optional authentication (doesn't fail if no token)
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    const session = sessionOps.findByToken(token);
    if (session) {
      req.user = {
        id: session.user_id,
        email: session.email,
        phone: session.phone,
        name: session.name,
        isGuest: session.is_guest === 1
      };
      req.token = token;
    }
  }
  next();
};

// ============== AUTH ROUTES ==============

// Register new user
app.post('/api/auth/register', (req, res) => {
  try {
    const { email, phone, name, password } = req.body;

    // Validate required fields
    if (!email || !phone || !name) {
      return res.status(400).json({ error: 'Email, phone, and name are required' });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate phone (basic validation)
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''))) {
      return res.status(400).json({ error: 'Invalid phone number format' });
    }

    // Check if user already exists
    const existingUser = userOps.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Create user
    const user = userOps.create(email, phone, name, password);
    
    // Create session
    const session = sessionOps.create(user.id);

    res.status(201).json({
      user: { id: user.id, email: user.email, phone: user.phone, name: user.name },
      token: session.token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }

    const user = userOps.findByEmailOrPhone(email);
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    // Verify password if set
    if (user.password_hash && password) {
      if (!userOps.verifyPassword(user, password)) {
        return res.status(401).json({ error: 'Invalid password' });
      }
    }

    // Create session
    const session = sessionOps.create(user.id);

    res.json({
      user: { id: user.id, email: user.email, phone: user.phone, name: user.name, isGuest: user.is_guest === 1 },
      token: session.token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Login with username (simplified login)
app.post('/api/auth/login-username', (req, res) => {
  try {
    const { username } = req.body;

    if (!username || username.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter a name (at least 2 characters)' });
    }

    const trimmedName = username.trim();
    
    // Try to find existing user by name (case-insensitive)
    const users = userOps.getAll();
    let user = users.find(u => u.name.toLowerCase() === trimmedName.toLowerCase());

    if (!user) {
      // Create new user with auto-generated email
      const email = `${trimmedName.toLowerCase().replace(/\s+/g, '_')}@telugututor.local`;
      const phone = '0000000000'; // Placeholder for username-based login
      
      // Check if email already exists
      const existingUser = userOps.findByEmail(email);
      if (existingUser) {
        user = existingUser;
      } else {
        user = userOps.create(email, phone, trimmedName, null);
      }
    }

    // Create session
    const session = sessionOps.create(user.id);

    res.json({
      user: { id: user.id, email: user.email, phone: user.phone, name: user.name },
      token: session.token
    });
  } catch (error) {
    console.error('Username login error:', error);
    res.status(500).json({ error: 'Login failed' });
  }
});

// Continue as guest
app.post('/api/auth/guest', (req, res) => {
  try {
    const user = userOps.createGuest();
    const session = sessionOps.create(user.id);

    res.json({
      user: { id: user.id, email: user.email, name: user.name, isGuest: true },
      token: session.token
    });
  } catch (error) {
    console.error('Guest login error:', error);
    res.status(500).json({ error: 'Guest login failed' });
  }
});

// Get current user
app.get('/api/auth/me', authenticate, (req, res) => {
  try {
    const profile = profileOps.getByUserId(req.user.id);
    res.json({
      ...req.user,
      profile: profile ? {
        ...profile,
        badges_earned: JSON.parse(profile.badges_earned || '[]')
      } : null
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user' });
  }
});

// Get all users (for user selection)
app.get('/api/auth/users', (req, res) => {
  try {
    const users = userOps.getAll();
    res.json(users.map(u => ({ id: u.id, name: u.name, email: u.email })));
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to get users' });
  }
});

// Logout
app.post('/api/auth/logout', authenticate, (req, res) => {
  try {
    sessionOps.delete(req.token);
    res.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// ============== PROFILE ROUTES ==============

// Get user profile
app.get('/api/profile', authenticate, (req, res) => {
  try {
    const profile = profileOps.getByUserId(req.user.id);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json({
      ...profile,
      badges_earned: JSON.parse(profile.badges_earned || '[]')
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Failed to get profile' });
  }
});

// Update user profile
app.patch('/api/profile', authenticate, (req, res) => {
  try {
    const profile = profileOps.update(req.user.id, req.body);
    if (!profile) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    res.json({
      ...profile,
      badges_earned: JSON.parse(profile.badges_earned || '[]')
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// ============== MASTERY ROUTES ==============

// Get all mastery records for user
app.get('/api/mastery', authenticate, (req, res) => {
  try {
    const mastery = masteryOps.getByUserId(req.user.id);
    res.json(mastery.map(m => ({
      ...m,
      needs_adaptive_practice: m.needs_adaptive_practice === 1,
      user_email: req.user.email // For backward compatibility
    })));
  } catch (error) {
    console.error('Get mastery error:', error);
    res.status(500).json({ error: 'Failed to get mastery' });
  }
});

// Get adaptive practice items
app.get('/api/mastery/adaptive', authenticate, (req, res) => {
  try {
    const mastery = masteryOps.getAdaptivePractice(req.user.id);
    res.json(mastery.map(m => ({
      ...m,
      needs_adaptive_practice: true,
      user_email: req.user.email
    })));
  } catch (error) {
    console.error('Get adaptive mastery error:', error);
    res.status(500).json({ error: 'Failed to get adaptive mastery' });
  }
});

// Update or create mastery record
app.post('/api/mastery', authenticate, (req, res) => {
  try {
    const { grapheme_id, ...data } = req.body;
    
    if (!grapheme_id) {
      return res.status(400).json({ error: 'grapheme_id is required' });
    }

    const mastery = masteryOps.createOrUpdate(req.user.id, grapheme_id, data);
    res.json({
      ...mastery,
      needs_adaptive_practice: mastery.needs_adaptive_practice === 1,
      user_email: req.user.email
    });
  } catch (error) {
    console.error('Update mastery error:', error);
    res.status(500).json({ error: 'Failed to update mastery' });
  }
});

// ============== PRACTICE SESSION ROUTES ==============

// Create practice session
app.post('/api/practice', authenticate, (req, res) => {
  try {
    const { grapheme_id, is_correct, response_time, puzzle_type } = req.body;
    
    if (!grapheme_id) {
      return res.status(400).json({ error: 'grapheme_id is required' });
    }

    const session = practiceOps.create(
      req.user.id,
      grapheme_id,
      is_correct,
      response_time,
      puzzle_type
    );
    res.json(session);
  } catch (error) {
    console.error('Create practice session error:', error);
    res.status(500).json({ error: 'Failed to create practice session' });
  }
});

// Get practice history
app.get('/api/practice', authenticate, (req, res) => {
  try {
    const sessions = practiceOps.getByUserId(req.user.id);
    res.json(sessions);
  } catch (error) {
    console.error('Get practice history error:', error);
    res.status(500).json({ error: 'Failed to get practice history' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default app;
