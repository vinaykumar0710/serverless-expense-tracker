import { useState } from 'react';
import { Globe, Calendar, Bell, Shield } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';

const Settings = () => {
  const { settings, updateSettings, updateNotifications } = useTheme();
  const { success } = useToast();

  const handleCurrencyChange = (e) => {
    updateSettings({ currency: e.target.value });
    success('Currency updated');
  };

  const handleDateFormatChange = (e) => {
    updateSettings({ dateFormat: e.target.value });
    success('Date format updated');
  };

  const toggleNotification = (key) => {
    updateNotifications({ [key]: !settings.notifications[key] });
    success('Notification preference updated');
  };

  const currencyOptions = [
    { value: 'USD', label: 'USD ($) — US Dollar' },
    { value: 'EUR', label: 'EUR (€) — Euro' },
    { value: 'GBP', label: 'GBP (£) — British Pound' },
    { value: 'INR', label: 'INR (₹) — Indian Rupee' },
    { value: 'JPY', label: 'JPY (¥) — Japanese Yen' },
    { value: 'CAD', label: 'CAD (C$) — Canadian Dollar' },
    { value: 'AUD', label: 'AUD (A$) — Australian Dollar' },
  ];

  const dateFormatOptions = [
    { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
    { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
    { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
  ];

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Settings</h1>
        <p className="text-sm text-text-muted mt-1">Customize your CloudSpend experience</p>
      </div>

      {/* Currency */}
      <Card>
        <Card.Header>
          <Card.Title>
            <span className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Currency
            </span>
          </Card.Title>
        </Card.Header>
        <div className="max-w-sm">
          <Select
            label="Default Currency"
            value={settings.currency}
            onChange={handleCurrencyChange}
            options={currencyOptions}
          />
          <p className="text-xs text-text-muted mt-2">
            This will be used across all expense displays and reports.
          </p>
        </div>
      </Card>

      {/* Date Format */}
      <Card>
        <Card.Header>
          <Card.Title>
            <span className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Date Format
            </span>
          </Card.Title>
        </Card.Header>
        <div className="max-w-sm">
          <Select
            label="Display Format"
            value={settings.dateFormat}
            onChange={handleDateFormatChange}
            options={dateFormatOptions}
          />
          <p className="text-xs text-text-muted mt-2">
            Choose how dates appear throughout the application.
          </p>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <Card.Header>
          <Card.Title>
            <span className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notifications
            </span>
          </Card.Title>
        </Card.Header>
        <div className="space-y-4">
          {[
            { key: 'email', label: 'Email Notifications', desc: 'Receive important updates via email' },
            { key: 'push', label: 'Push Notifications', desc: 'Browser push notifications for alerts' },
            { key: 'budgetAlerts', label: 'Budget Alerts', desc: 'Get notified when approaching budget limits' },
            { key: 'weeklyReport', label: 'Weekly Digest', desc: 'A summary of your spending each week' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-text-primary">{item.label}</p>
                <p className="text-xs text-text-muted">{item.desc}</p>
              </div>
              <button
                onClick={() => toggleNotification(item.key)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer
                  ${settings.notifications[item.key] ? 'bg-primary' : 'bg-surface-hover'}`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200
                    ${settings.notifications[item.key] ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Account */}
      <Card>
        <Card.Header>
          <Card.Title>
            <span className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Account
            </span>
          </Card.Title>
        </Card.Header>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-text-primary">Export Data</p>
              <p className="text-xs text-text-muted">Download all your expense data</p>
            </div>
            <button className="px-4 py-2 rounded-lg text-sm font-medium text-text-secondary bg-surface-hover hover:bg-surface-active transition-colors cursor-pointer">
              Export
            </button>
          </div>
          <div className="border-t border-border pt-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-danger">Delete Account</p>
                <p className="text-xs text-text-muted">Permanently delete your account and all data</p>
              </div>
              <button className="px-4 py-2 rounded-lg text-sm font-medium text-danger bg-danger/10 hover:bg-danger/20 border border-danger/30 transition-colors cursor-pointer">
                Delete
              </button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;
