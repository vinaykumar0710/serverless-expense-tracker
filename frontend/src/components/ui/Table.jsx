import { ArrowUpDown } from 'lucide-react';

const Table = ({ columns, data, onSort, sortBy, sortOrder, className = '' }) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      {/* Desktop Table */}
      <table className="w-full hidden md:table">
        <thead>
          <tr className="border-b border-border">
            {columns.map((col) => (
              <th
                key={col.key}
                className={`text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-4 py-3
                  ${col.sortable ? 'cursor-pointer hover:text-text-secondary transition-colors select-none' : ''}`}
                onClick={() => col.sortable && onSort && onSort(col.key)}
              >
                <div className="flex items-center gap-1.5">
                  {col.label}
                  {col.sortable && (
                    <ArrowUpDown className={`w-3 h-3 ${sortBy === col.key ? 'text-primary' : ''}`} />
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.id || rowIndex}
              className="border-b border-border/50 hover:bg-surface-hover/50 transition-colors"
            >
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3.5 text-sm text-text-secondary">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {data.map((row, rowIndex) => (
          <div
            key={row.id || rowIndex}
            className="bg-surface rounded-lg border border-border p-4 space-y-2"
          >
            {columns.map((col) => (
              <div key={col.key} className="flex items-center justify-between">
                <span className="text-xs text-text-muted uppercase">{col.label}</span>
                <span className="text-sm text-text-secondary">
                  {col.render ? col.render(row) : row[col.key]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Table;
