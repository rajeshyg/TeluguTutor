import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_KEY environment variables');
  // We don't exit here to allow the app to start and show the error, 
  // but DB operations will fail.
}

const supabase = createClient(supabaseUrl || 'https://placeholder.supabase.co', supabaseKey || 'placeholder');

// Simple password hashing (for production, use bcrypt)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Generate session token
function generateToken() {
  return crypto.randomBytes(32).toString('hex');
}

// Helper to handle Supabase responses
const handleResponse = async (promise) => {
  const { data, error } = await promise;
  if (error) throw new Error(error.message);
  return data;
};

// User operations
const userOps = {
  create: async (username, password, name, email = null, phone = null) => {
    if (!username || !password || !name) {
      throw new Error('Username, password, and name are required');
    }
    
    // Check if username already exists
    const existing = await userOps.findByUsername(username);
    if (existing) {
      throw new Error('Username already taken');
    }
    
    const passwordHash = hashPassword(password);
    
    const { data: user, error } = await supabase
      .from('users')
      .insert([{ username, email, phone, name, password_hash: passwordHash }])
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    
    // Create associated profile
    await supabase
      .from('user_profiles')
      .insert([{ user_id: user.id, display_name: name }]);
    
    return user;
  },

  createGuest: async () => {
    const guestId = `guest_${Date.now()}`;
    const guestName = 'Guest Learner';
    const guestPassword = crypto.randomBytes(16).toString('hex');
    
    const { data: user, error } = await supabase
      .from('users')
      .insert([{ 
        username: guestId, 
        name: guestName, 
        password_hash: hashPassword(guestPassword), 
        is_guest: 1 
      }])
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    
    // Create associated profile
    await supabase
      .from('user_profiles')
      .insert([{ user_id: user.id, display_name: guestName }]);
    
    return { ...user, isGuest: true };
  },

  findByUsername: async (username) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .ilike('username', username) // Case insensitive
      .maybeSingle();
      
    if (error) throw new Error(error.message);
    return data;
  },

  findByEmail: async (email) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .maybeSingle();
      
    if (error) throw new Error(error.message);
    return data;
  },

  findById: async (id) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
      
    if (error) throw new Error(error.message);
    return data;
  },

  getAll: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, email, phone, name, is_guest, created_at')
      .eq('is_guest', 0);
      
    if (error) throw new Error(error.message);
    return data;
  },

  verifyPassword: (user, password) => {
    if (!user.password_hash) return false;
    return user.password_hash === hashPassword(password);
  },

  updatePassword: async (userId, newPassword) => {
    const passwordHash = hashPassword(newPassword);
    const { error } = await supabase
      .from('users')
      .update({ password_hash: passwordHash, updated_at: new Date().toISOString() })
      .eq('id', userId);
      
    if (error) throw new Error(error.message);
    return true;
  }
};

// Session operations
const sessionOps = {
  create: async (userId) => {
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(); // 30 days
    
    const { error } = await supabase
      .from('sessions')
      .insert([{ user_id: userId, token, expires_at: expiresAt }]);
      
    if (error) throw new Error(error.message);
    return { token, expiresAt };
  },

  findByToken: async (token) => {
    // Join with users table
    const { data, error } = await supabase
      .from('sessions')
      .select(`
        *,
        users (
          username,
          email,
          phone,
          name,
          is_guest
        )
      `)
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .maybeSingle();
      
    if (error) throw new Error(error.message);
    if (!data) return null;

    // Flatten structure to match previous SQLite return format
    return {
      ...data,
      username: data.users.username,
      email: data.users.email,
      phone: data.users.phone,
      name: data.users.name,
      is_guest: data.users.is_guest
    };
  },

  delete: async (token) => {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('token', token);
      
    if (error) throw new Error(error.message);
    return true;
  },

  deleteAllForUser: async (userId) => {
    const { error } = await supabase
      .from('sessions')
      .delete()
      .eq('user_id', userId);
      
    if (error) throw new Error(error.message);
    return true;
  }
};

