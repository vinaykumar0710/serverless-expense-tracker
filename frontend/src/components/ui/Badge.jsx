const Badge = ({ children, color = '#3B82F6', className = '' }) => {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${className}`}
      style={{
        backgroundColor: `${color}15`,
        color: color,
        border: `1px solid ${color}30`,
      }}
    >
      {children}
    </span>
  );
};

export default Badge;
