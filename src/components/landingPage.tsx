import NavBar from "./navBar"
import astro_illu from '../assets/astro-illu.svg'
import { useNavigate } from "react-router-dom";

function LandingPage() {

    const navigate = useNavigate();

    return (
        <div className="min-h-screen w-full flex flex-col bg-black">
            <NavBar />

            {/* Hero Section */}
            <div className='flex-1 flex flex-col lg:flex-row items-center justify-center lg:justify-evenly w-full px-4 py-8 lg:py-16 gap-8 lg:gap-0'>
              <div className="order-1 lg:order-1 flex justify-center">
                <img 
                  src={astro_illu} 
                  alt="Astro Illustration" 
                  className='w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 animate-pulse hover:animate-none transition-all duration-300' 
                />
              </div>
              
              <div className='order-1 lg:order-2 flex flex-col justify-center items-center lg:items-start gap-6 text-center lg:text-left max-w-md lg:max-w-lg'>
                <h1 className='text-white font-bold text-3xl sm:text-4xl lg:text-6xl leading-tight'>
                  Your AI <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Fortune Teller</span>
                </h1>
                <p className='text-gray-300 text-base sm:text-lg lg:text-xl leading-relaxed'>
                  Discover your cosmic destiny with personalized astrological insights powered by advanced AI
                </p>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <button 
                    className='bg-white text-black py-3 px-6 rounded-lg font-semibold hover:bg-black hover:text-white border-2 border-white hover:border-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg' 
                    onClick={() => navigate("/profiles")}
                  >
                    Get Started
                  </button>
                  <button 
                    className='bg-transparent text-white py-3 px-6 rounded-lg font-semibold border-2 border-gray-600 hover:border-white transition-all duration-300 transform hover:scale-105'
                    onClick={() => navigate("/about")}
                  >
                    Learn More
                  </button>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className='flex flex-col items-center justify-center gap-8 px-4 py-16 bg-gradient-to-b from-black to-gray-900'>
              <h2 className='text-white font-bold text-2xl sm:text-3xl lg:text-4xl text-center mb-8'>
                Unlock Your Cosmic Potential
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
                <div className="bg-black border border-gray-700 rounded-lg p-6 hover:border-white transition-colors duration-300">
                  <div className="text-3xl mb-4">🔮</div>
                  <h3 className="text-white font-semibold text-xl mb-2">Personalized Readings</h3>
                  <p className="text-gray-300">Get accurate birth chart analysis based on your exact birth details</p>
                </div>
                
                <div className="bg-black border border-gray-700 rounded-lg p-6 hover:border-white transition-colors duration-300">
                  <div className="text-3xl mb-4">🌟</div>
                  <h3 className="text-white font-semibold text-xl mb-2">AI-Powered Insights</h3>
                  <p className="text-gray-300">Advanced artificial intelligence interprets your cosmic patterns</p>
                </div>
                
                <div className="bg-black border border-gray-700 rounded-lg p-6 hover:border-white transition-colors duration-300">
                  <div className="text-3xl mb-4">💫</div>
                  <h3 className="text-white font-semibold text-xl mb-2">Future Guidance</h3>
                  <p className="text-gray-300">Discover what the stars reveal about your future path</p>
                </div>
              </div>
            </div>

            {/* Footer */}
            <footer className='flex flex-col items-center justify-center gap-4 py-8 px-4 border-t border-gray-800'>
              <div className="flex flex-col items-center gap-2">
                <h3 className='text-white font-bold text-2xl'>Astro AI</h3>
                <p className='text-gray-400 text-sm text-center max-w-md'>
                  Your personal AI astrologer providing cosmic insights and guidance for your life journey
                </p>
              </div>
              
              <div className="flex flex-wrap justify-center gap-6 text-xs text-gray-500">
                <span>Powered by OpenRouter</span>
                <span>•</span>
                <span>Built with React & Vite</span>
                <span>•</span>
                <span>Version 1.0.0</span>
              </div>
              
              <p className='text-gray-600 text-xs text-center'>
                Made with ❤️ for cosmic explorers
              </p>
            </footer>
        </div>
    )
}

export default LandingPage