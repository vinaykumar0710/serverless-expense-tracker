import { Outlet, Link } from 'react-router-dom';
import { Cloud } from 'lucide-react';

const AuthLayout = () => {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/3 rounded-full blur-3xl" />

      {/* Logo */}
      <Link to="/" className="flex items-center gap-3 mb-8 relative z-10">
        <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
          <Cloud className="w-6 h-6 text-primary" />
        </div>
        <span className="text-2xl font-bold text-text-primary tracking-tight">CloudSpend</span>
      </Link>

      {/* Auth Card */}
      <div className="w-full max-w-md relative z-10 animate-slide-up">
        <div className="bg-surface rounded-2xl border border-border p-8 shadow-xl shadow-black/20">
          <Outlet />
        </div>
      </div>

      {/* Footer */}
      <p className="mt-8 text-xs text-text-muted relative z-10">
        © {new Date().getFullYear()} CloudSpend. All rights reserved.
      </p>
    </div>
  );
};

export default AuthLayout;
