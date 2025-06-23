import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import './App.css'
import Auth from './components/screens/Auth'
import Homepage from './components/screens/Homepage'
import PreviewScreen from './components/screens/PreviewScreen'
import Layout from './components/utils/Layout'
import Callback from './components/utils/Callback'
import PersistentLogin from './components/utils/PersistentLogin'
import { RedirectToMain } from './components/utils/Redirect'

function AppRoutes() {
  const location = useLocation();
  const isAuthRoute = location.pathname.startsWith('/auth');

  return (
    <Routes>
      <Route path="/auth/callback/signup" element={<Callback />} />
      <Route path="/auth/callback/login" element={<Callback />} />
      <Route path="/auth/github/callback/signup" element={<Callback />} />
      <Route path="/auth/github/callback/login" element={<Callback />} />
      <Route path="/auth/:type" element={<Auth />} />
      {!isAuthRoute && (
        <Route element={<PersistentLogin />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Homepage />} />
            <Route path='/videos/:videoId' element={<PreviewScreen />} />
          </Route>
        </Route>
      )}
      <Route path="*" element={<RedirectToMain />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App
