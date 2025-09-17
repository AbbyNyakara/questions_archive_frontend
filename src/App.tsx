import Navbar from './components/Navbar/Navbar'
import '@fortawesome/fontawesome-free/css/all.min.css';
import About from './components/About/About'
// import { Routes, Route } from 'react-router-dom'
// import Controls from './components/Controls/Controls'

const App = () => {
  return (
    <div>
      <Navbar />
      <About />
    </div>
  )
}

export default App