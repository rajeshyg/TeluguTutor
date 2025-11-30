import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';
import crypto from 'crypto';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create database in the data folder
const dbPath = path.join(__dirname, '..', 'data', 'telugututor.db');
const db = new Database(dbPath);

// Enable foreign keys
db.pragma('foreign_keys = ON');

// Initialize database schema
function initializeDatabase() {
  // Users table with username as primary login identifier
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE NOT NULL,
      email TEXT,
      phone TEXT,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      is_guest INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);
  
  // Add username column if it doesn't exist (migration for existing databases)
  try {
    db.exec(`ALTER TABLE users ADD COLUMN username TEXT`);
  } catch (e) {
    // Column already exists, ignore
  }
  
  // Update existing users without username to use email as username
  db.exec(`
    UPDATE users SET username = email WHERE username IS NULL
  `);

  // User profiles table (for learning progress)
  db.exec(`
    CREATE TABLE IF NOT EXISTS user_profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      display_name TEXT,
      age INTEGER,
      current_module TEXT DEFAULT 'hallulu',
      total_stars INTEGER DEFAULT 0,
      total_practice_time REAL DEFAULT 0,
      badges_earned TEXT DEFAULT '[]',
      unlocked_word_puzzles INTEGER DEFAULT 0,
      last_active TEXT,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Grapheme mastery table
  db.exec(`
    CREATE TABLE IF NOT EXISTS grapheme_mastery (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      grapheme_id TEXT NOT NULL,
      confidence_score REAL DEFAULT 0,
      accuracy_rate REAL DEFAULT 0,
      total_attempts INTEGER DEFAULT 0,
      successful_attempts INTEGER DEFAULT 0,
      consecutive_successes INTEGER DEFAULT 0,
      last_practiced TEXT,
      mastery_level TEXT DEFAULT 'not_started',
      average_response_time REAL,
      needs_adaptive_practice INTEGER DEFAULT 0,
      struggle_count INTEGER DEFAULT 0,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      UNIQUE(user_id, grapheme_id)
    )
  `);

  // Practice sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS practice_sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      grapheme_id TEXT NOT NULL,
      is_correct INTEGER NOT NULL,
      response_time INTEGER,
      puzzle_type TEXT,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Sessions table for authentication tokens
  db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      token TEXT UNIQUE NOT NULL,
      expires_at TEXT NOT NULL,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  console.log('Database initialized successfully at:', dbPath);
}

// Simple password hashing (for production, use bcrypt)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Generate session token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// User operations
const userOps = {
  create: (username, password, name, email = null, phone = null) => {
    if (!username || !password || !name) {
      throw new Error('Username, password, and name are required');
    }
    
    // Check if username already exists
    const existing = userOps.findByUsername(username);
    if (existing) {
      throw new Error('Username already taken');
    }
    
    const passwordHash = hashPassword(password);
    const stmt = db.prepare(`
      INSERT INTO users (username, email, phone, name, password_hash)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(username, email, phone, name, passwordHash);
    
    // Create associated profile
    const profileStmt = db.prepare(`
      INSERT INTO user_profiles (user_id, display_name)
      VALUES (?, ?)
    `);
    profileStmt.run(result.lastInsertRowid, name);
    
    return { id: result.lastInsertRowid, username, email, phone, name };
  },

  createGuest: () => {
    const guestId = `guest_${Date.now()}`;
    const guestName = 'Guest Learner';
    // Guests get a random password they won't use
    const guestPassword = crypto.randomBytes(16).toString('hex');
    
    const stmt = db.prepare(`
      INSERT INTO users (username, name, password_hash, is_guest)
      VALUES (?, ?, ?, 1)
    `);
    const result = stmt.run(guestId, guestName, hashPassword(guestPassword));
    
    // Create associated profile
    const profileStmt = db.prepare(`
      INSERT INTO user_profiles (user_id, display_name)
      VALUES (?, ?)
    `);
    profileStmt.run(result.lastInsertRowid, guestName);
    
    return { id: result.lastInsertRowid, username: guestId, name: guestName, isGuest: true };
  },

  findByUsername: (username) => {
    const stmt = db.prepare('SELECT * FROM users WHERE username = ? COLLATE NOCASE');
    return stmt.get(username);
  },

  findByEmail: (email) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  },

  getAll: () => {
    const stmt = db.prepare('SELECT id, username, email, phone, name, is_guest, created_at FROM users WHERE is_guest = 0');
    return stmt.all();
  },

  verifyPassword: (user, password) => {
    if (!user.password_hash) return false;
    return user.password_hash === hashPassword(password);
  },

  updatePassword: (userId, newPassword) => {
    const passwordHash = hashPassword(newPassword);
    const stmt = db.prepare('UPDATE users SET password_hash = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    return stmt.run(passwordHash, userId);
  }
};

// Session operations
const sessionOps = {
  create: (userId) => {
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
    
    const stmt = db.prepare(`
      INSERT INTO sessions (user_id, token, expires_at)
      VALUES (?, ?, ?)
    `);
    stmt.run(userId, token, expiresAt);
    
    return { token, expiresAt };
  },

  findByToken: (token) => {
    const stmt = db.prepare(`
      SELECT s.*, u.username, u.email, u.phone, u.name, u.is_guest
      FROM sessions s
      JOIN users u ON s.user_id = u.id
      WHERE s.token = ? AND s.expires_at > datetime('now')
    `);
    return stmt.get(token);
  },

  delete: (token) => {
    const stmt = db.prepare('DELETE FROM sessions WHERE token = ?');
    return stmt.run(token);
  },

  deleteAllForUser: (userId) => {
    const stmt = db.prepare('DELETE FROM sessions WHERE user_id = ?');
    return stmt.run(userId);
  }
};

