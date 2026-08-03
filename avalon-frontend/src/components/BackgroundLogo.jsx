import React from 'react';

const BackgroundLogo = () => {
  return (
    <div className="fixed inset-0 bg-[#0A0E1A] overflow-hidden pointer-events-none z-0">
      <img
        src="/logo-icon.png"
        alt=""
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] md:w-[1300px] lg:w-[1600px] object-contain opacity-[0.06] select-none"
      />
    </div>
  );
};
export default BackgroundLogo;