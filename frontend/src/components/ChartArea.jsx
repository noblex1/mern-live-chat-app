import React from 'react';

function ChartArea() {
  return (
    <div className="flex-1 h-screen overflow-y-auto bg-gray-800 p-6 rounded-lg text-white">
      <div className="h-full flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold">Welcome to HackChat 👋</h1>
        <p className="text-gray-400 mt-2">
          This is where the main chat area or dashboard content goes.
        </p>
      </div>
    </div>
  );
}

export default ChartArea;