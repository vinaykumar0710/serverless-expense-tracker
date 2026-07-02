import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail, validatePassword, validateRequired, validatePasswordMatch } from '../utils/validators';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [confirmCode, setConfirmCode] = useState('');
  const [confirmError, setConfirmError] = useState('');
  const { register, confirmSignUp, loading } = useAuth();
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
    const nameErr = validateRequired(form.name, 'Name');
    const emailErr = validateEmail(form.email);
    const passErr = validatePassword(form.password);
    const matchErr = validatePasswordMatch(form.password, form.confirmPassword);
    if (nameErr) newErrors.name = nameErr;
    if (emailErr) newErrors.email = emailErr;
    if (passErr) newErrors.password = passErr;
    if (matchErr) newErrors.confirmPassword = matchErr;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await register({ name: form.name, email: form.email, password: form.password });
      setNeedsConfirmation(true);
    } catch (err) {
      error(err.message || 'Registration failed. Please try again.');
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
      success('Account verified successfully! Please sign in.');
      navigate('/login');
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
            We've sent a verification code to <span className="text-text-primary font-medium">{form.email}</span>
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
            Verify Account
          </Button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          Already verified?{' '}
          <Link to="/login" className="text-primary hover:text-primary-hover font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Create Account</h1>
        <p className="text-sm text-text-secondary">Start tracking your expenses in seconds</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Full Name"
          name="name"
          icon={User}
          placeholder="John Doe"
          value={form.name}
          onChange={handleChange}
          error={errors.name}
        />

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
          placeholder="Min. 8 characters"
          value={form.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Input
          label="Confirm Password"
          name="confirmPassword"
          type="password"
          icon={Lock}
          placeholder="Re-enter your password"
          value={form.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
        />

        <Button type="submit" fullWidth loading={loading} size="lg">
          Create Account
        </Button>
      </form>

      <p className="text-center text-sm text-text-secondary mt-6">
        Already have an account?{' '}
        <Link to="/login" className="text-primary hover:text-primary-hover font-medium transition-colors">
          Sign in
        </Link>
      </p>
    </div>
  );
};

export default Register;
