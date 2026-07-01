const Select = ({ label, options, error, className = '', id, ...props }) => {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-text-secondary">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`
          w-full bg-bg border border-border rounded-lg text-text-primary
          px-4 py-2.5 text-sm appearance-none cursor-pointer
          transition-colors duration-150
          focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none
          ${error ? 'border-danger focus:border-danger focus:ring-danger' : ''}
        `}
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%2394A3B8' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 0.75rem center',
          backgroundSize: '1.25rem',
        }}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
};

export default Select;
