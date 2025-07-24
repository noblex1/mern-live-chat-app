import React from 'react';

const AuthSkeleton = ({ title, text }) => {
  return (
    <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-12">
      <div className="max-w-md text-center text-white">
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[...Array(9)].map((_, i) => (
            <div
              key={i}
              className={`aspect-square rounded-2xl bg-white/10 ${
                i % 2 === 0 ? 'animate-pulse' : ''
              }`}
            />
          ))}
        </div>
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="text-blue-100">{text}</p>
      </div>
    </div>
  );
};

export default AuthSkeleton;