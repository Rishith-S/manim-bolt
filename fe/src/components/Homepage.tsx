import { ArrowUp } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

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

    const handlePromptSubmit = () => {
        if(inputValue.length>0){
            localStorage.setItem("prompt",inputValue);
            navigate(`/videos/${1}`);
        }
    }

    return (
        <div className='max-w-full h-screen overflow-hidden bg-gray-50'>
            <div 
                className="absolute h-[100%] w-[100%] z-20"
                style={{
                    backgroundImage: 'url("/src/assets/noise.png")',
                    backgroundRepeat: 'repeat',
                    opacity: 0.35
                }}
            />
            <div 
                className="absolute left-1/2 h-full w-full -translate-x-1/2 z-10 brightness-110"
                style={{
                    backgroundImage: 'url("/src/assets/gradient-optimized.svg")',
                    backgroundSize: '180% 3000px',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center top'
                }}
            />
            {/* Header */}
            <header className="relative z-30 flex justify-between items-center max-w-7xl mx-auto p-6">
                <div className="flex items-center space-x-3">
                    <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-orange-400 via-pink-400 to-purple-400 font-playful">
                        ClipCraft
                    </p>
                </div>
                <div className="flex space-x-4">
                    <button onClick={()=>{navigate('/auth/login',{replace:true})}} className="px-4 py-2 text-white bg-gray-50 border-1 border-gray-25 hover:bg-gray-25 font-medium rounded-md">
                        Log in
                    </button>
                    <button onClick={()=>{navigate('/auth/signup',{replace:true})}} className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-white/75">
                        Sign up
                    </button>
                </div>
            </header>

            <main className="relative z-30 flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6">
                <div className="text-center mb-16 max-w-4xl">
                    <h1 className="text-2xl md:text-5xl font-bold mb-4 text-white">
                        Build something <span className='font-playful text-blue-100'>ClipCraft</span>
                    </h1>
                    <p className="text-lg md:text-xl text-white">
                        Idea to video in seconds, with your personal <span className='underline font-playful text-yellow-100'>manim</span> video generator
                    </p>
                </div>

                {/* Input Section */}
                <div className="w-full max-w-4xl mb-12">
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
                            <button onClick={handlePromptSubmit} className={`w-8 h-8  rounded-full flex items-center justify-center ${inputValue.length>0?"bg-white hover:bg-blue-200":"bg-gray-400/85 cursor-not-allowed"}`}>
                                <ArrowUp className="w-4 h-4" strokeWidth={4} />
                            </button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Homepage;