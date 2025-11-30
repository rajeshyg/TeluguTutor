import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Users, Sparkles, ArrowRight, Plus, LogIn, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { createPageUrl } from '@/utils';

export default function Login() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [confirmName, setConfirmName] = useState('');
  const [existingUsers, setExistingUsers] = useState([]);
  const [showRegister, setShowRegister] = useState(false);
  const [showNewUser, setShowNewUser] = useState(false);
  const [formError, setFormError] = useState('');
  const [registerStep, setRegisterStep] = useState('form'); // 'form' or 'confirm'
  
  const { loginWithUsername, continueAsGuest, getUsers, register, loading, error } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Load existing users on mount
    const loadUsers = async () => {
      const users = await getUsers();
      setExistingUsers(users);
    };
    loadUsers();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!username.trim() || username.trim().length < 2) {
      setFormError('Please enter your name (at least 2 characters)');
      return;
    }
    
    try {
      await loginWithUsername(username.trim());
      navigate(createPageUrl('Home'));
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError('');
    
    if (!username.trim() || username.trim().length < 2) {
      setFormError('Please enter your name (at least 2 characters)');
      return;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      setFormError('Please enter a valid email address');
      return;
    }

    // Validate phone
    const phoneClean = phone.replace(/[\s\-\(\)]/g, '');
    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phone.trim() || !phoneRegex.test(phoneClean)) {
      setFormError('Please enter a valid phone number (10-15 digits)');
      return;
    }
    
    // Check if user already exists
    const userExists = existingUsers.some(u => u.name.toLowerCase() === username.trim().toLowerCase());
    if (userExists) {
      setFormError('This name is already registered. Please use a different name or login with existing account.');
      return;
    }
    
    if (registerStep === 'form') {
      // Move to confirmation step
      setRegisterStep('confirm');
      return;
    }
    
    // Confirm step - verify name matches
    if (confirmName.trim().toLowerCase() !== username.trim().toLowerCase()) {
      setFormError('Names do not match. Please try again.');
      return;
    }
    
    try {
      await register(email.trim(), phone.trim(), username.trim());
      navigate(createPageUrl('Home'));
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleSelectUser = async (user) => {
    try {
      await loginWithUsername(user.name);
      navigate(createPageUrl('Home'));
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleGuestLogin = async () => {
    try {
      await continueAsGuest();
      navigate(createPageUrl('Home'));
    } catch (err) {
      setFormError(err.message);
    }
  };

  const handleBackToOptions = () => {
    setShowRegister(false);
    setShowNewUser(false);
    setRegisterStep('form');
    setUsername('');
    setEmail('');
    setPhone('');
    setConfirmName('');
    setFormError('');
  };

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
            <span className="text-4xl text-primary-foreground font-bold">అ</span>
          </motion.div>
          <h1 className="text-3xl font-bold text-foreground">Telugu Tutor</h1>
          <p className="text-muted-foreground mt-2">Learn Telugu one letter at a time ✨</p>
        </div>

        <Card className="p-6 bg-card border-border shadow-lg">
          {/* Show existing users OR registration/login form */}
          {!showRegister && !showNewUser && existingUsers.length > 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
                      <span className="font-medium text-foreground">{user.name}</span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </motion.button>
                ))}
              </div>

              <div className="space-y-2">
                <Button
                  className="w-full gap-2"
                  onClick={() => setShowRegister(true)}
                >
                  <Plus className="w-4 h-4" />
                  Add New Learner
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleGuestLogin}
                  disabled={loading}
                >
                  <Sparkles className="w-4 h-4" />
                  Try as Guest
                </Button>
              </div>
            </motion.div>
          ) : null}

          {/* Registration/Login Form */}
          {(showRegister || !showNewUser && existingUsers.length === 0) ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {showRegister && (
                <Button
                  variant="ghost"
                  className="mb-4 -ml-2"
                  onClick={handleBackToOptions}
                >
                  ← Back
                </Button>
              )}
              
              <div className="flex items-center gap-2 mb-4">
                <LogIn className="w-5 h-5 text-primary" />
                <h2 className="font-semibold text-foreground">
                  {showRegister ? 'Register New Learner' : "Let's get started!"}
                </h2>
              </div>

              <form onSubmit={showRegister ? handleRegister : handleLogin} className="space-y-4">
                {/* Name Input */}
                {registerStep === 'form' && (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        What's your name? <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="Enter your name"
                          autoFocus
                          className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground text-lg"
                        />
                      </div>
                    </div>

                    {/* Email Input - only for registration */}
                    {showRegister && (
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Email address <span className="text-destructive">*</span>
                        </label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="your@email.com"
                            className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground text-lg"
                          />
                        </div>
                      </div>
                    )}

                    {/* Phone Input - only for registration */}
                    {showRegister && (
                      <div>
                        <label className="block text-sm font-medium text-foreground mb-1">
                          Phone number <span className="text-destructive">*</span>
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="1234567890"
                            className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground text-lg"
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}

                {/* Confirmation Step */}
                {showRegister && registerStep === 'confirm' && (
                  <>
                    <div className="p-4 bg-secondary/50 border border-border rounded-xl space-y-2">
                      <p className="text-sm text-muted-foreground mb-2">You're registering as:</p>
                      <p className="text-xl font-bold text-foreground">{username}</p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Mail className="w-4 h-4" /> {email}
                      </p>
                      <p className="text-sm text-muted-foreground flex items-center gap-2">
                        <Phone className="w-4 h-4" /> {phone}
                      </p>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-1">
                        Type your name again to confirm
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="text"
                          value={confirmName}
                          onChange={(e) => setConfirmName(e.target.value)}
                          placeholder="Confirm your name"
                          autoFocus
                          className="w-full pl-10 pr-4 py-3 bg-background border border-border rounded-xl focus:ring-2 focus:ring-primary focus:border-transparent text-foreground placeholder:text-muted-foreground text-lg"
                        />
                      </div>
                    </div>
                  </>
                )}

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
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 text-lg gap-2"
                  disabled={loading}
                >
                  {loading ? 'Please wait...' : (
                    <>
                      {showRegister && registerStep === 'form' ? 'Next' : showRegister ? 'Create Account' : 'Start Learning'}
                      {!showRegister && <Sparkles className="w-5 h-5" />}
                    </>
                  )}
                </Button>

                {!showRegister && existingUsers.length > 0 && (
                  <>
                    <div className="relative my-4">
                      <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-border"></div>
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-card text-muted-foreground">or</span>
                      </div>
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      className="w-full gap-2"
                      onClick={() => setShowRegister(false)}
                    >
                      ← Back to Users
                    </Button>
                  </>
                )}
              </form>
            </motion.div>
          ) : null}

          {/* Divider */}
          {!showRegister && existingUsers.length > 0 && (
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-border"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-card text-muted-foreground">or</span>
              </div>
            </div>
          )}

          {/* Guest Login (bottom for existing users) */}
          {!showRegister && existingUsers.length > 0 && (
            <Button
              variant="outline"
              className="w-full gap-2 border-border text-foreground hover:bg-secondary h-11"
              onClick={handleGuestLogin}
              disabled={loading}
            >
              <Sparkles className="w-4 h-4" />
              Try as Guest
            </Button>
          )}
        </Card>

        {/* Footer */}
        {!showRegister && (
          <p className="text-center text-sm text-muted-foreground mt-6">
            Your progress is saved on this device 📱
          </p>
        )}
      </motion.div>
    </div>
  );
}
