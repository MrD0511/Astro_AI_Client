
const NotFound = ({ onNavigateHome, onGoBack }
    : {
        onNavigateHome?: () => void;
        onGoBack?: () => void;
    }
) => {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black px-4">
      {/* Simple scattered stars */}
      <div className="absolute inset-0">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute bg-white rounded-full opacity-20"
            style={{
              width: '2px',
              height: '2px',
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
            }}
          />
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-md">
        {/* 404 */}
        <h1 className="text-8xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
          404
        </h1>

        {/* Message */}
        <div className="flex flex-col gap-4">
          <h2 className="text-white font-bold text-2xl">
            Page Not Found
          </h2>
          <p className="text-gray-300 text-base">
            The page you're looking for has drifted into space.
          </p>
        </div>

        {/* Simple cosmic icon */}
        <div className="text-4xl animate-pulse">
          🌟
        </div>

        {/* Buttons */}
        <div className="flex flex-col items-center justify-center sm:flex-row gap-4 w-full">
          <button 
            className="bg-white text-black py-3 px-6 rounded-lg font-semibold hover:bg-black hover:text-white border-2 border-white hover:border-gray-300 transition-all duration-300"
            onClick={onNavigateHome || (() => window.location.href = "/")}
          >
            Go Home
          </button>
          
          <button 
            className="bg-transparent text-white py-3 px-6 rounded-lg font-semibold border-2 border-gray-600 hover:border-white transition-all duration-300"
            onClick={onGoBack || (() => window.history.back())}
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;