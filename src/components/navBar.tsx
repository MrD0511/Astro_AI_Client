import { useState } from 'react';

function NavBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Mock navigation functions for demo
  const navigate = (path: string) => {
    console.log(`Navigating to: ${path}`);
    setIsMenuOpen(false);
  };

  return (
    <nav className='w-full bg-black border-b border-gray-800 sticky top-0 z-50 backdrop-blur-sm bg-black/95'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16 sm:h-20'>
          
          {/* Logo Section */}
          <div 
            className='flex items-center gap-3 cursor-pointer group' 
            onClick={() => navigate("/")}
          >
            <h1 className='text-white font-bold text-2xl sm:text-3xl bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent hover:from-gray-200 hover:to-white transition-all duration-300'>
              Astro AI
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className='hidden md:flex items-center gap-6'>
            <div className='flex items-center gap-4'>
              <button 
                className='text-gray-300 hover:text-white transition-colors duration-300 font-medium'
                onClick={() => navigate("/profile")}
              >
                Profiles
              </button>
              <button 
                className='text-gray-300 hover:text-white transition-colors duration-300 font-medium'
                onClick={() => navigate("/about")}
              >
                About
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className='md:hidden'>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className='text-white hover:text-gray-300 transition-colors duration-300 p-2'
              aria-label="Toggle menu"
            >
              <div className='space-y-1'>
                <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></div>
                <div className={`w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></div>
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        <div className={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
          <div className='py-4 space-y-3 border-t border-gray-800'>
            <button 
              className='block w-full text-left text-gray-300 hover:text-white transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-gray-900'
              onClick={() => navigate("/dashboard")}
            >
              Dashboard
            </button>
            <button 
              className='block w-full text-left text-gray-300 hover:text-white transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-gray-900'
              onClick={() => navigate("/profiles")}
            >
              Profiles
            </button>
            <button 
              className='block w-full text-left text-gray-300 hover:text-white transition-colors duration-300 py-2 px-4 rounded-lg hover:bg-gray-900'
              onClick={() => navigate("/about")}
            >
              About
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default NavBar;