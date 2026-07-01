import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  BarChart3,
  Wallet,
  User,
  Settings,
  LogOut,
  Menu,
  X,
  Cloud,
  Bell,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getInitials } from '../utils/formatters';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/expenses', label: 'Expenses', icon: Receipt },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/budget', label: 'Budget', icon: Wallet },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="w-9 h-9 rounded-lg bg-primary/15 flex items-center justify-center">
          <Cloud className="w-5 h-5 text-primary" />
        </div>
        <span className="text-lg font-bold text-text-primary tracking-tight">CloudSpend</span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
              ${isActive
                ? 'bg-primary/10 text-primary shadow-sm'
                : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Section */}
      <div className="px-3 py-4 border-t border-border">
        <div className="flex items-center gap-3 px-3 py-2 mb-2">
          <div className="w-9 h-9 rounded-full bg-primary/15 flex items-center justify-center text-primary font-semibold text-sm">
            {getInitials(user?.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-text-primary truncate">{user?.name}</p>
            <p className="text-xs text-text-muted truncate">{user?.email}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium
            text-text-secondary hover:bg-danger/10 hover:text-danger transition-all duration-150 cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-bg">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col bg-surface border-r border-border z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm animate-fade-in"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 w-64 bg-surface border-r border-border animate-slide-in-right z-50">
            <SidebarContent />
          </aside>
        </div>
      )}

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-surface/80 backdrop-blur-xl border-b border-border">
          <div className="flex items-center justify-between px-4 lg:px-8 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="flex-1" />

            <div className="flex items-center gap-3">
              <button className="relative p-2 rounded-lg text-text-secondary hover:bg-surface-hover transition-colors cursor-pointer">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger" />
              </button>
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center text-primary font-semibold text-xs lg:hidden">
                {getInitials(user?.name)}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
