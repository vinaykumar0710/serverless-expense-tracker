import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { authService } from '../services/authService';
import { validateEmail } from '../utils/validators';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    if (emailErr) {
      setError(emailErr);
      return;
    }

    setLoading(true);
    try {
      await authService.forgotPassword(email);
      setSent(true);
    } catch {
      setError('Failed to send reset link. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Check Your Email</h1>
        <p className="text-sm text-text-secondary mb-8">
          We've sent a password reset link to <span className="text-text-primary font-medium">{email}</span>
        </p>
        <Link to="/login">
          <Button variant="secondary" fullWidth icon={ArrowLeft}>
            Back to Sign In
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Forgot Password?</h1>
        <p className="text-sm text-text-secondary">
          Enter your email and we'll send you a reset link
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setError('');
          }}
          error={error}
        />

        <Button type="submit" fullWidth loading={loading} size="lg">
          Send Reset Link
        </Button>
      </form>

      <p className="text-center text-sm text-text-secondary mt-6">
        <Link to="/login" className="text-primary hover:text-primary-hover font-medium transition-colors inline-flex items-center gap-1">
          <ArrowLeft className="w-4 h-4" />
          Back to Sign In
        </Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
