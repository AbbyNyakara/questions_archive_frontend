import Navbar from './components/Navbar/Navbar'
import Filter from './components/Filters/Filters'

// Example usage in a parent component

const countries = [
  { value: 'ng', label: 'Nigeria' },
  { value: 'gh', label: 'Ghana' },
  // add more countries
];

const rounds = [
  { value: '1', label: 'Round 1' },
  { value: '2', label: 'Round 2' },
  // add more rounds
];

const categories = [
  { value: 'politics', label: 'Politics' },
  { value: 'economy', label: 'Economy' },
  // add more categories
];


const App = () => {
  const handleFilterChange = (filters: any) => {
    console.log(filters);
  };
  return (
    <div>
      <Navbar />
      <Filter
      countries={countries}
      rounds={rounds}
      categories={categories}
      onFilterChange={handleFilterChange}
    />
    </div>
  )
}

export default App