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
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      phone TEXT NOT NULL,
      name TEXT NOT NULL,
      password_hash TEXT,
      is_guest INTEGER DEFAULT 0,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
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
  create: (email, phone, name, password = null) => {
    const passwordHash = password ? hashPassword(password) : null;
    const stmt = db.prepare(`
      INSERT INTO users (email, phone, name, password_hash)
      VALUES (?, ?, ?, ?)
    `);
    const result = stmt.run(email, phone, name, passwordHash);
    
    // Create associated profile
    const profileStmt = db.prepare(`
      INSERT INTO user_profiles (user_id, display_name)
      VALUES (?, ?)
    `);
    profileStmt.run(result.lastInsertRowid, name);
    
    return { id: result.lastInsertRowid, email, phone, name };
  },

  createGuest: () => {
    const guestEmail = `guest_${Date.now()}@telugututor.local`;
    const guestPhone = '0000000000';
    const guestName = 'Guest Learner';
    
    const stmt = db.prepare(`
      INSERT INTO users (email, phone, name, is_guest)
      VALUES (?, ?, ?, 1)
    `);
    const result = stmt.run(guestEmail, guestPhone, guestName);
    
    // Create associated profile
    const profileStmt = db.prepare(`
      INSERT INTO user_profiles (user_id, display_name)
      VALUES (?, ?)
    `);
    profileStmt.run(result.lastInsertRowid, guestName);
    
    return { id: result.lastInsertRowid, email: guestEmail, phone: guestPhone, name: guestName, isGuest: true };
  },

  findByEmail: (email) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
    return stmt.get(email);
  },

  findByEmailOrPhone: (emailOrPhone) => {
    const stmt = db.prepare('SELECT * FROM users WHERE email = ? OR phone = ?');
    return stmt.get(emailOrPhone, emailOrPhone);
  },

  findById: (id) => {
    const stmt = db.prepare('SELECT * FROM users WHERE id = ?');
    return stmt.get(id);
  },

  getAll: () => {
    const stmt = db.prepare('SELECT id, email, phone, name, is_guest, created_at FROM users WHERE is_guest = 0');
    return stmt.all();
  },

  verifyPassword: (user, password) => {
    if (!user.password_hash) return true; // No password set
    return user.password_hash === hashPassword(password);
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
      SELECT s.*, u.email, u.phone, u.name, u.is_guest
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
    
    if (existing) {
      const fields = ['confidence_score', 'accuracy_rate', 'total_attempts', 'successful_attempts',
                     'consecutive_successes', 'last_practiced', 'mastery_level', 'average_response_time',
                     'needs_adaptive_practice', 'struggle_count'];
      const updates = fields.filter(f => data[f] !== undefined);
      
      if (updates.length === 0) return existing;
      
      const setClause = updates.map(f => `${f} = ?`).join(', ');
      const values = updates.map(f => data[f]);
      
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
        data.confidence_score || 0,
        data.accuracy_rate || 0,
        data.total_attempts || 0,
        data.successful_attempts || 0,
        data.consecutive_successes || 0,
        data.last_practiced || new Date().toISOString(),
        data.mastery_level || 'not_started',
        data.average_response_time || null,
        data.needs_adaptive_practice ? 1 : 0,
        data.struggle_count || 0
      );
      
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
