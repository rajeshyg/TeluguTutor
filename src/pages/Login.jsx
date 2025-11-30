import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, Sparkles, ArrowRight, LogIn, Lock, Eye, EyeOff, Mail, Phone, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { createPageUrl } from '@/utils';

const MIN_USERNAME_LENGTH = 3;
const MAX_USERNAME_LENGTH = 20;
const MIN_PASSWORD_LENGTH = 6;
const MIN_NAME_LENGTH = 2;

export default function Login() {
  // Form state
  const [mode, setMode] = useState('select'); // 'select', 'login', 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // UI state
  const [existingUsers, setExistingUsers] = useState([]);
  const [formError, setFormError] = useState('');
  
  const { login, register, continueAsGuest, getUsers, loading, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    const users = await getUsers();
    setExistingUsers(users);
  };

  const validateUsername = (value) => {
    if (!value || value.length < MIN_USERNAME_LENGTH) {
      return `Username must be at least ${MIN_USERNAME_LENGTH} characters`;
    }
    if (value.length > MAX_USERNAME_LENGTH) {
      return `Username must be at most ${MAX_USERNAME_LENGTH} characters`;
    }
    if (!/^[a-zA-Z0-9_]+$/.test(value)) {
      return 'Username can only contain letters, numbers, and underscores';
    }
    return null;
  };

  const validatePassword = (value) => {
    if (!value || value.length < MIN_PASSWORD_LENGTH) {
      return `Password must be at least ${MIN_PASSWORD_LENGTH} characters`;
    }
    return null;
  };

  const validateName = (value) => {
    if (!value || value.trim().length < MIN_NAME_LENGTH) {
      return `Name must be at least ${MIN_NAME_LENGTH} characters`;
    }
    return null;
  };

  const validateEmail = (value) => {
    if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      return 'Please enter a valid email address';
    }
    return null;
  };

  const validatePhone = (value) => {
    if (value) {
      const cleanPhone = value.replace(/[\s\-\(\)]/g, '');
      if (!/^[0-9]{10,15}$/.test(cleanPhone)) {
        return 'Please enter a valid phone number (10-15 digits)';
      }
    }
    return null;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError('');
    
    const usernameError = validateUsername(username);
    if (usernameError) {
      setFormError(usernameError);
      return;
    }
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      setFormError(passwordError);
      return;
    }
    
    try {
      await login(username, password);
      navigate(createPageUrl('Home'));
    } catch (err) {
      setFormError(err.message || 'Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError('');
    
    // Validate all fields
    const usernameError = validateUsername(username);
    if (usernameError) {
      setFormError(usernameError);
      return;
    }
    
    const passwordError = validatePassword(password);
    if (passwordError) {
      setFormError(passwordError);
      return;
    }
    
    if (password !== confirmPassword) {
      setFormError('Passwords do not match');
      return;
    }
    
    const nameError = validateName(displayName);
    if (nameError) {
      setFormError(nameError);
      return;
    }
    
    const emailError = validateEmail(email);
    if (emailError) {
      setFormError(emailError);
      return;
    }
    
    const phoneError = validatePhone(phone);
    if (phoneError) {
      setFormError(phoneError);
      return;
    }
    
    try {
      await register(username, password, displayName.trim(), email || null, phone || null);
      navigate(createPageUrl('Home'));
    } catch (err) {
      setFormError(err.message || 'Registration failed');
    }
  };

  const handleSelectUser = (user) => {
    setUsername(user.username);
    setMode('login');
    setFormError('');
  };

  const handleGuestLogin = async () => {
    setFormError('');
    try {
      await continueAsGuest();
      navigate(createPageUrl('Home'));
    } catch (err) {
      setFormError(err.message || 'Guest login failed');
    }
  };

  const resetForm = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setDisplayName('');
    setEmail('');
    setPhone('');
    setShowPassword(false);
    setShowConfirmPassword(false);
    setFormError('');
  };

  const handleModeChange = (newMode) => {
    resetForm();
    setMode(newMode);
  };

  const renderUserSelection = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      {existingUsers.length > 0 && (
        <>
          <div className="flex items-center gap-2 mb-4">
            <Users className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Welcome back!</h2>
          </div>
          
          <div className="space-y-2 mb-4">
            {existingUsers.map((user, index) => (
              <motion.button
                key={user.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => handleSelectUser(user)}
                disabled={loading}
                className="w-full flex items-center justify-between p-4 bg-secondary/50 hover:bg-secondary border border-border rounded-xl transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <span className="font-medium text-foreground block">{user.name}</span>
                    <span className="text-sm text-muted-foreground">@{user.username}</span>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </motion.button>
            ))}
          </div>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-muted-foreground">or</span>
            </div>
          </div>
        </>
      )}

      <div className="space-y-3">
        <Button
          className="w-full gap-2"
          onClick={() => handleModeChange('register')}
        >
          <UserPlus className="w-4 h-4" />
          Create New Account
        </Button>
        
        <Button
          variant="outline"
          className="w-full gap-2"
          onClick={() => handleModeChange('login')}
        >
          <LogIn className="w-4 h-4" />
          Login with Username
        </Button>
        
        <Button
          variant="ghost"
          className="w-full gap-2 text-muted-foreground hover:text-foreground"
          onClick={handleGuestLogin}
          disabled={loading}
        >
          <Sparkles className="w-4 h-4" />
          Try as Guest
        </Button>
      </div>
    </motion.div>
  );

  const renderLoginForm = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Button
        variant="ghost"
        className="mb-4 -ml-2"
        onClick={() => handleModeChange('select')}
      >
         Back
      </Button>
      
      <div className="flex items-center gap-2 mb-4">
        <LogIn className="w-5 h-5 text-primary" />
        <h2 className="font-semibold text-foreground">Login</h2>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Username <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase())}
              placeholder="Enter your username"
              autoFocus
              autoComplete="username"
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Password <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete="current-password"
              className="w-full pl-10 pr-12 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {(formError || error) && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
          >
            <p className="text-sm text-destructive">{formError || error}</p>
          </motion.div>
        )}

        <Button
          type="submit"
          className="w-full h-12 text-lg gap-2"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => handleModeChange('register')}
            className="text-primary hover:underline font-medium"
          >
            Register
          </button>
        </p>
      </form>
    </motion.div>
  );

  const renderRegisterForm = () => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <Button
        variant="ghost"
        className="mb-4 -ml-2"
        onClick={() => handleModeChange('select')}
      >
         Back
      </Button>
      
      <div className="flex items-center gap-2 mb-4">
        <UserPlus className="w-5 h-5 text-primary" />
        <h2 className="font-semibold text-foreground">Create Account</h2>
      </div>

      <form onSubmit={handleRegister} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Username <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
              placeholder="Choose a username"
              autoFocus
              autoComplete="username"
              maxLength={MAX_USERNAME_LENGTH}
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {MIN_USERNAME_LENGTH}-{MAX_USERNAME_LENGTH} characters, letters, numbers, underscores only
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Display Name <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your display name"
              autoComplete="name"
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Password <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              autoComplete="new-password"
              className="w-full pl-10 pr-12 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            At least {MIN_PASSWORD_LENGTH} characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Confirm Password <span className="text-destructive">*</span>
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              autoComplete="new-password"
              className="w-full pl-10 pr-12 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-border"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-card text-muted-foreground">Optional</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Email
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              autoComplete="email"
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Phone
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="1234567890"
              autoComplete="tel"
              className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {(formError || error) && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg"
          >
            <p className="text-sm text-destructive">{formError || error}</p>
          </motion.div>
        )}

        <Button
          type="submit"
          className="w-full h-12 text-lg gap-2"
          disabled={loading}
        >
          {loading ? 'Creating account...' : 'Create Account'}
        </Button>

        <p className="text-center text-sm text-muted-foreground">
          Already have an account?{' '}
          <button
            type="button"
            onClick={() => handleModeChange('login')}
            className="text-primary hover:underline font-medium"
          >
            Login
          </button>
        </p>
      </form>
    </motion.div>
  );

  return (
    <div className="w-full h-full flex items-center justify-center bg-background transition-colors duration-300 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md py-8"
      >
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <motion.div 
            className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-2xl mb-4 shadow-lg"
            animate={{ rotate: [0, -5, 5, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          >
            <span className="text-4xl text-primary-foreground font-bold">?</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground">Telugu Tutor</h1>
          <p className="text-muted-foreground mt-2">Learn Telugu one letter at a time </p>
        </div>

        <Card className="p-6 bg-card border-border shadow-lg">
          <AnimatePresence mode="wait">
            {mode === 'select' && renderUserSelection()}
            {mode === 'login' && renderLoginForm()}
            {mode === 'register' && renderRegisterForm()}
          </AnimatePresence>
        </Card>

        {/* Footer */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          Your progress is saved securely 
        </p>
      </motion.div>
    </div>
  );
}
