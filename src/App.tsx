import Navbar from './components/Navbar/Navbar'
import Filter from './components/Filters/Filter'
import Questions from './components/General Questions/Questions'
import CountrySpecificQuestions from './components/Country Specific Questions/csq'
import { Routes, Route } from 'react-router-dom'
// import Controls from './components/Controls/Controls'

const App = () => {
  return (
    <div>
      <Navbar />
      {/* <Controls /> */}
      <Filter />
      <Routes>
        <Route path='/' element={<Questions />} />
        <Route path='/csq-questions' element={<CountrySpecificQuestions />} />
      </Routes>
    </div>
  )
}

export default App