// Profile operations
const profileOps = {
  getByUserId: async (userId) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();
      
    if (error) throw new Error(error.message);
    return data;
  },

  update: async (userId, updates) => {
    const allowedFields = ['display_name', 'age', 'current_module', 'total_stars', 
                          'total_practice_time', 'badges_earned', 'unlocked_word_puzzles', 'last_active'];
    const fields = {};
    
    Object.keys(updates).forEach(k => {
      if (allowedFields.includes(k)) {
        if (k === 'badges_earned' && Array.isArray(updates[k])) {
          fields[k] = JSON.stringify(updates[k]);
        } else {
          fields[k] = updates[k];
        }
      }
    });
    
    if (Object.keys(fields).length === 0) return null;
    
    const { data, error } = await supabase
      .from('user_profiles')
      .update(fields)
      .eq('user_id', userId)
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    return data;
  },
  
  // Helper to create profile if missing (for migration)
  create: async (userId, name) => {
    const { data, error } = await supabase
      .from('user_profiles')
      .insert([{ user_id: userId, display_name: name }])
      .select()
      .single();
    if (error) throw new Error(error.message);
    return data;
  }
};

// Grapheme mastery operations
const masteryOps = {
  getByUserId: async (userId) => {
    const { data, error } = await supabase
      .from('grapheme_mastery')
      .select('*')
      .eq('user_id', userId);
      
    if (error) throw new Error(error.message);
    return data;
  },

  getByUserIdAndGrapheme: async (userId, graphemeId) => {
    const { data, error } = await supabase
      .from('grapheme_mastery')
      .select('*')
      .eq('user_id', userId)
      .eq('grapheme_id', graphemeId)
      .maybeSingle();
      
    if (error) throw new Error(error.message);
    return data;
  },

  getAdaptivePractice: async (userId) => {
    const { data, error } = await supabase
      .from('grapheme_mastery')
      .select('*')
      .eq('user_id', userId)
      .eq('needs_adaptive_practice', 1);
      
    if (error) throw new Error(error.message);
    return data;
  },

  createOrUpdate: async (userId, graphemeId, data) => {
    const existing = await masteryOps.getByUserIdAndGrapheme(userId, graphemeId);
    
    // Helper to sanitize values
    const sanitizeValue = (key, value) => {
      if (value === undefined || value === null) return null;
      if (key === 'needs_adaptive_practice') return value ? 1 : 0;
      if (typeof value === 'boolean') return value ? 1 : 0;
      if (typeof value === 'number' && !isFinite(value)) return 0;
      return value;
    };
    
    const fields = ['confidence_score', 'accuracy_rate', 'total_attempts', 'successful_attempts',
                   'consecutive_successes', 'last_practiced', 'mastery_level', 'average_response_time',
                   'needs_adaptive_practice', 'struggle_count'];
                   
    const payload = { user_id: userId, grapheme_id: graphemeId };
    
    if (existing) {
      // Update
      fields.forEach(f => {
        if (data[f] !== undefined) payload[f] = sanitizeValue(f, data[f]);
      });
      
      const { data: updated, error } = await supabase
        .from('grapheme_mastery')
        .update(payload)
        .eq('id', existing.id)
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      return updated;
    } else {
      // Insert
      fields.forEach(f => {
        payload[f] = sanitizeValue(f, data[f]);
      });
      // Set defaults for missing fields if needed, though DB handles defaults
      if (payload.confidence_score === undefined) payload.confidence_score = 0;
      if (payload.mastery_level === undefined) payload.mastery_level = 'not_started';
      
      const { data: created, error } = await supabase
        .from('grapheme_mastery')
        .insert([payload])
        .select()
        .single();
        
      if (error) throw new Error(error.message);
      return created;
    }
  }
};

// Practice session operations
const practiceOps = {
  create: async (userId, graphemeId, isCorrect, responseTime, puzzleType) => {
    const { data: session, error } = await supabase
      .from('practice_sessions')
      .insert([{
        user_id: userId,
        grapheme_id: graphemeId,
        is_correct: isCorrect ? 1 : 0,
        response_time: responseTime,
        puzzle_type: puzzleType
      }])
      .select()
      .single();
      
    if (error) throw new Error(error.message);
    
    // Update practice time in profile
    if (responseTime) {
      const profile = await profileOps.getByUserId(userId);
      if (profile) {
        const additionalTime = responseTime / 60000; // Convert ms to minutes
        await profileOps.update(userId, {
          total_practice_time: (profile.total_practice_time || 0) + Math.max(additionalTime, 0.1),
          last_active: new Date().toISOString()
        });
      }
    }
    
    return session;
  },

  getByUserId: async (userId) => {
    const { data, error } = await supabase
      .from('practice_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
      
    if (error) throw new Error(error.message);
    return data;
  }
};

export {
  userOps,
  sessionOps,
  profileOps,
  masteryOps,
  practiceOps,
  hashPassword,
  generateToken
};
