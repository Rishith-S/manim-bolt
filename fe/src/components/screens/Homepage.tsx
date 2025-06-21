import { ArrowUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Loader from '../utils/Loader';
import { toast } from 'react-hot-toast';

interface Video {
    videoId: number;
    createdAt: Date;
}

const Homepage: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
    const [brightness, setBrightness] = useState(25);
    const texts = [
        "Hello World!",
        "Welcome to React",
        "This is amazing!",
        "Let's build something cool",
        "Typewriter effects are fun!"
    ];
    const navigate = useNavigate();
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [loading, setLoading] = useState(false);

    // Brightness animation effect
    useEffect(() => {
        const timer = setTimeout(() => {
            setBrightness(100);
        }, 100);
        return () => clearTimeout(timer);
    }, []);

    const [userHistory, setUserHistory] = useState<Video[]>([]);

    useEffect(() => {
        const getUserHistory = async () => {
            try {
                setLoading(true);
                const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/v1/chatHistory/getUserHistory`, {
                    userId: localStorage.getItem('email'),
                }, { withCredentials: true });
                setUserHistory((res.data as { userHistory: Video[] }).userHistory);
            } catch (error) {
                console.error('Error fetching user history:', error);   
            } finally {
                setLoading(false);
            }
        }
        getUserHistory();
    }, []);

    useEffect(() => {
        const currentFullText = texts[currentTextIndex];

        const timeout = setTimeout(() => {
            if (!isDeleting) {
                // Typing forward
                if (currentText.length < currentFullText.length) {
                    setCurrentText(currentFullText.substring(0, currentText.length + 1));
                } else {
                    // Finished typing, wait then start deleting
                    setTimeout(() => setIsDeleting(true), 1500);
                }
            } else {
                // Backspacing
                if (currentText.length > 0) {
                    setCurrentText(currentText.substring(0, currentText.length - 1));
                } else {
                    // Finished deleting, move to next text
                    setIsDeleting(false);
                    setCurrentTextIndex((prev) => (prev + 1) % texts.length);
                }
            }
        }, 20); // Faster backspacing

        return () => clearTimeout(timeout);
    }, [currentText, isDeleting, currentTextIndex, texts]);

    const handlePromptSubmit = async () => {
        if (inputValue.length > 0) {
            try {
                localStorage.setItem("prompt", inputValue);
                const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/v1/execute/getVideoId`, {
                    userId: localStorage.getItem('email'),
                }, { 
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });
                
                // Type assertion to handle the response data
                const responseData = res.data as { videoId: number };
                navigate(`/videos/${responseData.videoId}`);
            } catch (error: any) {
                if (error.response?.status === 403) {
                    // Handle video limit reached error
                    const errorMessage = error.response.data?.message || 'You can only create up to 5 videos.';
                    toast.error(errorMessage);
                } else {
                    console.error('Error creating video:', error);
                    toast.error('An error occurred while creating the video. Please try again.');
                }
            }
        }
    }

    if(loading){
        return (
            <div className='w-screen min-h-full z-10 overflow-y-auto bg-gray-50'>
                <Loader />
            </div>
        )
    }

    return (
        <div className='w-screen min-h-full z-10 overflow-y-auto bg-gray-50'>
            <div
                className="absolute h-[100%] w-[100%] z-20 pointer-events-none"
                style={{
                    backgroundImage: 'url("/src/assets/noise.png")',
                    backgroundRepeat: 'repeat',
                    opacity: 0.35
                }}
            />
            <div
                className="absolute left-1/2 h-[100%] w-full -translate-x-1/2 z-10 pointer-events-none transition-all duration-1000 ease-in-out"
                style={{
                    backgroundImage: 'url("/src/assets/gradient-optimized.svg")',
                    backgroundRepeat: 'repeat',
                    backgroundPosition: 'center top',
                    filter: `brightness(${brightness}%)`
                }}
            />
            <main className="relative z-30 flex flex-col items-center justify-center px-6">
                <div className="text-center mt-24 max-w-4xl">
                    <h1 className="text-2xl md:text-5xl font-bold mb-4 text-white">
                        Build something <span className='font-playful text-blue-100'>ClipCraft</span>
                    </h1>
                    <p className="text-lg mb-4 md:text-xl text-white">
                        Idea to video in seconds, with your personal <span className='underline font-playful text-yellow-100'>manim</span> video generator
                    </p>
                </div>

                {/* Input Section */}
                <div className="w-full max-w-4xl mt-10">
                    <div className="bg-gray-50/95 rounded-xl p-6">
                        <div className="mb-6 text-white">
                            <textarea
                                name="promptbox"
                                id="prompt"
                                placeholder={`Ask ClipCraft to create a ${currentText}`}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="text-white resize-none w-full bg-transparent text-lg placeholder-gray-400 focus:outline-none py-2 min-h-[100px]"
                            />
                        </div>

                        <div className="flex justify-end items-center">
                            <button onClick={handlePromptSubmit} className={`w-8 h-8  rounded-full flex items-center justify-center ${inputValue.length > 0 ? "bg-white hover:bg-blue-200" : "bg-gray-400/85 cursor-not-allowed"}`}>
                                <ArrowUp className="w-4 h-4" strokeWidth={4} />
                            </button>
                        </div>
                    </div>
                </div>
                <div className='w-full max-w-4xl mt-10 mb-6'>
                    <div className="bg-gray-50/95 rounded-xl p-6">
                        <div className='flex items-center gap-3 mb-6'>
                            <div className='font-bold rounded-md px-3 text-white bg-orange-600 p-2 text-lg'>R</div>
                            <h2 className='text-white text-xl font-semibold'>Rishi's Work</h2>
                            <span className='text-sm text-gray-400 font-medium bg-gray-25 px-2 py-1 rounded-full'>{userHistory.length} videos</span>
                        </div>

                        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'>
                            <div 
                                onClick={() => {
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                    setInputValue('');
                                    const textarea = document.getElementById('prompt') as HTMLTextAreaElement;
                                    if (textarea) {
                                        textarea.focus();
                                    }
                                }} 
                                className='bg-gray-25 flex flex-col items-center justify-center rounded-lg h-40 cursor-pointer transition-colors hover:bg-gray-75 border-2 border-dashed border-gray-400 hover:border-gray-300'
                            >
                                <div className='text-4xl text-gray-400'>+</div>
                                <p className='text-md text-gray-300 mt-2'>Create new video</p>
                            </div>

                            {userHistory.map((video) => (
                                <div onClick={()=>{navigate(`/videos/${video.videoId}`)}} key={video.videoId} className='bg-gray-25 rounded-lg h-40 flex flex-col justify-between p-4 group cursor-pointer hover:bg-gray-75 transition-colors'>
                                    <div>
                                        <p className='text-white font-bold text-lg'>Video #{video.videoId}</p>
                                        <p className='text-sm text-gray-400'>
                                            {new Date(video.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Homepage;