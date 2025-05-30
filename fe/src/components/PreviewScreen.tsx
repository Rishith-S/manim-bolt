import {
    ArrowUp,
    Camera,
    RefreshCw
} from 'lucide-react';
import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router';
import axios from 'axios';

export interface Result {
    status: string;
    errormessage?: string;
    videoUrl?: string;
    pythonCode?: string;
}

export default function PreviewScreen() {
    const { videoId } = useParams();
    const userId = 1;
    const [isLoading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [data, setData] = useState<Result>();
    const [inputValue, setInputValue] = useState('')
    const prompt = localStorage.getItem("prompt");
    const navigate = useNavigate();

    const handleEventSource = useCallback((eventSource: EventSource) => {
        eventSource.onmessage = (event) => {
            const safeData = JSON.parse(event.data) as unknown as Result;
            if (safeData.status === "error") {
                setErrorMessage(safeData.errormessage!);
            }
            setData(safeData);
            if (
                safeData.status &&
                (safeData.status === "close" || safeData.status === "error")
            ) {
                setLoading(false);
                eventSource.close();
            }
        };
    }, []);

    const submitVideoPrompt = useCallback(async () => {
        try {
            await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/v1/execute/videoPrompt`,
                { userId, videoId, userPrompt: prompt },
                { withCredentials: true }
            );
        } catch (error) {
            console.error("Error submitting video prompt:", error);
            setErrorMessage("Failed to submit video prompt");
            setLoading(false);
        }
    }, [userId, videoId, prompt]);

    useEffect(() => {
        let eventSource: EventSource | null = null;
        
        const initializeConnection = async () => {
            try {
                setLoading(true);
                eventSource = new EventSource(
                    `${import.meta.env.VITE_SERVER_URL}/api/v1/execute/job-events/${userId}/${videoId}`
                );
                
                handleEventSource(eventSource);
                await submitVideoPrompt();
            } catch (error) {
                console.error("Error initializing connection:", error);
                setErrorMessage("Failed to initialize connection");
                setLoading(false);
            }
        };

        initializeConnection();

        return () => {
            if (eventSource) {
                eventSource.close();
            }
        };
    }, [videoId, handleEventSource, submitVideoPrompt]);

    const handlePromptSubmit = () => {
        if (inputValue.length > 0) {
            localStorage.setItem("prompt", inputValue);
            navigate(`/videos/${1}`);
        }
    }

    // Rest of the component remains the same...
    return (
        <div className="h-screen bg-black text-white flex flex-col overflow-hidden">
            {/* Header */}
            <header className="h-12 bg-gray-75 border-b p-4 border-gray-50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-4 h-4 bg-gradient-to-br from-red-500 to-teal-400 rounded"></div>
                    <span className="text-sm font-medium">habit-spark-insight</span>
                    <RefreshCw className="w-4 h-4 text-gray-500 cursor-pointer" />
                </div>

                <div className="flex items-center gap-2">
                </div>
            </header>

            <div className="flex flex-row">
                {/* Sidebar */}
                <aside className="w-[30%] bg-gray-75 border-r border-gray-50 flex flex-col">
                    <div className="p-4 h-[85vh] flex-grow overflow-y-auto transition-all duration-300">
                        <div className='flex flex-col items-end justify-end'>
                            <p className="text-sm bg-black p-4 rounded-xl text-gray-300">
                                {prompt}
                            </p>
                        </div>
                    </div>

                    {/* Bottom section */}
                    <div className='flex p-4 flex-row justify-between bg-black gap-2 w-full transition-all duration-300 ease-in-out h-[10vh]'>
                        <div className="text-white flex-grow">
                            <textarea
                                name="promptbox"
                                id="prompt"
                                placeholder="Ask ClipCraft to create a video..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                className="w-full h-10 resize-none bg-gray-75 border border-gray-50 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-gray-25 transition-all duration-300"
                            />
                        </div>
                        <button 
                            onClick={handlePromptSubmit} 
                            disabled={inputValue.length === 0}
                            className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                                inputValue.length > 0 
                                    ? "bg-white hover:bg-blue-200 cursor-pointer" 
                                    : "bg-gray-400/85 cursor-not-allowed"
                            }`}
                        >
                            <ArrowUp className="w-4 h-4 text-black" strokeWidth={4} />
                        </button>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="bg-gray-75 w-[70%]">
                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center h-full">
                            <div className="w-16 h-16 mb-6">
                                <div className="w-full h-full bg-gray-600 rounded-2xl animate-pulse"></div>
                            </div>
                            <p className="text-gray-400 text-lg mb-8">Spinning up preview...</p>

                            <div className="space-y-6 w-80">
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
                    ) : (
                        <div className="p-8">
                            <iframe 
                                allowFullScreen 
                                src={`${data ? data.videoUrl : ""}`}
                                width={"100%"}
                                height={"450vh"}
                                className='rounded-xl'
                            />
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
