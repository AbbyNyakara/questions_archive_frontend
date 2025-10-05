
import axios from 'axios'
import type { Country, Round } from '../../types/filter'
import { useEffect, useState } from 'react'
import './csq_filters.css'
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
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'


// API Endpoints - for filtering panel:
const countries_endpoint = `${import.meta.env.VITE_BASE_URL}/metadata/countries`
const rounds_endpoint = `${import.meta.env.VITE_BASE_URL}/metadata/rounds`

// Create font theme:
const theme = createTheme({
  typography: {
    fontFamily: "'Montserrat', Helvetica, sans-serif",
  },
})

export interface CSQFilterValues {
  selectedCountry: string
  selectedRound: string
  search: string
}

interface CSQFilterProps {
  onFilterChange: (filters: CSQFilterValues) => void
  onSearch: (filters: CSQFilterValues) => void
  loading?: boolean
}

export default function CSQFilter({
  onFilterChange,
  onSearch,
  loading = false,
}: CSQFilterProps) {
  const [countries, setCountries] = useState<Country[]>([])
  const [rounds, setRounds] = useState<Round[]>([])
  const [metadataLoading, setMetadataLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedCountry, setSelectedCountry] = useState<string>('')
  const [selectedRound, setSelectedRound] = useState<string>('')
  const [search, setSearch] = useState<string>('')

  const getCurrentFilters = (): CSQFilterValues => ({
    selectedCountry,
    selectedRound,
    search,
  })

  useEffect(() => {
    async function fetchMetadata() {
      try {
        setMetadataLoading(true)
        setError(null)

        const [countriesRes, roundsRes] = await Promise.all([
          axios.get(countries_endpoint),
          axios.get(rounds_endpoint),
        ])

        setCountries(countriesRes.data.data)
        setRounds(roundsRes.data.data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setMetadataLoading(false)
      }
    }
    fetchMetadata()
  }, [])

  // Handle filter changes and notify parent
  // country filter
  const handleCountryChange = (event: SelectChangeEvent) => {
    const value = event.target.value
    setSelectedCountry(value)
    const filters = { ...getCurrentFilters(), selectedCountry: value }
    onFilterChange(filters)
  }

  // round filter
  const handleRoundChange = (event: SelectChangeEvent) => {
    const roundNumber = event.target.value
    console.log("The rounds event is", event)
    console.log('Selected round ID:', roundNumber)
    setSelectedRound(roundNumber)

    const filters = {
      ...getCurrentFilters(),
      selectedRound: roundNumber,
    }
    console.log('Updated filters:', filters)
    onFilterChange(filters)
  }

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value
    setSearch(value)
    const filters = { ...getCurrentFilters(), search: value }
    onFilterChange(filters)
  }

  const handleSearch = () => {
    onSearch(getCurrentFilters())
  }

  // For the clear button
  const handleClear = () => {
    setSelectedCountry('')
    setSelectedRound('')
    setSearch('')
    const emptyFilters: CSQFilterValues = {
      selectedCountry: '',
      selectedRound: '',
      search: '',
    }
    onFilterChange(emptyFilters)
    onSearch(emptyFilters)
  }

  // Triggered on enter.
  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      handleSearch()
    }
  }

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
        Error loading filters: {error}
      </Alert>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <Box
        className='filters-container'
        sx={{
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap',
          alignItems: 'center',
          p: 2,
          backgroundColor: '#f5f5f5',
          borderRadius: 1,
          mb: 2,
        }}
      >
        {/* Countries Dropdown */}
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

        {/* Rounds Dropdown */}
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

        {/* Search Input */}
        <TextField
          size='small'
          label='Search CSQ questions'
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

        {/* Action Buttons */}
        <Button
          variant='contained'
          startIcon={<SearchIcon />}
          onClick={handleSearch}
          disabled={loading}
          sx={{ minWidth: 120 }}
        >
          {loading ? <CircularProgress size={16} color='inherit' /> : 'Search'}
        </Button>

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
