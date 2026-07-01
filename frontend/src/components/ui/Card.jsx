const Card = ({ children, className = '', hover = false, padding = true, ...props }) => {
  return (
    <div
      className={`
        bg-surface rounded-xl border border-border
        ${padding ? 'p-6' : ''}
        ${hover ? 'hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all duration-200' : ''}
        ${className}
      `}
      {...props}
    >
      {children}
    </div>
  );
};

const CardHeader = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between mb-4 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-lg font-semibold text-text-primary ${className}`}>{children}</h3>
);

Card.Header = CardHeader;
Card.Title = CardTitle;

export default Card;
