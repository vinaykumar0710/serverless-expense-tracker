import { Loader2 } from 'lucide-react';

const Spinner = ({ size = 'md', className = '' }) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <Loader2 className={`${sizes[size]} text-primary animate-spin`} />
    </div>
  );
};

const PageSpinner = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="w-10 h-10 text-primary animate-spin" />
      <p className="text-sm text-text-muted">Loading...</p>
    </div>
  </div>
);

Spinner.Page = PageSpinner;

export default Spinner;
