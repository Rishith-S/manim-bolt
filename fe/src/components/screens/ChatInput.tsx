import { ArrowUp } from 'lucide-react';

interface ChatInputProps {
    inputValue: string;
    setInputValue: (value: string) => void;
    handlePromptSubmit: () => void;
}

export const ChatInput = ({ inputValue, setInputValue, handlePromptSubmit }: ChatInputProps) => {
    return (
        <div className='flex p-4 flex-row justify-between border-t border-gray-25 bg-black gap-2 w-full transition-all duration-300 ease-in-out h-[10vh]'>
            <div className="text-white flex-grow">
                <textarea
                    name="promptbox"
                    id="prompt"
                    placeholder="Ask ClipCraft to create a video..."
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full h-12 resize-none bg-gray-75 border border-gray-50 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-gray-25 transition-all duration-300 shadow-inner"
                />
            </div>
            <button
                onClick={handlePromptSubmit}
                disabled={inputValue.length === 0}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors text-black text-lg font-bold shadow-md ${
                    inputValue.length > 0
                        ? "bg-white hover:bg-blue-200 cursor-pointer"
                        : "bg-gray-400/85 cursor-not-allowed"
                }`}
            >
                <ArrowUp className="w-5 h-5" strokeWidth={4} />
            </button>
        </div>
    );
}; 