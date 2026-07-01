import { createContext, useContext, useState, useCallback } from 'react';

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    currency: 'USD',
    dateFormat: 'MM/DD/YYYY',
    notifications: {
      email: true,
      push: true,
      budgetAlerts: true,
      weeklyReport: false,
    },
  });

  const updateSettings = useCallback((updates) => {
    setSettings((prev) => ({ ...prev, ...updates }));
  }, []);

  const updateNotifications = useCallback((updates) => {
    setSettings((prev) => ({
      ...prev,
      notifications: { ...prev.notifications, ...updates },
    }));
  }, []);

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, updateNotifications }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within a ThemeProvider');
  return context;
};
