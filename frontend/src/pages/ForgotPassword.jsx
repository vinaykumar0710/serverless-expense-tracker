import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, ArrowLeft, CheckCircle, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { validateEmail, validatePassword, validatePasswordMatch } from '../utils/validators';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';

const ForgotPassword = () => {
  const [step, setStep] = useState('email'); // 'email' | 'reset' | 'done'
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { forgotPassword, resetPassword } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const handleSendCode = async (e) => {
    e.preventDefault();
    const emailErr = validateEmail(email);
    if (emailErr) {
      setErrors({ email: emailErr });
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      setStep('reset');
      setErrors({});
    } catch (err) {
      setErrors({ email: err.message || 'Failed to send reset code. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    const newErrors = {};
    if (!code.trim()) newErrors.code = 'Verification code is required.';
    const passErr = validatePassword(newPassword);
    if (passErr) newErrors.newPassword = passErr;
    const matchErr = validatePasswordMatch(newPassword, confirmPassword);
    if (matchErr) newErrors.confirmPassword = matchErr;
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    setLoading(true);
    try {
      await resetPassword(email, code, newPassword);
      setStep('done');
    } catch (err) {
      error(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'done') {
    return (
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-success" />
        </div>
        <h1 className="text-2xl font-bold text-text-primary mb-2">Password Reset Complete</h1>
        <p className="text-sm text-text-secondary mb-8">
          Your password has been reset successfully. You can now sign in with your new password.
        </p>
        <Link to="/login">
          <Button variant="secondary" fullWidth icon={ArrowLeft}>
            Back to Sign In
          </Button>
        </Link>
      </div>
    );
  }

  if (step === 'reset') {
    return (
      <div>
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">Reset Your Password</h1>
          <p className="text-sm text-text-secondary">
            Enter the code sent to <span className="text-text-primary font-medium">{email}</span> and your new password
          </p>
        </div>

        <form onSubmit={handleResetPassword} className="space-y-5">
          <Input
            label="Verification Code"
            icon={ShieldCheck}
            placeholder="Enter 6-digit code"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              if (errors.code) setErrors({ ...errors, code: '' });
            }}
            error={errors.code}
          />

          <Input
            label="New Password"
            type="password"
            icon={Lock}
            placeholder="Min. 8 characters"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              if (errors.newPassword) setErrors({ ...errors, newPassword: '' });
            }}
            error={errors.newPassword}
          />

          <Input
            label="Confirm New Password"
            type="password"
            icon={Lock}
            placeholder="Re-enter new password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
            }}
            error={errors.confirmPassword}
          />

          <Button type="submit" fullWidth loading={loading} size="lg">
            Reset Password
          </Button>
        </form>

        <p className="text-center text-sm text-text-secondary mt-6">
          <button
            onClick={() => { setStep('email'); setErrors({}); }}
            className="text-primary hover:text-primary-hover font-medium transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Try a different email
          </button>
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Forgot Password?</h1>
        <p className="text-sm text-text-secondary">
          Enter your email and we'll send you a reset code
        </p>
      </div>

      <form onSubmit={handleSendCode} className="space-y-5">
        <Input
          label="Email Address"
          type="email"
          icon={Mail}
          placeholder="you@example.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (errors.email) setErrors({ ...errors, email: '' });
          }}
          error={errors.email}
        />

        <Button type="submit" fullWidth loading={loading} size="lg">
          Send Reset Code
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
