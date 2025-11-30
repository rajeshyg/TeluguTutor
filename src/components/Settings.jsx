import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Volume2, VolumeX, Zap, ZapOff, Moon, Sun, Settings as SettingsIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { soundManager } from '@/utils/sounds';

// Settings storage
const SETTINGS_KEY = 'telugu_tutor_settings';

const defaultSettings = {
  soundsEnabled: true,
  animationsEnabled: true,
  theme: 'system' // 'light', 'dark', 'system'
};

const getSettings = () => {
  if (typeof window === 'undefined') return defaultSettings;
  const stored = localStorage.getItem(SETTINGS_KEY);
  return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings;
};

const saveSettings = (settings) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
};

export function useSettings() {
  const [settings, setSettings] = useState(defaultSettings);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const loadedSettings = getSettings();
    setSettings(loadedSettings);
    soundManager.setEnabled(loadedSettings.soundsEnabled);
    setMounted(true);
  }, []);

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    saveSettings(newSettings);
    
    // Apply settings immediately
    if (key === 'soundsEnabled') {
      soundManager.setEnabled(value);
    }
    if (key === 'animationsEnabled') {
      document.documentElement.setAttribute('data-animations', value ? 'on' : 'off');
    }
  };

  return { settings, updateSetting, mounted };
}

export default function Settings() {
  const [isOpen, setIsOpen] = useState(false);
  const { settings, updateSetting, mounted } = useSettings();
  const [theme, setTheme] = React.useState(settings.theme);

  if (!mounted) return null;

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    updateSetting('theme', newTheme);
    
    // Apply theme
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (newTheme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  };

  return (
    <>
      {/* Settings Button */}
      <Button
        variant="ghost"
        size="sm"
        className="h-10 w-10 p-0 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
        title="Settings"
      >
        <SettingsIcon className="w-5 h-5" />
      </Button>

      {/* Settings Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />

            {/* Settings Modal */}
            <motion.div
              className="fixed inset-x-4 top-16 z-50 max-w-md mx-auto sm:inset-x-auto sm:left-auto sm:right-4 sm:top-16"
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ type: 'spring', duration: 0.3 }}
            >
              <Card className="bg-card border-border shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-border">
                  <h2 className="text-lg font-semibold text-foreground">Settings</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => setIsOpen(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
                  {/* Sounds Setting */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {settings.soundsEnabled ? (
                        <Volume2 className="w-5 h-5 text-primary" />
                      ) : (
                        <VolumeX className="w-5 h-5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium text-foreground">Sounds</p>
                        <p className="text-xs text-muted-foreground">
                          {settings.soundsEnabled ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={settings.soundsEnabled ? 'default' : 'outline'}
                      size="sm"
                      className="rounded-full w-12"
                      onClick={() => updateSetting('soundsEnabled', !settings.soundsEnabled)}
                    >
                      {settings.soundsEnabled ? 'ON' : 'OFF'}
                    </Button>
                  </div>

                  <div className="h-px bg-border" />

                  {/* Animations Setting */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {settings.animationsEnabled ? (
                        <Zap className="w-5 h-5 text-primary" />
                      ) : (
                        <ZapOff className="w-5 h-5 text-muted-foreground" />
                      )}
                      <div>
                        <p className="font-medium text-foreground">Animations</p>
                        <p className="text-xs text-muted-foreground">
                          {settings.animationsEnabled ? 'Enabled' : 'Disabled'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant={settings.animationsEnabled ? 'default' : 'outline'}
                      size="sm"
                      className="rounded-full w-12"
                      onClick={() => updateSetting('animationsEnabled', !settings.animationsEnabled)}
                    >
                      {settings.animationsEnabled ? 'ON' : 'OFF'}
                    </Button>
                  </div>

                  <div className="h-px bg-border" />

                  {/* Theme Setting */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <Sun className="w-5 h-5 text-primary" />
                      <p className="font-medium text-foreground">Theme</p>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 'light', label: '☀️ Light', icon: Sun },
                        { value: 'dark', label: '🌙 Dark', icon: Moon },
                        { value: 'system', label: '🖥️ System', icon: SettingsIcon }
                      ].map(option => (
                        <Button
                          key={option.value}
                          variant={theme === option.value ? 'default' : 'outline'}
                          size="sm"
                          className="text-xs"
                          onClick={() => handleThemeChange(option.value)}
                        >
                          {option.label.split(' ')[1]}
                        </Button>
                      ))}
                    </div>
                  </div>

                  <div className="h-px bg-border" />

                  {/* Info */}
                  <div className="bg-secondary/50 border border-border rounded-lg p-3">
                    <p className="text-xs text-muted-foreground">
                      Your settings are saved automatically to your device.
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
