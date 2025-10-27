import axios from 'axios'
import type { Country, Category, Round } from '../../types/filter'
import { useState } from 'react'
import './filters.css'
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  CircularProgress,
  ThemeProvider,
  Alert,
  createTheme,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { useQuery } from '@tanstack/react-query'

// API Endpoints - for filtering panel:
const countries_endpoint = `${import.meta.env.VITE_BASE_URL}/metadata/countries`
const categories_endpoint = `${
  import.meta.env.VITE_BASE_URL
}/metadata/categories`
const rounds_endpoint = `${import.meta.env.VITE_BASE_URL}/metadata/rounds`

// Create font theme:
const theme = createTheme({
  typography: {
    fontFamily: "'Montserrat', Helvetica, sans-serif",
  },
})

export interface FilterValues {
  selectedCountry: string
  selectedRound: string
  selectedCategory: string
  search: string
}

interface FilterProps {
  onFilterChange: (filters: FilterValues) => void
  onSearch: (filters: FilterValues) => void
  loading?: boolean
}

// Fetch fucntions

const fetchCountries = async (): Promise<Country[]> => {
  const { data } = await axios.get(countries_endpoint)
  return data.data
}

const fetchCategories = async (): Promise<Category[]> => {
  const { data } = await axios.get(categories_endpoint)
  return data.data
}

const fetchRounds = async (): Promise<Round[]> => {
  const { data } = await axios.get(rounds_endpoint)
  return data.data
}

export default function Filter({
  onFilterChange,
  loading = false,
}: FilterProps) {
  // Filter state
  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('')
  const [selectedRound, setSelectedRound] = useState<string>('')
  const [search, setSearch] = useState<string>('')

  const {
    data: countries = [],
    isLoading: countriesLoading,
    error: countriesError,
  } = useQuery({
    queryKey: ['countries'],
    queryFn: fetchCountries,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  const {
    data: rounds = [],
    isLoading: roundsLoading,
    error: roundsError,
  } = useQuery({
    queryKey: ['rounds'],
    queryFn: fetchRounds,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  const getCurrentFilters = (): FilterValues => ({
    selectedCountry,
    selectedCategory,
    selectedRound,
    search,
  })

  // Handle filter changes
  const handleCountryChange = (event: SelectChangeEvent) => {
    const value = event.target.value
    setSelectedCountry(value)
    onFilterChange({ ...getCurrentFilters(), selectedCountry: value })
  }

  const handleCategoryChange = (event: SelectChangeEvent) => {
    const value = event.target.value
    setSelectedCategory(value)
    onFilterChange({ ...getCurrentFilters(), selectedCategory: value })
  }

  const handleRoundChange = (event: SelectChangeEvent) => {
    const value = event.target.value
    setSelectedRound(value)
    onFilterChange({ ...getCurrentFilters(), selectedRound: value })
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearch(value)
    onFilterChange({ ...getCurrentFilters(), search: value })
  }

  const handleClear = () => {
    const emptyFilters: FilterValues = {
      selectedCountry: '',
      selectedCategory: '',
      selectedRound: '',
      search: '',
    }
    setSelectedCountry('')
    setSelectedCategory('')
    setSelectedRound('')
    setSearch('')
    onFilterChange(emptyFilters)
  }

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      onFilterChange(getCurrentFilters())
    }
  }

  // Combined loading and error states
  const metadataLoading = countriesLoading || categoriesLoading || roundsLoading
  const error = countriesError || categoriesError || roundsError

  if (metadataLoading) {
    return (
      <Box display='flex' justifyContent='center' alignItems='center' p={3}>
        <CircularProgress size={24} />
        <span style={{ marginLeft: 8 }}>Loading filters...</span>
      </Box>
    )
  }

  if (error) {
    return (
      <Alert severity='error' sx={{ m: 2 }}>
        Error loading filters: {(error as Error).message}
      </Alert>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <Box className='filters-container'>
        <FormControl size='small' sx={{ minWidth: 150 }}>
          <InputLabel>Country</InputLabel>
          <Select
            value={selectedCountry}
            label='Country'
            onChange={handleCountryChange}
          >
            <MenuItem value=''>All Countries</MenuItem>
            {countries.map((c) => (
              <MenuItem key={c.countryId} value={c.countryName}>
                {c.countryName}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size='small' sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            label='Category'
            onChange={handleCategoryChange}
          >
            <MenuItem value=''>All Categories</MenuItem>
            {categories.map((cat) => (
              <MenuItem key={cat.categoryId} value={cat.categoryTitle}>
                {cat.categoryTitle}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size='small' sx={{ minWidth: 150 }}>
          <InputLabel>Round</InputLabel>
          <Select
            value={selectedRound}
            label='Round'
            onChange={handleRoundChange}
          >
            <MenuItem value=''>All Rounds</MenuItem>
            {rounds.map((r) => (
              <MenuItem key={r.roundLabel} value={r.roundId}>
                {`${r.roundLabel}: ${r.yearsOfSurvey}`}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size='small'
          label='Search questions'
          placeholder='Search in title, text, and category'
          value={search}
          onChange={handleSearchChange}
          onKeyUp={handleKeyPress}
          sx={{ minWidth: 500 }}
          InputProps={{
            endAdornment: search && (
              <ClearIcon
                sx={{ cursor: 'pointer', fontSize: 18 }}
                onClick={() =>
                  handleSearchChange({ target: { value: '' } } as any)
                }
              />
            ),
          }}
        />

        <Button
          variant='outlined'
          startIcon={<ClearIcon />}
          onClick={handleClear}
          disabled={loading}
        >
          Clear
        </Button>
      </Box>
    </ThemeProvider>
  )
}
