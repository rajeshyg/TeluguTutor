import { supabase } from '../lib/supabase';
import { TELUGU_GRAPHEMES } from '../data/teluguGraphemes';

// Token management (for session persistence)
const TOKEN_KEY = 'telugu_tutor_token';
const USER_KEY = 'telugu_tutor_user';

const getToken = () => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(TOKEN_KEY);
};

const setToken = (token) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(TOKEN_KEY, token);
};

const removeToken = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

const getStoredUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
};

const setStoredUser = (user) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Simple password hashing (matching server implementation)
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  // Convert to hex and pad to match server's SHA-256 length approximately
  const hexHash = Math.abs(hash).toString(16);
  // Create a deterministic 64-char hash by repeating
  return (hexHash.repeat(Math.ceil(64 / hexHash.length))).slice(0, 64);
}

// Generate session token
function generateToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, b => b.toString(16).padStart(2, '0')).join('');
}

// Auth operations using Supabase directly
const auth = {
  me: async () => {
    const token = getToken();
    if (!token) return null;

    try {
      // Find session by token
      const { data: session, error: sessionError } = await supabase
        .from('sessions')
        .select(`
          *,
          users (
            id,
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

      if (sessionError || !session) {
        removeToken();
        return null;
      }

      const user = {
        id: session.users.id,
        username: session.users.username,
        email: session.users.email,
        phone: session.users.phone,
        name: session.users.name,
        isGuest: session.users.is_guest === 1
      };

      // Get profile
      const { data: profile } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      setStoredUser(user);
      
      return {
        ...user,
        profile: profile ? {
          ...profile,
          badges_earned: JSON.parse(profile.badges_earned || '[]')
        } : null
      };
    } catch (error) {
      console.error('Auth check error:', error);
      removeToken();
      return null;
    }
  },

  login: async (username, password) => {
    // Find user by username
    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .ilike('username', username)
      .maybeSingle();

    if (userError || !user) {
      throw new Error('Invalid username or password');
    }

    // Verify password
    const passwordHash = simpleHash(password);
    if (user.password_hash !== passwordHash) {
      throw new Error('Invalid username or password');
    }

    // Create session
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    const { error: sessionError } = await supabase
      .from('sessions')
      .insert([{ user_id: user.id, token, expires_at: expiresAt }]);

    if (sessionError) {
      throw new Error('Failed to create session');
    }

    setToken(token);

    const userData = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isGuest: user.is_guest === 1
    };
    setStoredUser(userData);

    return userData;
  },

  register: async (username, password, name, email = null, phone = null) => {
    if (!username || !password || !name) {
      throw new Error('Username, password, and name are required');
    }

    // Validate username format
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    if (!usernameRegex.test(username)) {
      throw new Error('Username must be 3-20 characters and contain only letters, numbers, and underscores');
    }

    // Validate password
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Check if username exists
    const { data: existing } = await supabase
      .from('users')
      .select('id')
      .ilike('username', username)
      .maybeSingle();

    if (existing) {
      throw new Error('Username already taken');
    }

    // Create user
    const passwordHash = simpleHash(password);
    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([{ 
        username, 
        email, 
        phone, 
        name: name.trim(), 
        password_hash: passwordHash 
      }])
      .select()
      .single();

    if (userError) {
      throw new Error(userError.message);
    }

    // Create profile
    await supabase
      .from('user_profiles')
      .insert([{ user_id: user.id, display_name: name.trim() }]);

    // Create session
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    await supabase
      .from('sessions')
      .insert([{ user_id: user.id, token, expires_at: expiresAt }]);

    setToken(token);

    const userData = {
      id: user.id,
      username: user.username,
      name: user.name,
      email: user.email,
      phone: user.phone
    };
    setStoredUser(userData);

    return userData;
  },

  continueAsGuest: async () => {
    const guestId = `guest_${Date.now()}`;
    const guestName = 'Guest Learner';
    const guestPassword = generateToken().slice(0, 16);

    const { data: user, error: userError } = await supabase
      .from('users')
      .insert([{
        username: guestId,
        name: guestName,
        password_hash: simpleHash(guestPassword),
        is_guest: 1
      }])
      .select()
      .single();

    if (userError) {
      throw new Error('Failed to create guest account');
    }

    // Create profile
    await supabase
      .from('user_profiles')
      .insert([{ user_id: user.id, display_name: guestName }]);

    // Create session
    const token = generateToken();
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();

    await supabase
      .from('sessions')
      .insert([{ user_id: user.id, token, expires_at: expiresAt }]);

    setToken(token);

    const userData = {
      id: user.id,
      username: user.username,
      name: user.name,
      isGuest: true
    };
    setStoredUser(userData);

    return userData;
  },

  getUsers: async () => {
    const { data, error } = await supabase
      .from('users')
      .select('id, username, name')
      .eq('is_guest', 0);

    if (error) {
      console.error('Failed to get users:', error);
      return [];
    }
    return data || [];
  },

  logout: async () => {
    const token = getToken();
    if (token) {
      await supabase
        .from('sessions')
        .delete()
        .eq('token', token);
    }
    removeToken();
    return true;
  }
};

// Entity operations using Supabase directly
const entities = {
  TeluguGrapheme: {
    filter: async (params) => {
      let results = TELUGU_GRAPHEMES;
      if (params && params.module) {
        results = results.filter(g => g.module === params.module);
      }
      return results;
    },
    list: async () => TELUGU_GRAPHEMES
  },

  UserProfile: {
    filter: async (params) => {
      if (!params?.user_id) return [];

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', params.user_id);

      if (error) {
        console.error('Failed to fetch profile:', error);
        return [];
      }

      return (data || []).map(p => ({
        ...p,
        badges_earned: JSON.parse(p.badges_earned || '[]')
      }));
    },

    update: async (id, updates) => {
      // id here is user_id
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
        .eq('user_id', id)
        .select()
        .single();

      if (error) {
        console.error('Failed to update profile:', error);
        return null;
      }

      return {
        ...data,
        badges_earned: JSON.parse(data.badges_earned || '[]')
      };
    }
  },

  GraphemeMastery: {
    filter: async (params) => {
      if (!params?.user_id) return [];

      let query = supabase
        .from('grapheme_mastery')
        .select('*')
        .eq('user_id', params.user_id);

      if (params.needs_adaptive_practice) {
        query = query.eq('needs_adaptive_practice', 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Failed to fetch mastery:', error);
        return [];
      }

      return (data || []).map(m => ({
        ...m,
        needs_adaptive_practice: m.needs_adaptive_practice === 1
      }));
    },

    create: async (data) => {
      const payload = {
        user_id: data.user_id,
        grapheme_id: data.grapheme_id,
        confidence_score: data.confidence_score || 0,
        accuracy_rate: data.accuracy_rate || 0,
        total_attempts: data.total_attempts || 0,
        successful_attempts: data.successful_attempts || 0,
        consecutive_successes: data.consecutive_successes || 0,
        last_practiced: data.last_practiced || new Date().toISOString(),
        mastery_level: data.mastery_level || 'not_started',
        average_response_time: data.average_response_time,
        needs_adaptive_practice: data.needs_adaptive_practice ? 1 : 0,
        struggle_count: data.struggle_count || 0
      };

      const { data: created, error } = await supabase
        .from('grapheme_mastery')
        .insert([payload])
        .select()
        .single();

      if (error) {
        console.error('Failed to create mastery:', error);
        throw new Error(error.message);
      }

      return {
        ...created,
        needs_adaptive_practice: created.needs_adaptive_practice === 1
      };
    },

    update: async (id, updates) => {
      // id might be the record id or we need grapheme_id from updates
      const graphemeId = updates.grapheme_id;
      const userId = updates.user_id;

      if (!graphemeId) {
        throw new Error('grapheme_id is required for mastery update');
      }

      // First check if exists
      const { data: existing } = await supabase
        .from('grapheme_mastery')
        .select('id')
        .eq('user_id', userId)
        .eq('grapheme_id', graphemeId)
        .maybeSingle();

      const payload = {
        confidence_score: updates.confidence_score,
        accuracy_rate: updates.accuracy_rate,
        total_attempts: updates.total_attempts,
        successful_attempts: updates.successful_attempts,
        consecutive_successes: updates.consecutive_successes,
        last_practiced: updates.last_practiced,
        mastery_level: updates.mastery_level,
        average_response_time: updates.average_response_time,
        needs_adaptive_practice: updates.needs_adaptive_practice ? 1 : 0,
        struggle_count: updates.struggle_count
      };

      // Remove undefined values
      Object.keys(payload).forEach(k => {
        if (payload[k] === undefined) delete payload[k];
      });

      let result;
      if (existing) {
        const { data, error } = await supabase
          .from('grapheme_mastery')
          .update(payload)
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw new Error(error.message);
        result = data;
      } else {
        // Create new
        const { data, error } = await supabase
          .from('grapheme_mastery')
          .insert([{ user_id: userId, grapheme_id: graphemeId, ...payload }])
          .select()
          .single();

        if (error) throw new Error(error.message);
        result = data;
      }

      return {
        ...result,
        needs_adaptive_practice: result.needs_adaptive_practice === 1
      };
    }
  },

  PracticeSession: {
    create: async (data) => {
      const { data: session, error } = await supabase
        .from('practice_sessions')
        .insert([{
          user_id: data.user_id,
          grapheme_id: data.grapheme_id,
          is_correct: data.is_correct ? 1 : 0,
          response_time: data.response_time,
          puzzle_type: data.puzzle_type
        }])
        .select()
        .single();

      if (error) {
        console.error('Failed to create practice session:', error);
        throw new Error(error.message);
      }

      // Update practice time in profile
      if (data.response_time && data.user_id) {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('total_practice_time')
          .eq('user_id', data.user_id)
          .maybeSingle();

        if (profile) {
          const additionalTime = data.response_time / 60000;
          await supabase
            .from('user_profiles')
            .update({
              total_practice_time: (profile.total_practice_time || 0) + Math.max(additionalTime, 0.1),
              last_active: new Date().toISOString()
            })
            .eq('user_id', data.user_id);
        }
      }

      return session;
    }
  }
};

// Export base44 interface (same as before, just using Supabase directly)
export const base44 = {
  auth,
  entities
};

// Export token helpers for AuthContext
export { getToken, setToken, removeToken };

// Also export for window global access
if (typeof window !== 'undefined') {
  window.base44 = base44;
}
