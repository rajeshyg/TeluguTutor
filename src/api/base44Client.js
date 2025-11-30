import { TELUGU_GRAPHEMES } from '../data/teluguGraphemes';
import { authApi, profileApi, masteryApi, practiceApi, getToken } from './apiClient';

// Flag to check if backend is available
let useBackend = true;
let backendChecked = false;

// Check if backend is available
const checkBackend = async () => {
  if (backendChecked) return useBackend;
  
  try {
    const response = await fetch('http://localhost:3003/api/health', { 
      method: 'GET',
      signal: AbortSignal.timeout(2000)
    });
    useBackend = response.ok;
  } catch (error) {
    console.warn('Backend not available, using local storage fallback');
    useBackend = false;
  }
  backendChecked = true;
  return useBackend;
};

// Reset backend check (useful for testing)
const resetBackendCheck = () => {
  backendChecked = false;
};

// LocalStorage fallback (existing implementation)
const STORAGE_KEYS = {
  MASTERY: 'telugu_tutor_mastery',
  PROFILE: 'telugu_tutor_profile',
  SESSIONS: 'telugu_tutor_sessions',
  CURRENT_USER: 'telugu_tutor_current_user',
  USERS: 'telugu_tutor_users'
};

const generateUserId = (username) => {
  return `user_${username.toLowerCase().replace(/[^a-z0-9_]/g, '_')}`;
};

const getStorage = (key, defaultVal = []) => {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultVal;
  } catch (error) {
    console.error(`Error reading from localStorage key ${key}:`, error);
    return defaultVal;
  }
};

const setStorage = (key, val) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (error) {
    console.error(`Error writing to localStorage key ${key}:`, error);
  }
};

