export default function ScrollContainer({ children, className = "" }) {
    return (
      <div className={`h-full overflow-y-auto overflow-x-hidden ${className}`}>
        <div className="min-h-full">
          {children}
        </div>
      </div>
    );
  }