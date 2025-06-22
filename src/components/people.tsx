import { SquarePen, MessageSquare, Trash, Plus, Star, Calendar, MapPin } from 'lucide-react';
import NavBar from './navBar';
import { useNavigate } from 'react-router-dom';
import { db, type BirthDetail } from '../../db';
import { useEffect, useState } from 'react';

function People() {
    const navigator = useNavigate();
    const [profiles, setProfiles] = useState<BirthDetail[]>([]);

    useEffect(() => {
        const fetchProfiles = async () => {
            try {
                const allProfiles = await db.BirthDetails.toArray();
                setProfiles(allProfiles);
            } catch (error) {
                console.error("Error fetching profiles:", error);
            }
        };

        fetchProfiles();
    },[])

    const handleDelete = async (id: number) => {
        try {
            await db.BirthDetails.delete(id);
            setProfiles(profiles.filter(profile => profile.id !== id));
        } catch (error) {
            console.error("Error deleting profile:", error);
        }
    };

    return (
        <div className="min-h-screen w-full flex flex-col bg-black">
            <NavBar />

            {/* Header Section */}
            <div className='w-full flex flex-col lg:flex-row justify-between items-start lg:items-center px-4 sm:px-8 py-8 lg:py-12 gap-6 lg:gap-0'>
                <div className='flex flex-col gap-3'>
                    <h1 className='text-white font-bold text-3xl sm:text-4xl lg:text-5xl leading-tight'>
                        Cosmic <span className="bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Profiles</span>
                    </h1>
                    <p className='text-gray-300 text-base sm:text-lg leading-relaxed max-w-lg'>
                        Manage your astrological birth profiles and unlock personalized cosmic insights
                    </p>
                </div>
                <button 
                    className='bg-white text-black py-3 px-6 rounded-lg font-semibold hover:bg-black hover:text-white border-2 border-white hover:border-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2 w-full sm:w-auto justify-center' 
                    onClick={() => navigator('/new-profile')}
                >
                    <Plus size={20} /> Add New Profile
                </button>
            </div>

            {/* Profiles Grid */}
            <div className='flex-1 px-4 sm:px-8 pb-16'>
                {profiles.length === 0 ? (
                    // Empty State
                    <div className="flex flex-col items-center justify-center text-center py-16 px-4">
                        <div className="text-6xl mb-6">🌟</div>
                        <h3 className="text-white font-semibold text-xl mb-2">No Profiles Yet</h3>
                        <p className="text-gray-400 mb-8 max-w-md">
                            Create your first cosmic profile to begin your astrological journey and receive personalized insights
                        </p>
                        <button 
                            className='bg-white text-black py-3 px-6 rounded-lg font-semibold hover:bg-black hover:text-white border-2 border-white hover:border-gray-300 transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-2' 
                            onClick={() => navigator('/new-profile')}
                        >
                            <Plus size={20} /> Create Your First Profile
                        </button>
                    </div>
                ) : (
                    <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8'>
                        {profiles.map((profile) => (
                            <div 
                                key={profile.id} 
                                className='flex flex-col gap-6 p-6 bg-black rounded-lg shadow-2xl text-white border border-gray-700 hover:border-gray-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl'
                            >
                                {/* Profile Header */}
                                <div className='flex items-start justify-between'>
                                    <div className='flex items-center gap-3'>
                                        <div className='w-12 h-12 bg-gradient-to-br from-gray-600 to-gray-800 rounded-full flex items-center justify-center'>
                                            <Star className='text-white' size={20} />
                                        </div>
                                        <div>
                                            <h2 className='text-xl font-bold text-white'>{profile.name}</h2>
                                            <p className='text-gray-400 text-sm'>Cosmic Profile</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Profile Details */}
                                <div className='flex flex-col gap-3 bg-gray-900 rounded-lg p-4 border border-gray-800'>
                                    <div className='flex items-start gap-3'>
                                        <Calendar className='text-gray-400 mt-1 flex-shrink-0' size={16} />
                                        <div className='flex flex-col'>
                                            <p className='text-gray-300 text-sm font-medium'>Birth Date & Time</p>
                                            <p className='text-white text-sm'>
                                                {profile.birthDateTime.toLocaleDateString('en-US', { 
                                                    weekday: 'long', 
                                                    year: 'numeric', 
                                                    month: 'long', 
                                                    day: 'numeric' 
                                                })}
                                            </p>
                                            <p className='text-gray-400 text-xs'>
                                                {profile.birthDateTime.toLocaleTimeString('en-US', { 
                                                    hour: '2-digit', 
                                                    minute: '2-digit' 
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    
                                    <div className='flex items-start gap-3'>
                                        <MapPin className='text-gray-400 mt-1 flex-shrink-0' size={16} />
                                        <div className='flex flex-col'>
                                            <p className='text-gray-300 text-sm font-medium'>Birth Location</p>
                                            <p className='text-white text-sm'>{profile.birthPlace}</p>
                                            <p className='text-gray-400 text-xs'>
                                                {profile.latitude.toFixed(4)}°, {profile.longitude.toFixed(4)}°
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Action Buttons */}
                                <div className='flex flex-col gap-3'>
                                    <button 
                                        className='bg-white text-black py-3 px-4 rounded-lg font-semibold hover:bg-black hover:text-white border-2 border-white hover:border-gray-300 transition-all duration-300 flex items-center justify-center gap-2 w-full' 
                                        onClick={() => navigator(`/chat/${profile.id}`)}
                                    >
                                        <MessageSquare size={18} /> Start Cosmic Chat
                                    </button>
                                    
                                    <div className='flex gap-3'>
                                        <button 
                                            className='bg-transparent text-white py-2 px-4 rounded-lg font-medium border-2 border-gray-600 hover:border-white transition-all duration-300 flex items-center justify-center gap-2 flex-1' 
                                            onClick={() => navigator(`/edit-profile/${profile.id}`)}
                                        >
                                            <SquarePen size={16} /> Edit
                                        </button>
                                        <button 
                                            className='bg-transparent text-red-400 py-2 px-4 rounded-lg font-medium border-2 border-red-900 hover:border-red-400 hover:bg-red-900 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 flex-1'
                                            onClick={() => handleDelete(profile.id!)}
                                        >
                                            <Trash size={16} /> Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Footer Section */}
            {profiles.length > 0 && (
                <div className='flex flex-col items-center justify-center gap-4 py-8 px-4 border-t border-gray-800 bg-gradient-to-b from-black to-gray-900'>
                    <div className="flex flex-col items-center gap-2">
                        <p className='text-gray-300 text-sm text-center'>
                            ✨ Ready to explore the cosmos? Create more profiles or chat with your existing ones
                        </p>
                    </div>
                </div>
            )}
        </div>
    )
}

export default People;