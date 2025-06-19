import { Camera, RefreshCw } from 'lucide-react';

export const LoadingScreen = () => {
    return (
        <div className="flex flex-col items-center justify-center w-full h-full">
            <div className="w-16 h-16 mb-6">
                <div className="w-full h-full bg-gray-600 rounded-2xl animate-pulse"></div>
            </div>
            <p className="text-gray-400 text-lg mb-8">Spinning up preview...</p>

            <div className="space-y-6">
                <div className="flex items-center gap-3">
                    <Camera className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-400 text-sm">Instantly preview your changes</span>
                </div>

                <div className="flex items-center gap-3">
                    <RefreshCw className="w-5 h-5 text-gray-500" />
                    <span className="text-gray-400 text-sm">Set custom knowledge for every edit</span>
                </div>

                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 flex items-center justify-center">
                        <div className="w-3 h-3 bg-gray-500 rounded"></div>
                    </div>
                    <span className="text-gray-400 text-sm">Connect Supabase for backend</span>
                </div>
            </div>
        </div>
    );
}; 