import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden relative">
      {/* Glassmorphism Navbar */}
      <div className="fixed top-0 left-0 w-full z-30 pointer-events-none">
        <div className="w-full pointer-events-auto bg-gray/40 backdrop-blur-sm">
          <Navbar />
        </div>
      </div>
      {/* Padding to prevent content from being hidden behind navbar */}
      <div className="flex-1 pt-16 min-h-0 flex bg-gradient-to-br">
        <Outlet />
      </div>
    </div>
  )
}