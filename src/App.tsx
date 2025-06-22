
import './App.css'
import {Routes, Route} from 'react-router-dom'
import People from './components/people'
import LandingPage from './components/landingPage'
import NewProfile from './components/newProfile'
import ChatPage from './components/chatPage'
import AboutPage from './components/about'

function App() {

  return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/profiles" element={<People />} />
        <Route path="/new-profile" element={<NewProfile />} />
        <Route path="/chat/:birthDetailId/:chatId?" element={<ChatPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
  )
}

export default App
