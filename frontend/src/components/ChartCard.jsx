import React from 'react';

function ChartCard() {
  return (
    <div className="flex items-center gap-4 p-4 mb-3 rounded-xl bg-gray-700 hover:bg-gray-600 transition shadow-md w-full max-w-md mx-auto">

      {/* Profile Image */}
      <div className="h-14 w-14 rounded-full overflow-hidden border-2 border-cyan-400">
        <img
          src="/profile.jpg" // <-- replace with dynamic user image or default
          alt="Profile"
          className="h-full w-full object-cover"
        />
      </div>

      {/* User Info */}
      <div className="flex flex-col justify-center">
        <h2 className="text-lg font-semibold text-white">hamdan</h2>
        <p className="text-sm text-green-400 flex items-center">
          <span className="mr-1">●</span> Online
        </p>
      </div>
    </div>
  );
}

export default ChartCard;