import { Camera } from 'lucide-react';
import type { ChatMessage } from './PreviewScreen';
import { VideoThumbnails } from './VideoThumbnails';

interface VideoPlayerProps {
    promptData: ChatMessage[];
    selectedVideoIndex: number;
    setSelectedVideoIndex: (index: number) => void;
}

export const VideoPlayer = ({ promptData, selectedVideoIndex, setSelectedVideoIndex }: VideoPlayerProps) => {
    const currentVideo = promptData[selectedVideoIndex];

    if (promptData.length === 0) {
        return (
            <main className="bg-gray-75 w-full h-full flex flex-col">
                <div className="flex flex-col flex-grow h-full p-4">
                    <div className="flex flex-col items-center justify-center w-full h-full">
                        <div className="w-16 h-16 mb-6 bg-gray-800 rounded-2xl flex items-center justify-center">
                            <Camera className="w-8 h-8 text-gray-500" />
                        </div>
                        <p className="text-gray-400 text-lg mb-2">No video available</p>
                        <p className="text-gray-500 text-sm">Generate a video to see it here</p>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="bg-gray-75 w-full h-full flex flex-col">
            <div className="flex flex-col flex-grow h-full p-4">
                <div className="flex flex-col flex-grow">
                    {/* Main video player */}
                    <div className="text-gray-300 text-sm font-medium mb-2">
                        Video {selectedVideoIndex + 1}
                    </div>
                    <video
                        controls
                        className="w-full h-[80%] object-contain rounded-xl"
                        src={currentVideo?.videoUrl}
                        onError={(e) => {
                            console.error("Video loading error:", e);
                        }}
                    >
                        <source src={currentVideo?.videoUrl} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>

                    {/* Video thumbnails */}
                    <VideoThumbnails
                        promptData={promptData}
                        selectedVideoIndex={selectedVideoIndex}
                        setSelectedVideoIndex={setSelectedVideoIndex}
                    />
                </div>
            </div>
        </main>
    );
}; 