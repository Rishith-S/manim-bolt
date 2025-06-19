import { ArrowUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import axios from 'axios';

const Homepage: React.FC = () => {
    const [inputValue, setInputValue] = useState('');
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
            localStorage.setItem("prompt", inputValue);
            const res = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/v1/execute/getVideoId`, {
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json',
                },
                data: {
                    userId: localStorage.getItem('userId'),
                },
            });
            
            // Type assertion to handle the response data
            const responseData = res.data as { videoId: string };
            navigate(`/videos/${responseData.videoId}`);
        }
    }

    return (
        <div className='w-screen min-h-full z-10 overflow-y-auto bg-gray-50'>
            <div
                className="absolute h-[91.5%] w-[100%] z-20 pointer-events-none"
                style={{
                    backgroundImage: 'url("/src/assets/noise.png")',
                    backgroundRepeat: 'repeat',
                    opacity: 0.35
                }}
            />
            <div
                className="absolute left-1/2 h-[91.5%] w-full -translate-x-1/2 z-10 brightness-110 pointer-events-none"
                style={{
                    backgroundImage: 'url("/src/assets/gradient-optimized.svg")',
                    backgroundRepeat: 'repeat',
                    backgroundPosition: 'center top'
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
                <div className='flex flex-col h-full w-[95%] mt-[10%] mb-6 rounded-lg bg-black px-4 py-2'>
                    <div className='items-center flex '>
                        <div className='font-bold rounded-sm px-3 text-white bg-orange-600 p-2'>R</div>
                        <p className='text-white p-4'>Rishi's Work</p>
                    </div>
                    <div>
                        <div onClick={() => {
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                        setInputValue('');
                        const textarea = document.getElementById('prompt') as HTMLTextAreaElement;
                        if (textarea) {
                            textarea.focus();
                        }
                        }} className='bg-gray-25 flex items-center justify-center my-2 rounded-md h-32 w-64 cursor-pointer'>
                            <p className='text-md text-gray-100'>+ create video</p>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Homepage;