// Profile operations
const profileOps = {
  getByUserId: (userId) => {
    const stmt = db.prepare('SELECT * FROM user_profiles WHERE user_id = ?');
    return stmt.get(userId);
  },

  update: (userId, updates) => {
    const allowedFields = ['display_name', 'age', 'current_module', 'total_stars', 
                          'total_practice_time', 'badges_earned', 'unlocked_word_puzzles', 'last_active'];
    const fields = Object.keys(updates).filter(k => allowedFields.includes(k));
    
    if (fields.length === 0) return null;
    
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    const values = fields.map(f => {
      if (f === 'badges_earned' && Array.isArray(updates[f])) {
        return JSON.stringify(updates[f]);
      }
      return updates[f];
    });
    
    const stmt = db.prepare(`UPDATE user_profiles SET ${setClause} WHERE user_id = ?`);
    stmt.run(...values, userId);
    
    return profileOps.getByUserId(userId);
  }
};

// Grapheme mastery operations
const masteryOps = {
  getByUserId: (userId) => {
    const stmt = db.prepare('SELECT * FROM grapheme_mastery WHERE user_id = ?');
    return stmt.all(userId);
  },

  getByUserIdAndGrapheme: (userId, graphemeId) => {
    const stmt = db.prepare('SELECT * FROM grapheme_mastery WHERE user_id = ? AND grapheme_id = ?');
    return stmt.get(userId, graphemeId);
  },

  getAdaptivePractice: (userId) => {
    const stmt = db.prepare('SELECT * FROM grapheme_mastery WHERE user_id = ? AND needs_adaptive_practice = 1');
    return stmt.all(userId);
  },

  createOrUpdate: (userId, graphemeId, data) => {
    const existing = masteryOps.getByUserIdAndGrapheme(userId, graphemeId);
    
    // Helper to sanitize values for SQLite
    const sanitizeValue = (key, value) => {
      if (value === undefined || value === null) return null;
      if (key === 'needs_adaptive_practice') return value ? 1 : 0;
      if (typeof value === 'boolean') return value ? 1 : 0;
      if (typeof value === 'number' && !isFinite(value)) return 0;
      return value;
    };
    
    if (existing) {
      const fields = ['confidence_score', 'accuracy_rate', 'total_attempts', 'successful_attempts',
                     'consecutive_successes', 'last_practiced', 'mastery_level', 'average_response_time',
                     'needs_adaptive_practice', 'struggle_count'];
      const updates = fields.filter(f => data[f] !== undefined);
      
      if (updates.length === 0) return existing;
      
      const setClause = updates.map(f => `${f} = ?`).join(', ');
      const values = updates.map(f => sanitizeValue(f, data[f]));
      
      console.log('[DB] Updating mastery:', { userId, graphemeId, updates, values });
      
      const stmt = db.prepare(`UPDATE grapheme_mastery SET ${setClause} WHERE id = ?`);
      stmt.run(...values, existing.id);
      
      return masteryOps.getByUserIdAndGrapheme(userId, graphemeId);
    } else {
      const stmt = db.prepare(`
        INSERT INTO grapheme_mastery (user_id, grapheme_id, confidence_score, accuracy_rate, 
          total_attempts, successful_attempts, consecutive_successes, last_practiced, 
          mastery_level, average_response_time, needs_adaptive_practice, struggle_count)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);
      const result = stmt.run(
        userId, graphemeId,
        sanitizeValue('confidence_score', data.confidence_score) || 0,
        sanitizeValue('accuracy_rate', data.accuracy_rate) || 0,
        sanitizeValue('total_attempts', data.total_attempts) || 0,
        sanitizeValue('successful_attempts', data.successful_attempts) || 0,
        sanitizeValue('consecutive_successes', data.consecutive_successes) || 0,
        data.last_practiced || new Date().toISOString(),
        data.mastery_level || 'not_started',
        sanitizeValue('average_response_time', data.average_response_time),
        sanitizeValue('needs_adaptive_practice', data.needs_adaptive_practice),
        sanitizeValue('struggle_count', data.struggle_count) || 0
      );
      
      console.log('[DB] Created new mastery:', { userId, graphemeId, id: result.lastInsertRowid });
      
      return { id: result.lastInsertRowid, user_id: userId, grapheme_id: graphemeId, ...data };
    }
  }
};

// Practice session operations
const practiceOps = {
  create: (userId, graphemeId, isCorrect, responseTime, puzzleType) => {
    const stmt = db.prepare(`
      INSERT INTO practice_sessions (user_id, grapheme_id, is_correct, response_time, puzzle_type)
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(userId, graphemeId, isCorrect ? 1 : 0, responseTime, puzzleType);
    
    // Update practice time in profile
    if (responseTime) {
      const profile = profileOps.getByUserId(userId);
      if (profile) {
        const additionalTime = responseTime / 60000; // Convert ms to minutes
        profileOps.update(userId, {
          total_practice_time: (profile.total_practice_time || 0) + Math.max(additionalTime, 0.1),
          last_active: new Date().toISOString()
        });
      }
    }
    
    return { id: result.lastInsertRowid, userId, graphemeId, isCorrect, responseTime, puzzleType };
  },

  getByUserId: (userId) => {
    const stmt = db.prepare('SELECT * FROM practice_sessions WHERE user_id = ? ORDER BY created_at DESC');
    return stmt.all(userId);
  }
};

// Initialize database on module load
initializeDatabase();

export {
  db,
  userOps,
  sessionOps,
  profileOps,
  masteryOps,
  practiceOps,
  hashPassword,
  generateToken
};
