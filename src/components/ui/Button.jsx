export default function Button({ 
    children, 
    onClick, 
    variant = 'primary', 
    size = 'medium',
    disabled = false,
    className = '',
    type = 'button',
    icon = null
  }) {
    
    const baseStyles = 'font-semibold rounded-lg transition-colors flex items-center justify-center gap-2';
    
    const variants = {
      primary: 'bg-[#F68537] text-white hover:bg-[#EAD8A4] hover:text-gray-800',
      secondary: 'bg-gray-200 text-gray-800 hover:bg-gray-300',
      success: 'bg-green-500 text-white hover:bg-green-600',
      danger: 'bg-red-500 text-white hover:bg-red-600',
      warning: 'bg-yellow-500 text-white hover:bg-yellow-600',
      info: 'bg-blue-500 text-white hover:bg-blue-600',
      outline: 'bg-white border-2 border-[#F68537] text-[#F68537] hover:bg-[#F68537] hover:text-white',
      ghost: 'bg-transparent text-gray-700 hover:bg-gray-100',
      light: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
      'success-light': 'bg-green-100 text-green-600 hover:bg-green-200',
      'danger-light': 'bg-red-100 text-red-600 hover:bg-red-200',
      'warning-light': 'bg-yellow-100 text-yellow-600 hover:bg-yellow-200',
      'info-light': 'bg-blue-100 text-blue-600 hover:bg-blue-200',
    };
    
    const sizes = {
      small: 'px-3 py-1.5 text-xs md:text-sm',
      medium: 'px-4 py-2 text-sm md:text-base',
      large: 'px-6 py-3 text-base md:text-lg',
    };
    
    const disabledStyles = disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer';
    
    return (
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${disabledStyles} ${className}`}
      >
        {icon && <span>{icon}</span>}
        {children}
      </button>
    );
  }