const removeStorage = (key) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing localStorage key ${key}:`, error);
  }
};

// Simple password hashing for localStorage fallback (not secure, just for consistency)
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(16);
};

// Local storage fallback implementation
const localStorageFallback = {
  auth: {
    me: async () => {
      const currentUser = getStorage(STORAGE_KEYS.CURRENT_USER, null);
      if (!currentUser) {
        return null;
      }
      
      const profiles = getStorage(STORAGE_KEYS.PROFILE, []);
      let profile = profiles.find(p => p.user_id === currentUser.id);
      
      if (!profile) {
        profile = {
          user_id: currentUser.id,
          display_name: currentUser.name,
          total_stars: 0,
          total_practice_time: 0,
          badges_earned: [],
          unlocked_word_puzzles: false,
          last_active: new Date().toISOString()
        };
        profiles.push(profile);
        setStorage(STORAGE_KEYS.PROFILE, profiles);
      }
      
      return { 
        id: currentUser.id, 
        username: currentUser.username, 
        name: currentUser.name,
        isGuest: currentUser.isGuest || false
      };
    },
    
    login: async (username, password) => {
      if (!username || !password) {
        throw new Error('Username and password are required');
      }
      
      const users = getStorage(STORAGE_KEYS.USERS, []);
      const user = users.find(u => u.username.toLowerCase() === username.toLowerCase());
      
      if (!user) {
        throw new Error('Invalid username or password');
      }
      
      if (user.passwordHash !== simpleHash(password)) {
        throw new Error('Invalid username or password');
      }
      
      const userData = { 
        id: user.id, 
        username: user.username, 
        name: user.name,
        email: user.email,
        phone: user.phone
      };
      setStorage(STORAGE_KEYS.CURRENT_USER, userData);
      
      return userData;
    },
    
    register: async (username, password, name, email = null, phone = null) => {
      if (!username || !password || !name) {
        throw new Error('Username, password, and name are required');
      }
      
      // Validate username
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
      if (!usernameRegex.test(username)) {
        throw new Error('Username must be 3-20 characters and contain only letters, numbers, and underscores');
      }
      
      // Validate password
      if (password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }
      
      const users = getStorage(STORAGE_KEYS.USERS, []);
      
      // Check if username already exists
      if (users.find(u => u.username.toLowerCase() === username.toLowerCase())) {
        throw new Error('Username already taken');
      }
      
      const userId = generateUserId(username);
      const user = {
        id: userId,
        username: username,
        name: name.trim(),
        email: email,
        phone: phone,
        passwordHash: simpleHash(password),
        createdAt: new Date().toISOString()
      };
      users.push(user);
      setStorage(STORAGE_KEYS.USERS, users);
      
      // Create profile
      const profiles = getStorage(STORAGE_KEYS.PROFILE, []);
      const profile = {
        user_id: userId,
        display_name: name.trim(),
        total_stars: 0,
        total_practice_time: 0,
        badges_earned: [],
        unlocked_word_puzzles: false,
        last_active: new Date().toISOString()
      };
      profiles.push(profile);
      setStorage(STORAGE_KEYS.PROFILE, profiles);
      
      const userData = { 
        id: userId, 
        username: username, 
        name: name.trim(),
        email: email,
        phone: phone
      };
      setStorage(STORAGE_KEYS.CURRENT_USER, userData);
      
      return userData;
    },
    
    getUsers: async () => {
      const users = getStorage(STORAGE_KEYS.USERS, []);
      return users.map(u => ({ id: u.id, username: u.username, name: u.name }));
    },
    
    logout: async () => {
      removeStorage(STORAGE_KEYS.CURRENT_USER);
      return true;
    },
    
    continueAsGuest: async () => {
      const guestId = `guest_${Date.now()}`;
      const userData = { 
        id: guestId, 
        username: guestId, 
        name: 'Guest Learner', 
        isGuest: true 
      };
      setStorage(STORAGE_KEYS.CURRENT_USER, userData);
      
      const profiles = getStorage(STORAGE_KEYS.PROFILE, []);
      const profile = {
        user_id: guestId,
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
        if (params && params.user_id) {
          return profiles.filter(p => p.user_id === params.user_id);
        }
        // Legacy support for user_email
        if (params && params.user_email) {
          return profiles.filter(p => p.user_id === params.user_email || p.user_email === params.user_email);
        }
        return profiles;
      },
      update: async (id, updates) => {
        const profiles = getStorage(STORAGE_KEYS.PROFILE, []);
        const index = profiles.findIndex(p => p.user_id === id || p.user_email === id);
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
          if (params.user_id) {
            all = all.filter(m => m.user_id === params.user_id);
          }
          // Legacy support for user_email
          if (params.user_email) {
            all = all.filter(m => m.user_id === params.user_email || m.user_email === params.user_email);
          }
          if (params.needs_adaptive_practice) {
            all = all.filter(m => m.needs_adaptive_practice === params.needs_adaptive_practice);
          }
        }
        return all;
      },
      create: async (data) => {
        const all = getStorage(STORAGE_KEYS.MASTERY, []);
        const newItem = { 
          ...data, 
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}` 
        };
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
        return null;
      }
    },
    PracticeSession: {
      create: async (data) => {
        const all = getStorage(STORAGE_KEYS.SESSIONS, []);
        const newItem = { 
          ...data, 
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          created_at: new Date().toISOString()
        };
        all.push(newItem);
        setStorage(STORAGE_KEYS.SESSIONS, all);
        
        // Update practice time in profile
        if (data.response_time) {
          const profiles = getStorage(STORAGE_KEYS.PROFILE, []);
          const userId = data.user_id || data.user_email;
          const profileIndex = profiles.findIndex(p => p.user_id === userId || p.user_email === userId);
          if (profileIndex !== -1) {
            const currentMinutes = profiles[profileIndex].total_practice_time || 0;
            const additionalMinutes = Math.max(data.response_time / 60000, 0.1);
            profiles[profileIndex].total_practice_time = parseFloat((currentMinutes + additionalMinutes).toFixed(2));
            profiles[profileIndex].last_active = new Date().toISOString();
            setStorage(STORAGE_KEYS.PROFILE, profiles);
          }
        }
        
        return newItem;
      }
    }
  }
};

