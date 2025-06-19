import { AlertCircle } from 'lucide-react';

interface ErrorBannerProps {
    errorMessage: string;
}

export const ErrorBanner = ({ errorMessage }: ErrorBannerProps) => {
    if (!errorMessage) return null;

    return (
        <div className="bg-red-500/10 bg-gray-75 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg mx-4 mt-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <p>{errorMessage}</p>
        </div>
    );
}; 