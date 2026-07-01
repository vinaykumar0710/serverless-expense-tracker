import { Link } from 'react-router-dom';
import { CloudOff, ArrowLeft } from 'lucide-react';
import Button from '../components/ui/Button';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4 text-center">
      <div className="animate-pulse-soft mb-8">
        <CloudOff className="w-24 h-24 text-text-muted/30 mx-auto" />
      </div>
      <h1 className="text-7xl font-extrabold text-text-primary mb-2">404</h1>
      <h2 className="text-xl font-semibold text-text-secondary mb-4">Page Not Found</h2>
      <p className="text-text-muted max-w-md mb-8">
        The page you're looking for doesn't exist or has been moved. Let's get you back on track.
      </p>
      <Link to="/dashboard">
        <Button icon={ArrowLeft} size="lg">
          Back to Dashboard
        </Button>
      </Link>
    </div>
  );
};

export default NotFound;
