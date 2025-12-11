export default function SidebarHeader({ friendsCount, onClose }) {
    return (
      <div className="flex items-center justify-between p-4 border-b border-[#F68537] bg-[#EAD8A4] sticky top-0 z-10">
        <h2 className="font-bold text-base md:text-lg text-gray-800">
          Friends List {friendsCount > 0 && `(${friendsCount})`}
        </h2>
        <div className="flex items-center gap-2">
          <span className="text-2xl">❤️</span>
          <button
            onClick={onClose}
            className="md:hidden text-gray-800 hover:text-[#F68537] text-xl"
          >
            ✕
          </button>
        </div>
      </div>
    );
  }