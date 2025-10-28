import axios from 'axios'
import type { Country, Round } from '../../types/filter'
import { useState } from 'react'
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
  IconButton,
  InputAdornment,
} from '@mui/material'
import type { SelectChangeEvent } from '@mui/material'
import ClearIcon from '@mui/icons-material/Clear'
import { useQuery } from '@tanstack/react-query'

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

interface FilterProps {
  onFilterChange: (filters: CSQFilterValues) => void
  onSearch: (filters: CSQFilterValues) => void
  loading?: boolean
}

// Fetch fucntions

const fetchCountries = async (): Promise<Country[]> => {
  const { data } = await axios.get(countries_endpoint)
  return data.data
}

const fetchRounds = async (): Promise<Round[]> => {
  const { data } = await axios.get(rounds_endpoint)
  return data.data
}

export default function Filter({ onFilterChange, loading = false }: FilterProps) {
  // Filter state
  const [selectedCountry, setSelectedCountry] = useState<string>('')
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
    data: rounds = [],
    isLoading: roundsLoading,
    error: roundsError,
  } = useQuery({
    queryKey: ['rounds'],
    queryFn: fetchRounds,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })

  const getCurrentFilters = (): CSQFilterValues => ({
    selectedCountry,
    selectedRound,
    search,
  })

  // Handle filter changes
  const handleCountryChange = (event: SelectChangeEvent) => {
    const value = event.target.value
    setSelectedCountry(value)
    onFilterChange({ ...getCurrentFilters(), selectedCountry: value })
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
    const emptyFilters: CSQFilterValues = {
      selectedCountry: '',
      selectedRound: '',
      search: '',
    }
    setSelectedCountry('')
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
  const metadataLoading = countriesLoading || roundsLoading
  const error = countriesError || roundsError

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
      <Box
        className='filters-container'
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 1, md: 2 },
          alignItems: 'center',
          width: '100%',
        }}
      >
        <FormControl
          size='small'
          sx={{ minWidth: { xs: '100%', sm: 150 } }}
          className='filter-values'
        >
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

        <FormControl
          size='small'
          sx={{ minWidth: 150 }}
          className='filter-values'
        >
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
          placeholder='Search in title, text, and label'
          className='filter-values'
          value={search}
          onChange={handleSearchChange}
          onKeyUp={handleKeyPress}
          sx={{
            minWidth: { xs: '100%', sm: 500 },
          }}
          slotProps={{
            input: {
              endAdornment: search ? (
                <InputAdornment position='end'>
                  <IconButton
                    size='small'
                    onClick={() => {
                      setSearch('')
                      onFilterChange({
                        ...getCurrentFilters(),
                        search: '',
                      })
                    }}
                    edge='end'
                    aria-label='clear search'
                  >
                    <ClearIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
        />

        <Button
          variant='outlined'
          className='filter-values'
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
