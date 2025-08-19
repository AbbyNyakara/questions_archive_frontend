import Navbar from './components/Navbar/Navbar'
import Filter from './components/Filters/Filter'
import Questions from './components/General Questions/Questions'
import CountrySpecificQuestions from './components/Country Specific Questions/csq'

const App = () => {
  return (
    <div>
      <Navbar />
      <Filter />
      <Questions />
      <CountrySpecificQuestions />
    </div>
  )
}

export default App