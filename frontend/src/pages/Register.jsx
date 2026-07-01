import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail, validatePassword, validateRequired, validatePasswordMatch } from '../utils/validators';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [errors, setErrors] = useState({});
  const { register, loading } = useAuth();
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
      success('Account created successfully! Welcome to CloudSpend.');
      navigate('/dashboard');
    } catch (err) {
      error('Registration failed. Please try again.');
    }
  };

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
