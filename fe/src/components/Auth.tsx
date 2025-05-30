import { useEffect, useState } from 'react';
import GoogleIcon from '../assets/svg/google';
import GithubIcon from '../assets/svg/github';
import InputBox from './InputBox';
import { useParams } from 'react-router';

export default function Auth() {
    const {type} = useParams()
    const texts = [
        "Hello World!",
        "Welcome to React",
        "This is amazing!",
        "Let's build something cool",
        "Typewriter effects are fun!"
    ];
    const [currentTextIndex, setCurrentTextIndex] = useState(0);
    const [currentText, setCurrentText] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loginOrSignup, setLoginOrSignup] = useState(type==='login'?true:false);
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

    return (
        <div className="min-h-screen flex bg-gray-75">
            {/* Left side - Form */}
            <div className="w-full md:w-1/2 bg-gray-75 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    {/* Title */}
                    <div className='mb-8'>
                        <p className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-orange-400 via-pink-400 to-purple-400 font-playful">
                            ClipCraft
                        </p>
                    </div>
                    <p className="text-white text-3xl font-bold mb-8">{loginOrSignup ? "Login" : "Sign Up"}</p>
                    {/* Social buttons */}
                    <div className="space-y-3 mb-6">
                        <button className="w-full bg-gray-50 hover:bg-gray-800 border border-gray-25 rounded-lg py-1.5 px-4 text-white flex items-center justify-center gap-3 cursor-pointer">
                            <GoogleIcon />
                            <span className="text-sm">{loginOrSignup ? "Login" : "Sign Up"} with Google</span>
                        </button>

                        <button className="w-full bg-gray-50 hover:bg-gray-800 border border-gray-25 rounded-lg py-1.5 px-4 text-white flex items-center justify-center gap-3 cursor-pointer">
                            <GithubIcon />
                            <span className="text-sm">{loginOrSignup ? "Login" : "Sign Up"} with GitHub</span>
                        </button>
                    </div>

                    {/* OR divider */}
                    <div className="flex items-center mb-6">
                        <div className="flex-1 h-px bg-gray-200/10"></div>
                        <span className="px-4 text-gray-200/75 text-sm">OR</span>
                        <div className="flex-1 h-px bg-gray-200/10"></div>
                    </div>

                    {/* Email field */}
                    <div className="mb-4">
                        <InputBox value={email} setValue={setEmail} type="text" label='Email' />
                    </div>

                    {/* Password field */}
                    <div className="mb-6">
                        <InputBox value={password} setValue={setPassword} type="password" label='Password' />
                    </div>

                    {/* Sign up button */}
                    <button className="w-full bg-white text-black font-medium py-2 rounded-lg mb-6 hover:bg-gray-100 cursor-pointer">
                        {loginOrSignup ? "Login" : "Sign Up"}
                    </button>

                    {/* Footer links */}
                    <div className="text-center space-y-4">
                        <p className="text-gray-400 text-sm">
                            Don't have an account? <span onClick={() => { setLoginOrSignup(prev => !prev) }} className="text-white underline cursor-pointer">{loginOrSignup ? "Sign Up" : "Login"}</span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Right side - Gradient background with chat bubble */}
            <div className="w-0 md:w-1/2 m-6 relative hidden md:flex items-center justify-center">
                {/* Chat bubble */}
                <div className="bg-[url('/src/assets/image.webp')] rounded-lg w-full h-full bg-cover absolute" />
                <div className="absolute w-full px-24">
                    <div className="bg-white rounded-2xl flex flex-row justify-between items-center px-6 py-4">
                        <p className="text-gray-800 text-cente text-md">
                            Ask ClipCraft to {" "}
                            <span>
                                {currentText}
                                <span
                                    className={`transition-opacity duration-100 text-xl text-center text-blue-500`}
                                >
                                    {" "}|
                                </span>
                            </span>
                        </p>
                        <button className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-2xl p-6">
                            ↑
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}