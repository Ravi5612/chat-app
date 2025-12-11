export default function NavButton({ icon, label, onClick, badge = null, badgeColor = 'red' }) {
    const badgeColorClasses = {
      red: 'bg-red-500',
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
    };
  
    return (
      <button 
        onClick={onClick}
        className="flex items-center gap-2 bg-[#F68537] hover:bg-[#EAD8A4] hover:text-gray-800 px-3 py-1.5 rounded-lg transition-colors font-medium relative"
      >
        <span>{icon}</span>
        <span>{label}</span>
        {badge !== null && badge > 0 && (
          <span className={`absolute -top-1 -right-1 ${badgeColorClasses[badgeColor]} text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center`}>
            {badge > 9 ? '9+' : badge}
          </span>
        )}
      </button>
    );
  }