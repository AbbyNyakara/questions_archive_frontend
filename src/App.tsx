import Navbar from './components/Navbar/Navbar'
import '@fortawesome/fontawesome-free/css/all.min.css';
import About from './components/About/About'
import { Routes, BrowserRouter, Route } from 'react-router-dom'
import Questions from './components/MainQuestionnaire/Questions'
import CountrySpecificQuestions from './components/CountrySpecificQuestions/CountrySpecificQuestions'

const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='/' element={<About />} />
        <Route path='/main-questionnaire' element={<Questions />} />
        <Route path='/csqs' element={<CountrySpecificQuestions />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App