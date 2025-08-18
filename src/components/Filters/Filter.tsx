import axios from 'axios'
import type { Country, Category, Round } from '../../types/filters/filter'
import { useEffect, useState } from 'react'
import './filters.css'

// Fetching data:
const countries_endpoint = 'http://localhost:3000/api/metadata/countries'
const categories_endpoint = 'http://localhost:3000/api/metadata/categories'
const rounds_endpoint = 'http://localhost:3000/api/metadata/rounds'

export default function Filter() {
  const [countries, setCountries] = useState<Country[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [rounds, setRounds] = useState<Round[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // selected values
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedRound, setSelectedRound] = useState<string>('')
  const [search, setSearch] = useState<string>('')

  useEffect(() => {
    async function fetchMetadata() {
      try {
        setLoading(true)
        setError(null)

        const [countriesRes, categoriesRes, roundsRes] = await Promise.all([
          axios.get(countries_endpoint),
          axios.get(categories_endpoint),
          axios.get(rounds_endpoint),
        ])

        setCountries(countriesRes.data.data)
        setCategories(categoriesRes.data.data)
        setRounds(roundsRes.data.data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchMetadata()
  }, [])

  if (loading) return <div>Loading...</div> // Style this component
  if (error) return <div>Error: {error}</div> // Style this component

  return (
    <form className='filters-form'>
      <div className='filters-container'>
        {/* Countries Dropdown */}
        <select
          name='country'
          value={selectedCountry}
          className='filters-dropdown'
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          <option value=''>All Countries</option>
          {countries.map((c) => (
            <option key={c.countryID} value={c.countryName}>
              {c.countryName}
            </option>
          ))}
        </select>

        {/* Categories Dropdown */}
        <select
          name='category'
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className='filters-dropdown'
        >
          <option value=''>All Categories</option>
          {categories.map((cat) => (
            <option key={cat.categoryId} value={cat.categoryTitle}>
              {cat.categoryTitle}
            </option>
          ))}
        </select>

        {/* Rounds Dropdown */}
        <select
          name='rounds'
          value={selectedRound}
          onChange={(e) => setSelectedRound(e.target.value)}
          className='filters-dropdown'
        >
          <option value=''>All Rounds</option>
          {rounds.map((r) => (
            <option key={r.roundID} value={r.roundLabel}>
              {`${r.roundLabel}: ${r.yearsOfSurvey}`}
            </option>
          ))}
        </select>

        {/* Text Search - Add back-end code*/}
        <input
          type='text'
          name='search'
          value={search}
          onChange={(e) => setSearch(e.target.value)} //The search trigger to be button-enabled- for all selections
          className='filters-search-box'
          placeholder='Text Search...'
          autoComplete='on' // Toggle  on and off and see how it improves efficiency
        />
      </div>
      <button className='search-btn'>Search Questions</button>
    </form>
  )
}
