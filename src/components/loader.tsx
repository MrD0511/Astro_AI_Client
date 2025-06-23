
const Loader = () => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black relative overflow-hidden">
      {/* Animated background stars */}
      <div className="absolute inset-0">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-30"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDelay: Math.random() * 3 + 's',
            }}
          />
        ))}
      </div>

      {/* Main loader content */}
      <div className="relative z-10 flex flex-col items-center gap-8">
        {/* Cosmic spinner */}
        <div className="relative">
          {/* Outer rotating ring */}
          <div className="w-24 h-24 border-4 border-gray-600 border-t-white rounded-full animate-spin"></div>
          
          {/* Inner pulsing core */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 bg-gradient-to-r from-white to-gray-400 rounded-full animate-pulse opacity-80"></div>
          </div>
          
          {/* Orbiting dots */}
          <div className="absolute inset-0 animate-spin" style={{ animationDuration: '3s', animationDirection: 'reverse' }}>
            <div className="absolute w-2 h-2 bg-white rounded-full" style={{ top: '10%', left: '50%', transform: 'translateX(-50%)' }}></div>
            <div className="absolute w-1.5 h-1.5 bg-gray-300 rounded-full" style={{ bottom: '10%', right: '50%', transform: 'translateX(50%)' }}></div>
            <div className="absolute w-1 h-1 bg-gray-400 rounded-full" style={{ left: '10%', top: '50%', transform: 'translateY(-50%)' }}></div>
          </div>
        </div>

        {/* Brand and loading text */}
        <div className="flex flex-col items-center gap-4 text-center">
          <h1 className="text-white font-bold text-3xl sm:text-4xl">
            Astro <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">AI</span>
          </h1>
          
          <div className="flex items-center gap-2">
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-gray-300 text-lg ml-2 animate-pulse">Reading the cosmos...</span>
          </div>

          <p className="text-gray-400 text-sm max-w-md leading-relaxed">
            Connecting to the universal energy field and preparing your personalized cosmic insights
          </p>
        </div>

        {/* Mystical elements */}
        <div className="flex gap-6 text-2xl">
          <span className="animate-pulse" style={{ animationDelay: '0s' }}>🔮</span>
          <span className="animate-pulse" style={{ animationDelay: '0.5s' }}>🌟</span>
          <span className="animate-pulse" style={{ animationDelay: '1s' }}>💫</span>
          <span className="animate-pulse" style={{ animationDelay: '1.5s' }}>✨</span>
        </div>
      </div>

      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40 pointer-events-none"></div>
      
      {/* Subtle animated border effect */}
      <div className="absolute inset-0 border border-gray-800 opacity-20 animate-pulse"></div>
    </div>
  );
};

export default Loader;