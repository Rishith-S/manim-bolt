import type { ChatMessage } from './PreviewScreen';

interface VideoThumbnailsProps {
    promptData: ChatMessage[];
    selectedVideoIndex: number;
    setSelectedVideoIndex: (index: number) => void;
}

export const VideoThumbnails = ({ promptData, selectedVideoIndex, setSelectedVideoIndex }: VideoThumbnailsProps) => {
    return (
        <div className="mt-6">
            <h3 className="text-gray-300 text-sm font-medium">Video History</h3>
            <div className="flex flex-row gap-3 overflow-x-auto custom-scrollbar mt-2 pt-2">
                {promptData.map((_, index) => (
                    <div
                        key={index}
                        className={`flex flex-col items-center gap-2 min-w-[120px] group cursor-pointer hover:scale-105`}
                        onClick={() => {
                            console.log('Thumbnail clicked, setting selectedVideoIndex to:', index);
                            setSelectedVideoIndex(index);
                        }}
                    >
                        <div className={`w-20 h-20 rounded-lg overflow-hidden bg-gradient-to-br from-gray-700 to-gray-800 flex-shrink-0 border-2 border-gray-600 hover:border-blue-400 transition-colors duration-200 flex items-center justify-center relative ${selectedVideoIndex === index ? 'border-blue-400' : ''}`}>
                            <div className={`w-full flex h-full bg-black object-cover items-center justify-center ${selectedVideoIndex === index ? 'border-blue-400' : ''}`}>
                                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                                    <div className="w-0 h-0 border-l-[8px] border-l-white border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent ml-1"></div>
                                </div>
                            </div>
                        </div>
                        <span className="text-xs text-gray-400 font-medium">Video {index + 1}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}; 