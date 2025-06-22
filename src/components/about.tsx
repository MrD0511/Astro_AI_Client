import { Mail, Linkedin, Github } from 'lucide-react';
import NavBar from './navBar';
import creator from '../assets/creator.jpg'; // Assuming you have a creator image
import creator_2 from '../assets/creator_2.jpg'; // Assuming you have a second creator image  
function AboutPage() {
    const handleNavigation = (path: string) => {
        // Navigation would be handled by your router
        console.log(`Navigate to: ${path}`);
    };

    return (
        <div className="min-h-screen w-full flex flex-col bg-black">
            {/* Navigation Header */}
            <NavBar />

            {/* About Content */}
            <div className='flex-1 flex flex-col items-center justify-center px-4 py-16 gap-12'>
                {/* Project Introduction */}
                <div className="max-w-4xl text-center">
                    <h2 className="text-white font-bold text-3xl lg:text-5xl mb-6">
                        About Astro AI
                    </h2>
                    <p className="text-gray-300 text-lg lg:text-xl leading-relaxed mb-8">
                        Welcome to the future of astrology! Astro AI represents the fascinating intersection of ancient cosmic wisdom and cutting-edge artificial intelligence. This innovative platform brings personalized astrological insights directly to your fingertips, combining millennia-old astrological knowledge with modern AI technology.
                    </p>
                    <p className="text-gray-300 text-lg leading-relaxed">
                        Our mission is to make astrology accessible, accurate, and deeply personal. By leveraging advanced AI algorithms, we interpret your unique cosmic blueprint to provide insights that are both meaningful and actionable for your life journey.
                    </p>
                </div>

                {/* Tech Stack */}
                <div className="w-full max-w-4xl">
                    <h3 className="text-white font-bold text-2xl lg:text-3xl text-center mb-8">
                        Built With Cosmic Technology
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="bg-black border border-gray-700 rounded-lg p-4 text-center hover:border-white transition-colors duration-300">
                            <div className="text-2xl mb-2">⚛️</div>
                            <p className="text-white font-semibold">React</p>
                            <p className="text-gray-400 text-sm">Frontend Framework</p>
                        </div>
                        <div className="bg-black border border-gray-700 rounded-lg p-4 text-center hover:border-white transition-colors duration-300">
                            <div className="text-2xl mb-2">⚡</div>
                            <p className="text-white font-semibold">Vite</p>
                            <p className="text-gray-400 text-sm">Build Tool</p>
                        </div>
                        <div className="bg-black border border-gray-700 rounded-lg p-4 text-center hover:border-white transition-colors duration-300">
                            <div className="text-2xl mb-2">🎨</div>
                            <p className="text-white font-semibold">Tailwind</p>
                            <p className="text-gray-400 text-sm">Styling</p>
                        </div>
                        <div className="bg-black border border-gray-700 rounded-lg p-4 text-center hover:border-white transition-colors duration-300">
                            <div className="text-2xl mb-2">🤖</div>
                            <p className="text-white font-semibold">OpenRouter</p>
                            <p className="text-gray-400 text-sm">AI Integration</p>
                        </div>
                    </div>
                </div>

                {/* Call to Action */}
                <div className="text-center">
                    <p className="text-gray-300 text-lg mb-6">
                        Ready to discover what the stars have in store for you?
                    </p>
                    <button 
                        className='bg-white text-black py-3 px-8 rounded-lg font-semibold hover:bg-black hover:text-white border-2 border-white hover:border-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg' 
                        onClick={() => handleNavigation("/dashboard")}
                    >
                        Start Your Cosmic Journey
                    </button>
                </div>

                {/* Profile Section */}
                <div className="flex flex-col lg:flex-row items-center gap-12 max-w-4xl border-t border-gray-800 pt-12">
                    {/* Profile Photo */}
                    <div className="flex justify-center">
                        <div className="w-48 h-48 lg:w-64 lg:h-64 rounded-full bg-gradient-to-r from-white to-gray-400 p-1">
                            <div className="w-full h-full rounded-full bg-gray-800 border-2 border-gray-600 flex items-center justify-center">
                                {/* <div className="text-6xl lg:text-7xl">👨‍💻</div> */}
                                <img 
                                    src={creator} 
                                    alt="Creator" 
                                    className="w-full h-full rounded-full object-cover"
                                />
                            </div>
                        </div>
                    </div>
                    
                    {/* Profile Info */}
                    <div className="flex flex-col items-center lg:items-start text-center lg:text-left gap-6">
                        <div>
                            <h3 className="text-white font-bold text-2xl lg:text-3xl mb-2">
                                Meet the Creator
                            </h3>
                            <h4 className="text-white font-bold text-xl lg:text-2xl mb-2">
                                Dhruv Sharma
                            </h4>
                            <p className="text-gray-300 text-lg mb-4">
                                Backend Engineer
                            </p>
                            <div className="w-16 h-1 bg-gradient-to-r from-white to-gray-400 mx-auto lg:mx-0 mb-4"></div>
                            <p className="text-gray-300 text-base leading-relaxed mb-6 max-w-md">
                                A passionate backend engineer who believes in the fascinating intersection of technology and cosmic wisdom. When not crafting APIs and designing scalable architectures, I explore how ancient wisdom can be enhanced through modern technology.
                            </p>
                        </div>
                        
                        {/* Social Links */}
                        <div className="flex gap-6">
                            <a 
                                href="https://linkedin.com/in/dhruvsharma005" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-3 bg-black border border-gray-700 rounded-lg hover:border-white transition-all duration-300 transform hover:scale-110"
                            >
                                <Linkedin className="text-white" size={24} />
                            </a>
                            <a 
                                href="https://github.com/MrD0511" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="p-3 bg-black border border-gray-700 rounded-lg hover:border-white transition-all duration-300 transform hover:scale-110"
                            >
                                <Github className="text-white" size={24} />
                            </a>
                            <a 
                                href="mailto:sharmadhruv00005@gmail.com" 
                                className="p-3 bg-black border border-gray-700 rounded-lg hover:border-white transition-all duration-300 transform hover:scale-110"
                            >
                                <Mail className="text-white" size={24} />
                            </a>
                        </div>
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
    );
}

export default AboutPage;