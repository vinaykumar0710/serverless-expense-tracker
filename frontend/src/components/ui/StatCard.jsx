import { TrendingUp, TrendingDown } from 'lucide-react';

const StatCard = ({
  title,
  value,
  icon: Icon,
  trend,
  trendLabel,
  iconColor = '#3B82F6',
  className = '',
}) => {
  const isPositive = trend > 0;
  const isNeutral = trend === undefined || trend === null;

  return (
    <div className={`bg-surface rounded-xl border border-border p-5 hover:border-primary/20 transition-all duration-200 ${className}`}>
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${iconColor}15` }}
        >
          <Icon className="w-5 h-5" style={{ color: iconColor }} />
        </div>
        {!isNeutral && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
            isPositive
              ? 'text-success bg-success/10'
              : 'text-danger bg-danger/10'
          }`}>
            {isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <p className="text-2xl font-bold text-text-primary mb-0.5">{value}</p>
      <p className="text-xs text-text-muted">
        {trendLabel || title}
      </p>
    </div>
  );
};

export default StatCard;
