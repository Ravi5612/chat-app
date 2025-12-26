"use client";

import { Phone } from "lucide-react";

export default function Calling() {
  const handleClick = () => {
    alert("Feature coming soon 🚧");
  };

  return (
    <button
      onClick={handleClick}
      title="Audio Call"
      className="p-2 rounded-full hover:bg-gray-100 transition"
    >
      <Phone className="w-5 h-5 text-gray-700" />
    </button>
  );
}
