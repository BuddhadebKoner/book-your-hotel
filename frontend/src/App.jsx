import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import RootLayout from './_root/RootLayout'
import Home from './_root/pages/Home'
import Hotels from './_root/pages/Hotels'
import Destinations from './_root/pages/Destinations'
import About from './_root/pages/About'
import Contact from './_root/pages/Contact'
import DevPage from './pages/DevPage'

function App() {
  return (
    <Router>
      <Routes>
        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
          <Route path="/hotels" element={<Hotels />} />
          <Route path="/destinations" element={<Destinations />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/dev" element={<DevPage />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
