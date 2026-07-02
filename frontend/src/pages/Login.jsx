import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail, validatePassword } from '../utils/validators';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [confirmCode, setConfirmCode] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const { login, confirmSignUp, loading } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    const emailErr = validateEmail(form.email);
    const passErr = validatePassword(form.password);
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await login(form.email, form.password);
      success('Welcome back! You are now logged in.');
      navigate('/dashboard');
    } catch (err) {
      if (err.code === 'UserNotConfirmedException') {
        setNeedsConfirmation(true);
      } else {
        error(err.message || 'Invalid credentials. Please try again.');
      }
    }
  };

  const handleConfirm = async (e) => {
    e.preventDefault();
    if (!confirmCode.trim()) {
      setConfirmError('Please enter the verification code.');
      return;
    }

    try {
      await confirmSignUp(form.email, confirmCode);
      success('Email verified! Please sign in.');
      setNeedsConfirmation(false);
      setConfirmCode('');
    } catch (err) {
      setConfirmError(err.message || 'Verification failed. Please try again.');
    }
  };

  if (needsConfirmation) {
    return (
      <div>
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Verify Your Email</h1>
          <p className="text-sm text-text-secondary">
            Enter the verification code sent to <span className="text-text-primary font-medium">{form.email}</span>
          </p>
        </div>

        <form onSubmit={handleConfirm} className="space-y-5">
          <Input
            label="Verification Code"
            icon={ShieldCheck}
            placeholder="Enter 6-digit code"
            value={confirmCode}
            onChange={(e) => {
              setConfirmCode(e.target.value);
              setConfirmError('');
            }}
            error={confirmError}
          />

          <Button type="submit" fullWidth loading={loading} size="lg">
            Verify & Continue
          </Button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          <button
            onClick={() => setNeedsConfirmation(false)}
            className="text-primary hover:text-primary-hover font-medium transition-colors cursor-pointer"
          >
            Back to Sign In
          </button>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Welcome Back</h1>
        <p className="text-sm text-text-secondary">Sign in to continue tracking your expenses</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email Address"
          name="email"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          value={form.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          icon={Lock}
          placeholder="Enter your password"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-border bg-bg text-primary accent-primary" />
            <span className="text-sm text-text-secondary">Remember me</span>
          </label>
          <Link to="/forgot-password" className="text-sm text-primary hover:text-primary-hover transition-colors">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" fullWidth loading={loading} size="lg">
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-text-secondary mt-6">
        Don't have an account?{' '}
        <Link to="/register" className="text-primary hover:text-primary-hover font-medium transition-colors">
          Create one
        </Link>
      </p>
    </div>
  );
};

export default Login;
