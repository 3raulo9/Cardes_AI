import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Semi-transparent background overlay */}
      <div className="absolute inset-0 bg-black opacity-30"></div>
      {/* Centered spinner */}
      <div className="relative flex items-center justify-center">
        {/* Outer dashed ring with slow spin */}
        <div className="w-24 h-24 rounded-full border-8 border-dashed border-accent animate-spin-slow"></div>
        {/* Inner ring with regular spin */}
        <div className="absolute inset-2 rounded-full border-8 border-t-accent border-b-accent border-r-transparent border-l-transparent animate-spin"></div>
      </div>
    </div>
  );
};

export default Loader;
