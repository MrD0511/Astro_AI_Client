import { Routes, Route, useNavigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import Loader from './components/loader'

// Lazy loaded components
const LandingPage = lazy(() => import('./components/landingPage'))
const People = lazy(() => import('./components/people'))
const NewProfile = lazy(() => import('./components/newProfile'))
const ChatPage = lazy(() => import('./components/chatPage'))
const AboutPage = lazy(() => import('./components/about'))
const NotFound = lazy(() => import('./components/notFound'))

function App() {

  const navigate = useNavigate();

  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/profiles" element={<People />} />
        <Route path="/new-profile" element={<NewProfile />} />
        <Route path="/chat/:birthDetailId/:chatId?" element={<ChatPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="*" element={<NotFound 
          onNavigateHome={() => navigate("/")}
          onGoBack={() => navigate(-1)}
        />} />
      </Routes>
    </Suspense>
  )
}

export default App
