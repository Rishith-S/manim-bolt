export default function Clipcraft() {
  return (
    <div>
      <svg width="100" height="100" viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="brandGradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#FF6B35" stopOpacity={1} />
            <stop offset="100%" stopColor="#6366F1" stopOpacity={1} />
          </radialGradient>
          <linearGradient id="codeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF8A65" stopOpacity={1} />
            <stop offset="100%" stopColor="#5B21B6" stopOpacity={1} />
          </linearGradient>
        </defs>
        
        <path d="
          M160,180 
          Q145,180 145,200 
          Q145,220 130,220 
          Q145,220 145,240 
          Q145,260 160,260
        " stroke="url(#codeGradient)" strokeWidth="12" fill="none" strokeLinecap="round" />

        <path d="
          M240,180 
          Q255,180 255,200 
          Q255,220 270,220 
          Q255,220 255,240 
          Q255,260 240,260
        " stroke="url(#codeGradient)" strokeWidth="12" fill="none" strokeLinecap="round" />

        <circle cx="200" cy="220" r="35" fill="url(#brandGradient)" />
        <polygon points="185,200 185,240 225,220" fill="rgba(255,255,255,0.95)" />
      </svg>
    </div>
  )
}
