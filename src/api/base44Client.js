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

// LocalStorage fallback (existing implementation)
const STORAGE_KEYS = {
  MASTERY: 'telugu_tutor_mastery',
  PROFILE: 'telugu_tutor_profile',
  SESSIONS: 'telugu_tutor_sessions',
  CURRENT_USER: 'telugu_tutor_current_user',
  USERS: 'telugu_tutor_users'
};

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

// Local storage fallback implementation
const localStorageFallback = {
  auth: {
    me: async () => {
      const currentUser = getStorage(STORAGE_KEYS.CURRENT_USER, null);
      if (!currentUser) {
        return null;
      }
      
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
    
    loginWithUsername: async (username) => {
      if (!username || username.trim().length < 2) {
        throw new Error('Please enter a name (at least 2 characters)');
      }
      
      const trimmedName = username.trim();
      const userId = generateUserId(trimmedName);
      const users = getStorage(STORAGE_KEYS.USERS, []);
      
      let user = users.find(u => u.id === userId || u.name?.toLowerCase() === trimmedName.toLowerCase());
      
      if (!user) {
        user = {
          id: userId,
          email: userId,
          name: trimmedName,
          createdAt: new Date().toISOString()
        };
        users.push(user);
        setStorage(STORAGE_KEYS.USERS, users);
        
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
      
      const userData = { email: user.email || user.id, name: user.name };
      setStorage(STORAGE_KEYS.CURRENT_USER, userData);
      
      return userData;
    },
    
    getUsers: async () => {
      const users = getStorage(STORAGE_KEYS.USERS, []);
      return users.map(u => ({ id: u.id || u.email, name: u.name }));
    },
    
    signup: async (email, password, displayName) => {
      return localStorageFallback.auth.loginWithUsername(displayName || email);
    },
    
    login: async (email, password) => {
      const users = getStorage(STORAGE_KEYS.USERS, []);
      const user = users.find(u => u.email === email);
      
      if (user) {
        const userData = { email: user.email, name: user.name };
        setStorage(STORAGE_KEYS.CURRENT_USER, userData);
        return userData;
      }
      
      return localStorageFallback.auth.loginWithUsername(email);
    },
    
    logout: async () => {
      removeStorage(STORAGE_KEYS.CURRENT_USER);
      return true;
    },
    
    continueAsGuest: async () => {
      const guestEmail = `guest_${Date.now()}@telugututor.local`;
      const userData = { email: guestEmail, name: 'Guest Learner', isGuest: true };
      setStorage(STORAGE_KEYS.CURRENT_USER, userData);
      
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
    },

    register: async (email, phone, name, password) => {
      const userId = generateUserId(name);
      const users = getStorage(STORAGE_KEYS.USERS, []);
      
      if (users.find(u => u.email === email)) {
        throw new Error('Email already registered');
      }

      const user = {
        id: userId,
        email: email,
        phone: phone,
        name: name,
        createdAt: new Date().toISOString()
      };
      users.push(user);
      setStorage(STORAGE_KEYS.USERS, users);
      
      const profiles = getStorage(STORAGE_KEYS.PROFILE, []);
      const profile = {
        user_email: email,
        display_name: name,
        total_stars: 0,
        total_practice_time: 0,
        badges_earned: [],
        unlocked_word_puzzles: false,
        last_active: new Date().toISOString()
      };
      profiles.push(profile);
      setStorage(STORAGE_KEYS.PROFILE, profiles);
      
      const userData = { email, phone, name };
      setStorage(STORAGE_KEYS.CURRENT_USER, userData);
      
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
        const profiles = getStorage(STORAGE_KEYS.PROFILE, []);
        const index = profiles.findIndex(p => p.user_email === id);
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
        
        if (data.response_time) {
          const profiles = getStorage(STORAGE_KEYS.PROFILE, []);
          const profileIndex = profiles.findIndex(p => p.user_email === data.user_email);
          if (profileIndex !== -1) {
            const currentMinutes = profiles[profileIndex].total_practice_time || 0;
            profiles[profileIndex].total_practice_time = parseFloat((currentMinutes + 0.1).toFixed(1));
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
        return { email: user.email, name: user.name, isGuest: user.isGuest };
      }
      return null;
    },
    
    loginWithUsername: async (username) => {
      return authApi.loginWithUsername(username);
    },
    
    getUsers: async () => {
      return authApi.getUsers();
    },
    
    signup: async (email, password, displayName) => {
      return authApi.register(email, '0000000000', displayName, password);
    },
    
    login: async (email, password) => {
      return authApi.login(email, password);
    },
    
    logout: async () => {
      return authApi.logout();
    },
    
    continueAsGuest: async () => {
      return authApi.continueAsGuest();
    },

    register: async (email, phone, name, password) => {
      return authApi.register(email, phone, name, password);
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
        } catch {
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
        } catch {
          return [];
        }
      },
      create: async (data) => {
        return masteryApi.update(data.grapheme_id, data);
      },
      update: async (id, updates) => {
        const graphemeId = updates.grapheme_id || id;
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
      loginWithUsername: async (username) => {
        await checkBackend();
        return useBackend ? backendApi.auth.loginWithUsername(username) : localStorageFallback.auth.loginWithUsername(username);
      },
      getUsers: async () => {
        await checkBackend();
        return useBackend ? backendApi.auth.getUsers() : localStorageFallback.auth.getUsers();
      },
      signup: async (email, password, displayName) => {
        await checkBackend();
        return useBackend ? backendApi.auth.signup(email, password, displayName) : localStorageFallback.auth.signup(email, password, displayName);
      },
      login: async (email, password) => {
        await checkBackend();
        return useBackend ? backendApi.auth.login(email, password) : localStorageFallback.auth.login(email, password);
      },
      logout: async () => {
        await checkBackend();
        return useBackend ? backendApi.auth.logout() : localStorageFallback.auth.logout();
      },
      continueAsGuest: async () => {
        await checkBackend();
        return useBackend ? backendApi.auth.continueAsGuest() : localStorageFallback.auth.continueAsGuest();
      },
      register: async (email, phone, name, password) => {
        await checkBackend();
        return useBackend ? backendApi.auth.register(email, phone, name, password) : localStorageFallback.auth.register(email, phone, name, password);
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

// Also export for window global access
if (typeof window !== 'undefined') {
  window.base44 = base44;
}
