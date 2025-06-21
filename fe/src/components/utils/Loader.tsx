export default function Loader() {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-tr from-orange-400 via-pink-400 to-purple-400 font-playful mb-4">
            ClipCraft
          </div>
          <div className="text-white text-lg font-medium">Loading...</div>
          <div className="mt-4 flex justify-center">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce mx-1"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce mx-1" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce mx-1" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }
  