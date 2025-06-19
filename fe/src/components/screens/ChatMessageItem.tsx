import { Copy, AlertCircle } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import type { ChatMessage } from './PreviewScreen';

interface ChatMessageItemProps {
    message: ChatMessage;
    onCopy: (code: string) => void;
}

export const ChatMessageItem = ({ message, onCopy }: ChatMessageItemProps) => {
    return (
        <div className="flex flex-col mt-4">
            {/* Prompt bubble: always right-aligned */}
            <div className="max-w-[85%] rounded-xl px-4 py-3 text-sm shadow-md mb-1 bg-gradient-to-br from-blue-500 to-blue-700 text-white self-end">
                {message.prompt}
            </div>
            
            {/* Python code: always left-aligned if present */}
            {message.pythonCode && (
                <div className="relative group max-w-[85%] mt-2 self-start">
                    <div className="w-full bg-black rounded-xl">
                        <div className="w-full flex flex-row items-center gap-2 justify-between border-b border-blue-400 px-4 py-2">
                            <div>python</div>
                            <button
                                onClick={() => onCopy(message.pythonCode!)}
                                className="opacity-0 group-hover:opacity-100 border-1 border-gray-600 text-gray-600 px-2 py-1 rounded-md flex flex-row items-center gap-2 hover:text-gray-300 hover:border-gray-300 cursor-pointer transition-opacity duration-200"
                            >
                                <Copy className="w-4 h-4" />
                                <p>copy</p>
                            </button>
                        </div>
                        <SyntaxHighlighter
                            language="python"
                            style={vscDarkPlus}
                            customStyle={{
                                padding: 16,
                                margin: 0,
                                borderRadius: '0.5rem',
                                backgroundColor: 'black'
                            }}
                            wrapLongLines={true}
                            wrapLines={true}
                        >
                            {message.pythonCode.length > 2000
                                ? `${message.pythonCode.slice(0, 1000)}...\n\n// Code truncated for display. Copy and paste in your own editor for full code.`
                                : message.pythonCode}
                        </SyntaxHighlighter>
                    </div>
                </div>
            )}
            
            {/* Error message if present */}
            {message.errormessage && (
                <div className='w-full max-w-[85%] p-4 text-red-500 border border-red-500/20 rounded-xl mt-2 bg-red-950/30 self-start'>
                    <div className='flex items-center gap-2 mb-2'>
                        <AlertCircle className='w-4 h-4' />
                        <span className='font-medium'>Error</span>
                    </div>
                    <p className='text-sm'>{message.errormessage}</p>
                </div>
            )}
        </div>
    );
}; 