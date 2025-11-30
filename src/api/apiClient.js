// API configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3003/api';

// Token management
const TOKEN_KEY = 'telugu_tutor_token';

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
};

// API request helper
const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || 'Request failed');
  }

  return response.json();
};

// Auth API
export const authApi = {
  // Register new user with username and password
  register: async (username, password, name, email = null, phone = null) => {
    const data = await apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ username, password, name, email, phone })
    });
    setToken(data.token);
    return data.user;
  },

  // Login with username and password
  login: async (username, password) => {
    const data = await apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password })
    });
    setToken(data.token);
    return data.user;
  },

  // Continue as guest
  continueAsGuest: async () => {
    const data = await apiRequest('/auth/guest', {
      method: 'POST'
    });
    setToken(data.token);
    return data.user;
  },

  // Get current user
  me: async () => {
    const token = getToken();
    if (!token) return null;
    
    try {
      return await apiRequest('/auth/me');
    } catch (error) {
      // Token invalid or expired
      removeToken();
      return null;
    }
  },

  // Get all users (for user selection display)
  getUsers: async () => {
    try {
      return await apiRequest('/auth/users');
    } catch (error) {
      return [];
    }
  },

  // Logout
  logout: async () => {
    try {
      await apiRequest('/auth/logout', { method: 'POST' });
    } finally {
      removeToken();
    }
    return true;
  }
};

// Profile API
export const profileApi = {
  get: async () => {
    return apiRequest('/profile');
  },

  update: async (updates) => {
    return apiRequest('/profile', {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }
};

// Mastery API
export const masteryApi = {
  getAll: async () => {
    return apiRequest('/mastery');
  },

  getAdaptive: async () => {
    return apiRequest('/mastery/adaptive');
  },

  update: async (graphemeId, data) => {
    return apiRequest('/mastery', {
      method: 'POST',
      body: JSON.stringify({ grapheme_id: graphemeId, ...data })
    });
  }
};

// Practice API
export const practiceApi = {
  create: async (graphemeId, isCorrect, responseTime, puzzleType) => {
    return apiRequest('/practice', {
      method: 'POST',
      body: JSON.stringify({
        grapheme_id: graphemeId,
        is_correct: isCorrect,
        response_time: responseTime,
        puzzle_type: puzzleType
      })
    });
  },

  getHistory: async () => {
    return apiRequest('/practice');
  }
};

export { getToken, setToken, removeToken };
