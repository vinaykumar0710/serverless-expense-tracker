import { Search, X } from 'lucide-react';

const SearchBar = ({ value, onChange, placeholder = 'Search...', className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-bg border border-border rounded-lg text-text-primary placeholder-text-muted
          pl-10 pr-10 py-2.5 text-sm transition-colors duration-150
          focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
      />
      {value && (
        <button
          onClick={() => onChange('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded text-text-muted
            hover:text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchBar;
