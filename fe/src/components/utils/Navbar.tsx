import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export default function Navbar() {
    const navigate = useNavigate();
    const [user, setUser] = useState<{ name: string; picture?: string } | null>(null);

    useEffect(() => {
        const accessToken = localStorage.getItem('accessToken');
        const name = localStorage.getItem('name');
        const picture = localStorage.getItem('picture');
        if (accessToken && name) {
            setUser({ name, picture: picture || undefined });
        } else {
            setUser(null);
        }
    }, []);

    const handleLogout = () => {
        localStorage.clear();
        setUser(null);
        navigate('/auth/login', { replace: true });
    };

    return (
        <header className="relative z-30 flex justify-between items-center w-full bg-transparent p-6 h-16">
            <div className="flex cursor-pointer items-center space-x-3" onClick={() => { navigate('/', { replace: true }) }}>
                <p className="text-2xl lg:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-orange-400 via-pink-400 to-purple-400 font-playful">
                    ClipCraft
                </p>
            </div>
            <div className="flex items-center">
                {user ? (
                    <>
                        {user.picture ? (
                            <img src={user.picture} alt="avatar" className="w-8 h-8 rounded-full border-2 border-orange-400" />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold">
                                {user.name.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span className="text-white font-medium px-2">{user.name}</span>
                        <button onClick={handleLogout} className="px-4 py-2 bg-gray-800 text-white rounded-lg font-medium hover:bg-gray-700">Logout</button>
                    </>
                ) : (
                    <>
                        <button onClick={() => { navigate('/auth/login', { replace: true }) }} className="px-4 py-2 text-white bg-gray-50 border-1 border-gray-25 hover:bg-gray-25 font-medium rounded-md">
                            Log in
                        </button>
                        <button onClick={() => { navigate('/auth/signup', { replace: true }) }} className="px-4 py-2 bg-white text-black rounded-lg font-medium hover:bg-white/75">
                            Sign up
                        </button>
                    </>
                )}
            </div>
        </header>
    )
}