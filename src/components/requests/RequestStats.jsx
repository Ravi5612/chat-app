export default function RequestStats({ counts, type = 'sent' }) {
    const stats = [
      { label: 'Pending', count: counts.pending, color: 'blue' },
      { label: 'Accepted', count: counts.accepted, color: 'green' },
      { label: 'Rejected', count: counts.rejected, color: 'red' },
      { label: 'Total', count: counts.total, color: 'gray' }
    ];
  
    const colorClasses = {
      blue: 'bg-blue-50 border-blue-200 text-blue-600',
      green: 'bg-green-50 border-green-200 text-green-600',
      red: 'bg-red-50 border-red-200 text-red-600',
      yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
      gray: 'bg-gray-50 border-gray-200 text-gray-600'
    };
  
    const textColorClasses = {
      blue: 'text-blue-800',
      green: 'text-green-800',
      red: 'text-red-800',
      yellow: 'text-yellow-800',
      gray: 'text-gray-800'
    };
  
    return (
      <div className="grid grid-cols-4 gap-3 md:gap-4">
        {stats.map(({ label, count, color }) => (
          <div 
            key={label}
            className={`${colorClasses[color]} rounded-lg p-3 text-center border-2`}
          >
            <div className={`text-2xl md:text-3xl font-bold ${colorClasses[color].split(' ')[2]}`}>
              {count}
            </div>
            <div className={`text-xs md:text-sm ${textColorClasses[color]} mt-1`}>
              {label}
            </div>
          </div>
        ))}
      </div>
    );
  }