// Backend API implementation
const backendApi = {
  auth: {
    me: async () => {
      const user = await authApi.me();
      if (user) {
        return { 
          id: user.id,
          username: user.username,
          name: user.name, 
          email: user.email,
          phone: user.phone,
          isGuest: user.isGuest 
        };
      }
      return null;
    },
    
    getUsers: async () => {
      return authApi.getUsers();
    },
    
    login: async (username, password) => {
      return authApi.login(username, password);
    },
    
    logout: async () => {
      return authApi.logout();
    },
    
    continueAsGuest: async () => {
      return authApi.continueAsGuest();
    },

    register: async (username, password, name, email, phone) => {
      return authApi.register(username, password, name, email, phone);
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
        try {
          const profile = await profileApi.get();
          return profile ? [profile] : [];
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          return [];
        }
      },
      update: async (id, updates) => {
        return profileApi.update(updates);
      }
    },
    GraphemeMastery: {
      filter: async (params) => {
        try {
          if (params?.needs_adaptive_practice) {
            return masteryApi.getAdaptive();
          }
          return masteryApi.getAll();
        } catch (error) {
          console.error('Failed to fetch mastery:', error);
          return [];
        }
      },
      create: async (data) => {
        return masteryApi.update(data.grapheme_id, data);
      },
      update: async (id, updates) => {
        // The id passed is the mastery record ID, but we need grapheme_id for the API
        // If grapheme_id is in updates, use it; otherwise we need to look it up
        // For now, require grapheme_id in updates or pass it directly
        if (!updates.grapheme_id) {
          console.error('[base44] GraphemeMastery.update called without grapheme_id in updates');
        }
        const graphemeId = updates.grapheme_id;
        if (!graphemeId) {
          throw new Error('grapheme_id is required for mastery update');
        }
        return masteryApi.update(graphemeId, updates);
      }
    },
    PracticeSession: {
      create: async (data) => {
        return practiceApi.create(
          data.grapheme_id,
          data.is_correct,
          data.response_time,
          data.puzzle_type
        );
      }
    }
  }
};

// Dynamic base44 implementation that checks backend availability
const createBase44 = () => {
  return {
    auth: {
      me: async () => {
        await checkBackend();
        return useBackend ? backendApi.auth.me() : localStorageFallback.auth.me();
      },
      getUsers: async () => {
        await checkBackend();
        return useBackend ? backendApi.auth.getUsers() : localStorageFallback.auth.getUsers();
      },
      login: async (username, password) => {
        await checkBackend();
        return useBackend ? backendApi.auth.login(username, password) : localStorageFallback.auth.login(username, password);
      },
      logout: async () => {
        await checkBackend();
        return useBackend ? backendApi.auth.logout() : localStorageFallback.auth.logout();
      },
      continueAsGuest: async () => {
        await checkBackend();
        return useBackend ? backendApi.auth.continueAsGuest() : localStorageFallback.auth.continueAsGuest();
      },
      register: async (username, password, name, email = null, phone = null) => {
        await checkBackend();
        return useBackend 
          ? backendApi.auth.register(username, password, name, email, phone) 
          : localStorageFallback.auth.register(username, password, name, email, phone);
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
          await checkBackend();
          return useBackend ? backendApi.entities.UserProfile.filter(params) : localStorageFallback.entities.UserProfile.filter(params);
        },
        update: async (id, updates) => {
          await checkBackend();
          return useBackend ? backendApi.entities.UserProfile.update(id, updates) : localStorageFallback.entities.UserProfile.update(id, updates);
        }
      },
      GraphemeMastery: {
        filter: async (params) => {
          await checkBackend();
          return useBackend ? backendApi.entities.GraphemeMastery.filter(params) : localStorageFallback.entities.GraphemeMastery.filter(params);
        },
        create: async (data) => {
          await checkBackend();
          return useBackend ? backendApi.entities.GraphemeMastery.create(data) : localStorageFallback.entities.GraphemeMastery.create(data);
        },
        update: async (id, updates) => {
          await checkBackend();
          return useBackend ? backendApi.entities.GraphemeMastery.update(id, updates) : localStorageFallback.entities.GraphemeMastery.update(id, updates);
        }
      },
      PracticeSession: {
        create: async (data) => {
          await checkBackend();
          return useBackend ? backendApi.entities.PracticeSession.create(data) : localStorageFallback.entities.PracticeSession.create(data);
        }
      }
    }
  };
};

export const base44 = createBase44();

// Export backend check reset for testing
export { resetBackendCheck };

// Also export for window global access
if (typeof window !== 'undefined') {
  window.base44 = base44;
}
