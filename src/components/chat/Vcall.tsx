"use client";

import { Video } from "lucide-react";

export default function VCall() {
  const handleClick = () => {
    alert("Feature coming soon 🚧");
  };

  return (
    <button
      onClick={handleClick}
      title="Video Call"
      className="p-2 rounded-full hover:bg-gray-100 transition"
    >
      <Video className="w-5 h-5 text-gray-700" />
    </button>
  );
}
