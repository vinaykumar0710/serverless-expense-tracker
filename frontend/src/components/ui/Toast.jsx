import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

const icons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

const colors = {
  success: 'border-success/30 bg-success/10 text-success',
  error: 'border-danger/30 bg-danger/10 text-danger',
  warning: 'border-warning/30 bg-warning/10 text-warning',
  info: 'border-info/30 bg-info/10 text-info',
};

const ToastItem = ({ toast, onRemove }) => {
  const Icon = icons[toast.type] || Info;

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg backdrop-blur-sm animate-toast-in ${colors[toast.type]}`}
    >
      <Icon className="w-5 h-5 flex-shrink-0" />
      <p className="text-sm font-medium text-text-primary flex-1">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="p-0.5 rounded hover:bg-white/10 transition-colors flex-shrink-0 cursor-pointer"
      >
        <X className="w-4 h-4 text-text-muted" />
      </button>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onRemove={removeToast} />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
