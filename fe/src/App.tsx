import { Route, Routes } from 'react-router'
import './App.css'
import Auth from './components/Auth'
import Homepage from './components/Homepage'
import PreviewScreen from './components/PreviewScreen'

function App() {
  return (
    <Routes>
      <Route path='/auth/:type' Component={Auth} />
      <Route path='/' Component={Homepage} />
      <Route path='/videos/:videoId' Component={PreviewScreen} />
    </Routes>
    
  )
}

export default App
