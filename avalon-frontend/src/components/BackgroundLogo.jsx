import React from 'react';

const BackgroundLogo = () => {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none select-none">

      <div className="absolute inset-0" style={{ backgroundColor: '#05070D' }} />

      <style>{`
        @keyframes pulse-shield {
          0%, 100% { opacity: 0.06; }
          50% { opacity: 0.1; }
        }
        .shield-main { animation: pulse-shield 4s ease-in-out infinite; }
      `}</style>

      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          width="600"
          height="600"
          viewBox="0 0 600 600"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shield-main"
        >
          {/* Bouclier principal */}
          <path
            d="M300 80 L480 160 L480 320 C480 430 400 510 300 550 C200 510 120 430 120 320 L120 160 Z"
            stroke="#3B82F6"
            strokeWidth="2.5"
            fill="none"
          />

          {/* Bouclier intérieur */}
          <path
            d="M300 115 L445 183 L445 320 C445 410 378 480 300 515 C222 480 155 410 155 320 L155 183 Z"
            stroke="#60A5FA"
            strokeWidth="1.5"
            fill="none"
          />

          {/* Verrou au centre */}
          <rect x="268" y="295" width="64" height="52" rx="6" stroke="#3B82F6" strokeWidth="2" fill="none" />
          <path d="M280 295 L280 270 C280 245 320 245 320 270 L320 295" stroke="#3B82F6" strokeWidth="2" fill="none" />
          <circle cx="300" cy="321" r="9" stroke="#60A5FA" strokeWidth="1.5" fill="none" />
          <line x1="300" y1="330" x2="300" y2="342" stroke="#60A5FA" strokeWidth="1.5" />

          {/* Lignes de circuit autour */}
          <line x1="40" y1="180" x2="120" y2="180" stroke="#3B82F6" strokeWidth="1" opacity="0.6" />
          <line x1="40" y1="320" x2="120" y2="320" stroke="#3B82F6" strokeWidth="1" opacity="0.6" />
          <line x1="40" y1="460" x2="120" y2="430" stroke="#3B82F6" strokeWidth="1" opacity="0.6" />
          <line x1="40" y1="180" x2="40" y2="460" stroke="#3B82F6" strokeWidth="1" opacity="0.6" />

          <line x1="560" y1="180" x2="480" y2="180" stroke="#3B82F6" strokeWidth="1" opacity="0.6" />
          <line x1="560" y1="320" x2="480" y2="320" stroke="#3B82F6" strokeWidth="1" opacity="0.6" />
          <line x1="560" y1="460" x2="480" y2="430" stroke="#3B82F6" strokeWidth="1" opacity="0.6" />
          <line x1="560" y1="180" x2="560" y2="460" stroke="#3B82F6" strokeWidth="1" opacity="0.6" />

          <line x1="180" y1="40" x2="180" y2="120" stroke="#3B82F6" strokeWidth="1" opacity="0.6" />
          <line x1="300" y1="20" x2="300" y2="80" stroke="#3B82F6" strokeWidth="1" opacity="0.6" />
          <line x1="420" y1="40" x2="420" y2="120" stroke="#3B82F6" strokeWidth="1" opacity="0.6" />
          <line x1="180" y1="40" x2="420" y2="40" stroke="#3B82F6" strokeWidth="1" opacity="0.6" />

          <line x1="180" y1="560" x2="210" y2="490" stroke="#3B82F6" strokeWidth="1" opacity="0.6" />
          <line x1="300" y1="580" x2="300" y2="550" stroke="#3B82F6" strokeWidth="1" opacity="0.6" />
          <line x1="420" y1="560" x2="390" y2="490" stroke="#3B82F6" strokeWidth="1" opacity="0.6" />
          <line x1="180" y1="560" x2="420" y2="560" stroke="#3B82F6" strokeWidth="1" opacity="0.6" />

          {/* Nœuds */}
          <circle cx="40" cy="180" r="4" fill="#3B82F6" opacity="0.8" />
          <circle cx="40" cy="320" r="4" fill="#3B82F6" opacity="0.8" />
          <circle cx="40" cy="460" r="4" fill="#3B82F6" opacity="0.8" />
          <circle cx="560" cy="180" r="4" fill="#3B82F6" opacity="0.8" />
          <circle cx="560" cy="320" r="4" fill="#3B82F6" opacity="0.8" />
          <circle cx="560" cy="460" r="4" fill="#3B82F6" opacity="0.8" />
          <circle cx="180" cy="40" r="4" fill="#3B82F6" opacity="0.8" />
          <circle cx="300" cy="20" r="5" fill="#60A5FA" opacity="0.8" />
          <circle cx="420" cy="40" r="4" fill="#3B82F6" opacity="0.8" />
          <circle cx="180" cy="560" r="4" fill="#3B82F6" opacity="0.8" />
          <circle cx="300" cy="580" r="5" fill="#60A5FA" opacity="0.8" />
          <circle cx="420" cy="560" r="4" fill="#3B82F6" opacity="0.8" />

          {/* Composants carrés */}
          <rect x="20" y="140" width="20" height="20" stroke="#60A5FA" strokeWidth="1" fill="none" opacity="0.6" />
          <rect x="20" y="300" width="20" height="20" stroke="#60A5FA" strokeWidth="1" fill="none" opacity="0.6" />
          <rect x="560" y="140" width="20" height="20" stroke="#60A5FA" strokeWidth="1" fill="none" opacity="0.6" />
          <rect x="560" y="300" width="20" height="20" stroke="#60A5FA" strokeWidth="1" fill="none" opacity="0.6" />
        </svg>
      </div>

      {/* Lueurs bleues */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] blur-[200px] rounded-full" style={{ backgroundColor: 'rgba(59,130,246,0.07)' }} />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] blur-[180px] rounded-full" style={{ backgroundColor: 'rgba(34,211,238,0.04)' }} />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] blur-[150px] rounded-full" style={{ backgroundColor: 'rgba(59,130,246,0.04)' }} />

    </div>
  );
};

export default BackgroundLogo;