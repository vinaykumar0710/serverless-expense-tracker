import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Input = ({
  label,
  type = 'text',
  error,
  icon: Icon,
  className = '',
  id,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
        )}
        <input
          id={inputId}
          type={isPassword && showPassword ? 'text' : type}
          className={`
            w-full bg-bg border border-border rounded-lg text-text-primary placeholder-text-muted
            transition-colors duration-150
            focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none
            ${Icon ? 'pl-10' : 'pl-4'} ${isPassword ? 'pr-10' : 'pr-4'} py-2.5 text-sm
            ${error ? 'border-danger focus:border-danger focus:ring-danger' : ''}
          `}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-secondary transition-colors cursor-pointer"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        )}
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
};

export default Input;
