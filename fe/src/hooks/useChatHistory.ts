import { useState, useEffect } from 'react';
import axios from 'axios';
import type { ChatMessage } from '../components/screens/PreviewScreen';

export const useChatHistory = (
    userId: string,
    videoId: string,
    setSelectedVideoIndex: (index: number) => void
) => {
    const [type, setType] = useState(false);

    const getChatHistory = async () => {
        try {
            const res = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/v1/chatHistory/getChatHistory`,
                {
                    userId: userId,
                    videoId: videoId,
                },
                { withCredentials: true }
            );
            
            const { chatHistory, shouldInitialize } = res.data as {
                chatHistory: ChatMessage[];
                shouldInitialize: boolean;
            };
            
            setType(shouldInitialize);
            
            // Auto-select the latest video when chat history is loaded
            if (chatHistory.length > 0) {
                setSelectedVideoIndex(chatHistory.length - 1);
            }
        } catch (error) {
            console.error('Error fetching chat history:', error);
        }
    };

    useEffect(() => {
        getChatHistory();
    }, [videoId]);

    return { type, getChatHistory };
}; 