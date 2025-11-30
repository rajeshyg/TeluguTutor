import { TELUGU_GRAPHEMES } from '../data/teluguGraphemes';

const STORAGE_KEYS = {
  MASTERY: 'telugu_tutor_mastery',
  PROFILE: 'telugu_tutor_profile',
  SESSIONS: 'telugu_tutor_sessions',
  CURRENT_USER: 'telugu_tutor_current_user',
  USERS: 'telugu_tutor_users'
};

// Generate a simple user ID from username
const generateUserId = (username) => {
  return `user_${username.toLowerCase().replace(/\s+/g, '_')}`;
};

const getStorage = (key, defaultVal = []) => {
  if (typeof window === 'undefined') return defaultVal;
  const stored = localStorage.getItem(key);
  return stored ? JSON.parse(stored) : defaultVal;
};

const setStorage = (key, val) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(key, JSON.stringify(val));
};

const removeStorage = (key) => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(key);
};

// Simple hash function for passwords (NOT for production - use bcrypt in real apps)
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
};

const defaultBase44 = {
  auth: {
    // Get currently logged in user
    me: async () => {
      const currentUser = getStorage(STORAGE_KEYS.CURRENT_USER, null);
      if (!currentUser) {
        return null;
      }
      
      // Ensure profile exists for current user
      const profiles = getStorage(STORAGE_KEYS.PROFILE, []);
      let profile = profiles.find(p => p.user_email === currentUser.email);
      
      if (!profile) {
        profile = {
          user_email: currentUser.email,
          display_name: currentUser.name || currentUser.email,
          total_stars: 0,
          total_practice_time: 0,
          badges_earned: [],
          unlocked_word_puzzles: false,
          last_active: new Date().toISOString()
        };
        profiles.push(profile);
        setStorage(STORAGE_KEYS.PROFILE, profiles);
      }
      
      return { email: currentUser.email, name: profile.display_name };
    },
    
    // Simple login with just username (creates account if doesn't exist)
    loginWithUsername: async (username) => {
      if (!username || username.trim().length < 2) {
        throw new Error('Please enter a name (at least 2 characters)');
      }
      
      const trimmedName = username.trim();
      const userId = generateUserId(trimmedName);
      const users = getStorage(STORAGE_KEYS.USERS, []);
      
      // Find existing user or create new one
      let user = users.find(u => u.id === userId || u.name?.toLowerCase() === trimmedName.toLowerCase());
      
      if (!user) {
        // Create new user
        user = {
          id: userId,
          email: userId, // Use ID as email for compatibility
          name: trimmedName,
          createdAt: new Date().toISOString()
        };
        users.push(user);
        setStorage(STORAGE_KEYS.USERS, users);
        
        // Create profile for new user
        const profiles = getStorage(STORAGE_KEYS.PROFILE, []);
        const profile = {
          user_email: userId,
          display_name: trimmedName,
          total_stars: 0,
          total_practice_time: 0,
          badges_earned: [],
          unlocked_word_puzzles: false,
          last_active: new Date().toISOString()
        };
        profiles.push(profile);
        setStorage(STORAGE_KEYS.PROFILE, profiles);
      }
      
      // Set current user
      const userData = { email: user.email || user.id, name: user.name };
      setStorage(STORAGE_KEYS.CURRENT_USER, userData);
      
      return userData;
    },
    
    // Get list of all users (for user selection)
    getUsers: async () => {
      const users = getStorage(STORAGE_KEYS.USERS, []);
      return users.map(u => ({ id: u.id || u.email, name: u.name }));
    },
    
    // Sign up a new user (legacy - now uses loginWithUsername)
    signup: async (email, password, displayName) => {
      if (!displayName && !email) {
        throw new Error('Name is required');
      }
      
      // Use the simple username login instead
      return defaultBase44.auth.loginWithUsername(displayName || email);
    },
    
    // Login existing user (legacy - for backward compatibility)
    login: async (email, password) => {
      // For backward compatibility, try to find user by email
      const users = getStorage(STORAGE_KEYS.USERS, []);
      const user = users.find(u => u.email === email);
      
      if (user) {
        const userData = { email: user.email, name: user.name };
        setStorage(STORAGE_KEYS.CURRENT_USER, userData);
        return userData;
      }
      
      // Otherwise, treat email as username
      return defaultBase44.auth.loginWithUsername(email);
    },
    
    // Logout current user
    logout: async () => {
      removeStorage(STORAGE_KEYS.CURRENT_USER);
      return true;
    },
    
    // Continue as guest (creates temporary session)
    continueAsGuest: async () => {
      const guestEmail = `guest_${Date.now()}@telugututor.local`;
      const userData = { email: guestEmail, name: 'Guest Learner', isGuest: true };
      setStorage(STORAGE_KEYS.CURRENT_USER, userData);
      
      // Create guest profile
      const profiles = getStorage(STORAGE_KEYS.PROFILE, []);
      const profile = {
        user_email: guestEmail,
        display_name: 'Guest Learner',
        total_stars: 0,
        total_practice_time: 0,
        badges_earned: [],
        unlocked_word_puzzles: false,
        last_active: new Date().toISOString(),
        isGuest: true
      };
      profiles.push(profile);
      setStorage(STORAGE_KEYS.PROFILE, profiles);
      
      return userData;
    }
  },
  entities: {
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
        const profiles = getStorage(STORAGE_KEYS.PROFILE, []);
        if (params && params.user_email) {
          return profiles.filter(p => p.user_email === params.user_email);
        }
        return profiles;
      },
      update: async (id, updates) => {
        // In this mock, id is effectively the email or we find by email in the updates if provided, 
        // but usually update takes an ID. Let's assume we find by email for simplicity or the caller passes email.
        // Actually, the caller in Home.jsx uses filter. 
        // Let's assume 'id' is the user_email for this mock since we don't have real IDs.
        const profiles = getStorage(STORAGE_KEYS.PROFILE, []);
        const index = profiles.findIndex(p => p.user_email === id); // id passed as email
        if (index !== -1) {
          profiles[index] = { ...profiles[index], ...updates };
          setStorage(STORAGE_KEYS.PROFILE, profiles);
          return profiles[index];
        }
        return null;
      }
    },
    GraphemeMastery: {
      filter: async (params) => {
        let all = getStorage(STORAGE_KEYS.MASTERY, []);
        if (params) {
          if (params.user_email) all = all.filter(m => m.user_email === params.user_email);
          if (params.needs_adaptive_practice) all = all.filter(m => m.needs_adaptive_practice === params.needs_adaptive_practice);
        }
        return all;
      },
      create: async (data) => {
        const all = getStorage(STORAGE_KEYS.MASTERY, []);
        const newItem = { ...data, id: Date.now().toString() + Math.random() };
        all.push(newItem);
        setStorage(STORAGE_KEYS.MASTERY, all);
        return newItem;
      },
      update: async (id, updates) => {
        const all = getStorage(STORAGE_KEYS.MASTERY, []);
        const index = all.findIndex(m => m.id === id);
        if (index !== -1) {
          all[index] = { ...all[index], ...updates };
          setStorage(STORAGE_KEYS.MASTERY, all);
          return all[index];
        }
      }
    },
    PracticeSession: {
      create: async (data) => {
        const all = getStorage(STORAGE_KEYS.SESSIONS, []);
        const newItem = { ...data, id: Date.now().toString() };
        all.push(newItem);
        setStorage(STORAGE_KEYS.SESSIONS, all);
        
        // Update practice time in profile
        if (data.response_time) {
           const profiles = getStorage(STORAGE_KEYS.PROFILE, []);
           const profileIndex = profiles.findIndex(p => p.user_email === data.user_email);
           if (profileIndex !== -1) {
             // Convert ms to minutes (approx)
             const minutes = data.response_time / 60000;
             // We'll just add 1 minute for every session for simplicity or accumulate
             // Let's accumulate properly
             const currentMinutes = profiles[profileIndex].total_practice_time || 0;
             // Add a small amount, e.g. 0.1 minutes per question if response_time is small
             // Or just increment by 1 for every X questions. 
             // Let's just add 1/10th of a minute for each question for now to show progress
             profiles[profileIndex].total_practice_time = parseFloat((currentMinutes + 0.1).toFixed(1));
             setStorage(STORAGE_KEYS.PROFILE, profiles);
           }
        }
        
        return newItem;
      }
    }
  }
};

// Use a Proxy to allow dynamic switching of the implementation (e.g. for testing)
export const base44 = new Proxy({}, {
  get: (target, prop) => {
    const implementation = (typeof window !== 'undefined' && window.base44) ? window.base44 : defaultBase44;
    return implementation[prop];
  }
});

if (typeof window !== 'undefined' && !window.base44) {
  window.base44 = defaultBase44; // Initialize with default if not present
}
