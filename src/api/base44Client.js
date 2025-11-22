import { TELUGU_GRAPHEMES } from '../data/teluguGraphemes';

const STORAGE_KEYS = {
  MASTERY: 'telugu_tutor_mastery',
  PROFILE: 'telugu_tutor_profile',
  SESSIONS: 'telugu_tutor_sessions'
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

const defaultBase44 = {
  auth: {
    me: async () => {
      const email = 'test@example.com';
      // Ensure profile exists
      const profiles = getStorage(STORAGE_KEYS.PROFILE, []);
      let profile = profiles.find(p => p.user_email === email);
      
      if (!profile) {
        profile = {
          user_email: email,
          display_name: 'Test User',
          total_stars: 0,
          total_practice_time: 0,
          badges_earned: [],
          unlocked_word_puzzles: false,
          last_active: new Date().toISOString()
        };
        profiles.push(profile);
        setStorage(STORAGE_KEYS.PROFILE, profiles);
      }
      
      return { email, name: profile.display_name };
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
