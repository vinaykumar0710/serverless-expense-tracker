import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Bell, Palette, LogOut, Calendar } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { authService } from '../services/authService';
import { validatePassword, validatePasswordMatch } from '../utils/validators';
import { getInitials, formatDate } from '../utils/formatters';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Profile = () => {
  const { user, logout } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [savingPassword, setSavingPassword] = useState(false);

  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    budgetAlerts: true,
    weeklyReport: false,
  });

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    const errors = {};
    const currErr = validatePassword(passwordForm.currentPassword);
    const newErr = validatePassword(passwordForm.newPassword);
    const matchErr = validatePasswordMatch(passwordForm.newPassword, passwordForm.confirmPassword);
    if (currErr) errors.currentPassword = currErr;
    if (newErr) errors.newPassword = newErr;
    if (matchErr) errors.confirmPassword = matchErr;
    setPasswordErrors(errors);

    if (Object.keys(errors).length > 0) return;

    setSavingPassword(true);
    try {
      await authService.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      success('Password changed successfully!');
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch {
      error('Failed to change password.');
    } finally {
      setSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleNotification = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    success('Notification preference updated');
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Profile</h1>
        <p className="text-sm text-text-muted mt-1">Manage your account settings</p>
      </div>

      {/* User Info */}
      <Card>
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary to-cyan-400 flex items-center justify-center text-white font-bold text-2xl">
            {getInitials(user?.name)}
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">{user?.name}</h2>
            <p className="text-sm text-text-secondary">{user?.email}</p>
            <div className="flex items-center gap-1.5 mt-2 text-xs text-text-muted">
              <Calendar className="w-3.5 h-3.5" />
              Member since {formatDate(user?.joinedDate)}
            </div>
          </div>
        </div>
      </Card>

      {/* Change Password */}
      <Card>
        <Card.Header>
          <Card.Title>
            <span className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Change Password
            </span>
          </Card.Title>
        </Card.Header>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Input
            label="Current Password"
            type="password"
            icon={Lock}
            placeholder="Enter current password"
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            error={passwordErrors.currentPassword}
          />
          <div className="grid sm:grid-cols-2 gap-4">
            <Input
              label="New Password"
              type="password"
              icon={Lock}
              placeholder="Min. 8 characters"
              value={passwordForm.newPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
              error={passwordErrors.newPassword}
            />
            <Input
              label="Confirm New Password"
              type="password"
              icon={Lock}
              placeholder="Re-enter new password"
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              error={passwordErrors.confirmPassword}
            />
          </div>
          <div className="flex justify-end">
            <Button type="submit" loading={savingPassword}>
              Update Password
            </Button>
          </div>
        </form>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <Card.Header>
          <Card.Title>
            <span className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notification Preferences
            </span>
          </Card.Title>
        </Card.Header>
        <div className="space-y-4">
          {[
            { key: 'email', label: 'Email Notifications', desc: 'Receive expense summaries via email' },
            { key: 'push', label: 'Push Notifications', desc: 'Get alerts on your device' },
            { key: 'budgetAlerts', label: 'Budget Alerts', desc: 'Warnings when approaching budget limits' },
            { key: 'weeklyReport', label: 'Weekly Report', desc: 'Receive a weekly spending summary' },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between py-2">
              <div>
                <p className="text-sm font-medium text-text-primary">{item.label}</p>
                <p className="text-xs text-text-muted">{item.desc}</p>
              </div>
              <button
                onClick={() => toggleNotification(item.key)}
                className={`relative w-11 h-6 rounded-full transition-colors duration-200 cursor-pointer
                  ${notifications[item.key] ? 'bg-primary' : 'bg-surface-hover'}`}
              >
                <span
                  className={`absolute top-1 left-1 w-4 h-4 rounded-full bg-white transition-transform duration-200
                    ${notifications[item.key] ? 'translate-x-5' : 'translate-x-0'}`}
                />
              </button>
            </div>
          ))}
        </div>
      </Card>

      {/* Theme */}
      <Card>
        <Card.Header>
          <Card.Title>
            <span className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-primary" />
              Theme
            </span>
          </Card.Title>
        </Card.Header>
        <div className="flex items-center justify-between py-2">
          <div>
            <p className="text-sm font-medium text-text-primary">Dark Mode</p>
            <p className="text-xs text-text-muted">Currently using dark theme</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
            Active
          </span>
        </div>
      </Card>

      {/* Logout */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-text-primary">Sign Out</p>
            <p className="text-xs text-text-muted">Log out of your CloudSpend account</p>
          </div>
          <Button variant="danger" icon={LogOut} onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Profile;
