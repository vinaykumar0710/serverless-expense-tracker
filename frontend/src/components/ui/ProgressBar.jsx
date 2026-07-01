const ProgressBar = ({
  value = 0,
  max = 100,
  showLabel = true,
  size = 'md',
  className = '',
}) => {
  const percent = Math.min(Math.round((value / max) * 100), 150);
  const clampedWidth = Math.min(percent, 100);

  const getColor = () => {
    if (percent >= 100) return 'bg-danger';
    if (percent >= 80) return 'bg-warning';
    return 'bg-primary';
  };

  const getGlow = () => {
    if (percent >= 100) return 'shadow-danger/30';
    if (percent >= 80) return 'shadow-warning/30';
    return 'shadow-primary/30';
  };

  const heights = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  return (
    <div className={className}>
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-text-secondary">Progress</span>
          <span className={`text-sm font-semibold ${
            percent >= 100 ? 'text-danger' : percent >= 80 ? 'text-warning' : 'text-primary'
          }`}>
            {percent}%
          </span>
        </div>
      )}
      <div className={`w-full bg-bg rounded-full overflow-hidden ${heights[size]}`}>
        <div
          className={`${heights[size]} rounded-full ${getColor()} shadow-lg ${getGlow()} transition-all duration-700 ease-out`}
          style={{ width: `${clampedWidth}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
