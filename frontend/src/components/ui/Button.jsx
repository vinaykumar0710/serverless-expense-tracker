import { Loader2 } from 'lucide-react';

const variants = {
  primary: 'bg-primary hover:bg-primary-hover text-white shadow-lg shadow-primary/20',
  secondary: 'bg-surface hover:bg-surface-hover text-text-primary border border-border',
  danger: 'bg-danger hover:bg-red-600 text-white shadow-lg shadow-danger/20',
  ghost: 'bg-transparent hover:bg-surface-hover text-text-secondary',
  success: 'bg-success hover:bg-green-600 text-white shadow-lg shadow-success/20',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  icon: Icon,
  className = '',
  ...props
}) => {
  return (
    <button
      className={`
        inline-flex items-center justify-center gap-2 font-medium rounded-lg
        transition-all duration-150 cursor-pointer
        disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${sizes[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : Icon ? (
        <Icon className="w-4 h-4" />
      ) : null}
      {children}
    </button>
  );
};

export default Button;
