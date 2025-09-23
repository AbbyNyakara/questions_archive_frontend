import type { Question } from '../../types/questions'
import './questions.css'
import * as React from 'react'
import { alpha } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TablePagination from '@mui/material/TablePagination'
import TableRow from '@mui/material/TableRow'
import DownloadIcon from '@mui/icons-material/Download'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Checkbox from '@mui/material/Checkbox'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import FormControlLabel from '@mui/material/FormControlLabel'
import Switch from '@mui/material/Switch'
import FilterListIcon from '@mui/icons-material/FilterList'
import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import {
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
  Alert,
} from '@mui/material'
import Filter from '../Filters/Filters'
import type { FilterValues } from '../Filters/Filters'

interface ApiResponse {
  success: boolean
  data: Question[]
}

const BASE_URL = 'http://localhost:3000/api'

const buildQuestionsUrl = ({ selectedCountry, selectedCategory, selectedRound, search }: FilterValues): string => {
  const base = `${BASE_URL}/questions`

  // All three filters: Country + Round + Category
  if (selectedCountry && selectedRound && selectedCategory) {
    return `${base}/by-country-round-category/${encodeURIComponent(selectedCountry)}/${selectedRound}/${encodeURIComponent(selectedCategory)}`
  }

  // Two filter combinations:
  // Country + Round
  if (selectedCountry && selectedRound) {
    return `${base}/by-country-round/${encodeURIComponent(selectedCountry)}/${selectedRound}`
  }
  
  // Category + Round
  if (selectedCategory && selectedRound) {
    return `${base}/by-category-round/${encodeURIComponent(selectedCategory)}/${selectedRound}`
  }
  
  // Country + Category
  if (selectedCountry && selectedCategory) {
    return `${base}/by-country-category/${encodeURIComponent(selectedCountry)}/${encodeURIComponent(selectedCategory)}`
  }
  
  // Round only
  if (selectedRound) {
    return `${base}/by-round/${selectedRound}`
  }
  
  // Category only
  if (selectedCategory) {
    return `${base}/by-category/${encodeURIComponent(selectedCategory)}`
  }
  
  // Country only
  if (selectedCountry) {
    return `${base}/by-country/${encodeURIComponent(selectedCountry)}`
  }
  
  // Search text only - STILL NOT WORKING 
  if (search && search.trim()) {
    return `${base}/search?q=${encodeURIComponent(search.trim())}`
  }
  
  // Default: all questions
  return base
}

// const buildQuestionsUrl = ({ selectedCountry, selectedCategory, selectedRound, search }: FilterValues): string => {
//   const base = `${BASE_URL}/questions`
  
//   // Use explicit check instead of truthy evaluation
//   const hasRound = selectedRound !== undefined && selectedRound !== 0
  
//   // All three filters: Country + Round + Category
//   if (selectedCountry && hasRound && selectedCategory) {
//     return `${base}/by-country-round-category/${encodeURIComponent(selectedCountry)}/${selectedRound}/${encodeURIComponent(selectedCategory)}`
//   }

//   // Two filter combinations:
//   if (selectedCountry && hasRound) {
//     return `${base}/by-country-round/${encodeURIComponent(selectedCountry)}/${selectedRound}`
//   }
  
//   if (selectedCategory && hasRound) {
//     return `${base}/by-category-round/${encodeURIComponent(selectedCategory)}/${selectedRound}`
//   }
  
//   if (selectedCountry && selectedCategory) {
//     return `${base}/by-country-category/${encodeURIComponent(selectedCountry)}/${encodeURIComponent(selectedCategory)}`
//   }
  
//   // Single filters
//   if (hasRound) {
//     return `${base}/by-round/${selectedRound}`
//   }
  
//   if (selectedCategory) {
//     return `${base}/by-category/${encodeURIComponent(selectedCategory)}`
//   }
  
//   if (selectedCountry) {
//     return `${base}/by-country/${encodeURIComponent(selectedCountry)}`
//   }
  
//   // Search text only
//   if (search && search.trim()) {
//     return `${base}/search?q=${encodeURIComponent(search.trim())}`
//   }
  
//   return base
// }


interface HeadCell {
  disablePadding: boolean
  id: keyof Question
  label: string
  numeric: boolean
  width?: number
}

const headCells: readonly HeadCell[] = [
  {
    id: 'categoryTitle',
    numeric: false,
    disablePadding: true,
    label: 'Category',
    width: 120,
  },
  {
    id: 'questionId',
    numeric: false,
    disablePadding: false,
    label: 'ID',
    width: 150,
  },
  {
    id: 'questionTitle',
    numeric: false,
    disablePadding: false,
    label: 'Title',
    width: 250,
  },
  {
    id: 'questionText',
    numeric: false,
    disablePadding: false,
    label: 'Question Text',
    width: 400,
  },
  {
    id: 'choices',
    numeric: false,
    disablePadding: false,
    label: 'Choices',
    width: 300,
  },
  {
    id: 'round1',
    numeric: false,
    disablePadding: false,
    label: 'R1',
    width: 80,
  },
  {
    id: 'round2',
    numeric: false,
    disablePadding: false,
    label: 'R2',
    width: 80,
  },
  {
    id: 'round3',
    numeric: false,
    disablePadding: false,
    label: 'R3',
    width: 80,
  },
  {
    id: 'round4',
    numeric: false,
    disablePadding: false,
    label: 'R4',
    width: 80,
  },
  {
    id: 'round5',
    numeric: false,
    disablePadding: false,
    label: 'R5',
    width: 80,
  },
  {
    id: 'round6',
    numeric: false,
    disablePadding: false,
    label: 'R6',
    width: 80,
  },
  {
    id: 'round7',
    numeric: false,
    disablePadding: false,
    label: 'R7',
    width: 80,
  },
  {
    id: 'round8',
    numeric: false,
    disablePadding: false,
    label: 'R8',
    width: 80,
  },
  {
    id: 'round9',
    numeric: false,
    disablePadding: false,
    label: 'R9',
    width: 80,
  },
  {
    id: 'round10',
    numeric: false,
    disablePadding: false,
    label: 'R10',
    width: 80,
  },
]

interface EnhancedTableProps {
  numSelected: number
  onSelectAllClick: (event: React.ChangeEvent<HTMLInputElement>) => void
  rowCount: number
}

function EnhancedTableHead(props: EnhancedTableProps) {
  const { onSelectAllClick, numSelected, rowCount } = props

  return (
    <TableHead>
      <TableRow>
        <TableCell padding='checkbox'>
          <Checkbox
            color='primary'
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sx={{ 
              fontWeight: 'bold',
              width: headCell.width 
            }}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  )
}

interface EnhancedTableToolbarProps {
  numSelected: number
  onDownload: () => void
  currentFilters: FilterValues
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, onDownload, currentFilters } = props
  
  const hasFilters = Object.values(currentFilters).some(value => value !== '')

  return (
    <Toolbar
      sx={[
        {
          pl: { sm: 2 },
          pr: { xs: 1, sm: 1 },
        },
        numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(
              theme.palette.primary.main,
              theme.palette.action.activatedOpacity
            ),
        },
      ]}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color='inherit'
          variant='subtitle1'
          component='div'
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Box sx={{ flex: '1 1 100%', display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography variant='h6' id='tableTitle' component='div'>
            Questions
          </Typography>
          {hasFilters && (
            <Chip 
              label="Filtered" 
              color="primary" 
              size="small" 
              icon={<FilterListIcon fontSize="small" />}
            />
          )}
        </Box>
      )}
      {numSelected > 0 ? (
        <Tooltip title='Download Selected'>
          <IconButton onClick={onDownload}>
            <DownloadIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title='Filter list'>
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

// CSV Download function
const downloadCSV = (data: Question[], filename: string) => {
  const headers = [
    'Category',
    'Question ID',
    'Question Title',
    'Question Text',
    'Choices',
    'Round 1',
    'Round 2',
    'Round 3',
    'Round 4',
    'Round 5',
    'Round 6',
    'Round 7',
    'Round 8',
    'Round 9',
    'Round 10'
  ]

  const csvContent = [
    headers.join(','),
    ...data.map(question => [
      `"${question.categoryTitle}"`,
      `"${question.questionId}"`,
      `"${question.questionTitle.replace(/"/g, '""')}"`,
      `"${question.questionText.replace(/"/g, '""').replace(/\n/g, '\\n')}"`,
      `"${question.choices.replace(/"/g, '""').replace(/\n/g, '\\n')}"`,
      `"${question.round1 || ''}"`,
      `"${question.round2 || ''}"`,
      `"${question.round3 || ''}"`,
      `"${question.round4 || ''}"`,
      `"${question.round5 || ''}"`,
      `"${question.round6 || ''}"`,
      `"${question.round7 || ''}"`,
      `"${question.round8 || ''}"`,
      `"${question.round9 || ''}"`,
      `"${question.round10 || ''}"`,
    ].join(','))
  ].join('\n')

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', filename)
  link.style.visibility = 'hidden'
  
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

// Fetch questions function
const fetchQuestions = async (filters: FilterValues): Promise<Question[]> => {
  const url = buildQuestionsUrl(filters)
  const response = await axios.get<ApiResponse>(url)
  return response.data.data
}

export default function Questions() {
  const [selected, setSelected] = React.useState<readonly string[]>([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [selectedQuestion, setSelectedQuestion] = React.useState<Question | null>(null)
  
  // Filter state
  const [currentFilters, setCurrentFilters] = React.useState<FilterValues>({
    selectedCountry: '',
    selectedCategory: '',
    selectedRound: '',
    search: ''
  })
  const [searchTriggered, setSearchTriggered] = React.useState(false)

  // Fetch questions with current filters
  const {
    data: questions,
    isLoading,
    error,
    refetch,
  } = useQuery<Question[]>({
    queryKey: ['questions', currentFilters, searchTriggered],
    queryFn: () => fetchQuestions(currentFilters),
    enabled: true,
  })

  const handleFilterChange = (filters: FilterValues) => {
    setCurrentFilters(filters)
    setPage(0) // Reset to first page when filters change
  }

  const handleSearch = (filters: FilterValues) => {
    setCurrentFilters(filters)
    setSearchTriggered(prev => !prev) // Trigger refetch
    setPage(0)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && questions) {
      const newSelected = questions.map((n) => n.questionId)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (event: React.MouseEvent<unknown>, id: string) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: readonly string[] = []

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id)
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1))
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1))
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      )
    }
    setSelected(newSelected)
  }

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked)
  }

  const handleDownload = () => {
    if (!questions || selected.length === 0) {
      alert('Please select questions to download')
      return
    }

    const selectedQuestions = questions.filter(question => 
      selected.includes(question.questionId)
    )

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const filename = `selected-questions-${timestamp}.csv`

    downloadCSV(selectedQuestions, filename)
    alert(`Successfully downloaded ${selectedQuestions.length} questions!`)
    setSelected([])
  }

  const handleRowDoubleClick = (question: Question) => {
    setSelectedQuestion(question)
    setDetailOpen(true)
  }

  const handleDetailClose = () => {
    setDetailOpen(false)
    setSelectedQuestion(null)
  }

  const emptyRows = page > 0 && questions
    ? Math.max(0, (1 + page) * rowsPerPage - questions.length)
    : 0

  const visibleRows = React.useMemo(() => {
    if (!questions) return []
    return [...questions].slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    )
  }, [page, rowsPerPage, questions])

  if (error) {
    return (
      <Box>
        <Filter 
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          loading={isLoading}
        />
        <Alert severity="error" sx={{ m: 2 }}>
          Error loading questions: {(error as Error).message}
        </Alert>
      </Box>
    )
  }

  return (
    <Box sx={{ width: '100%' }}>
      {/* Filter Component */}
      <Filter 
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        loading={isLoading}
      />

      {/* Questions Table */}
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          onDownload={handleDownload}
          currentFilters={currentFilters}
        />
        
        {isLoading ? (
          <Box display="flex" justifyContent="center" alignItems="center" p={4}>
            <CircularProgress />
            <Typography sx={{ ml: 2 }}>Loading questions...</Typography>
          </Box>
        ) : (
          <>
            <TableContainer sx={{ maxHeight: 600 }}>
              <Table
                stickyHeader
                sx={{ 
                  minWidth: 750,
                  fontFamily: 'Helvetica, Arial, sans-serif',
                  '& .MuiTableCell-root': {
                    fontFamily: 'inherit',
                  },
                  '& .MuiTableHead-root .MuiTableCell-root': {
                    fontFamily: 'inherit',
                    fontWeight: 600,
                    backgroundColor: 'white',
                  }
                }}
                aria-labelledby='tableTitle'
                size={dense ? 'small' : 'medium'}
              >
                <EnhancedTableHead
                  numSelected={selected.length}
                  onSelectAllClick={handleSelectAllClick}
                  rowCount={questions?.length || 0}
                />
                <TableBody>
                  {visibleRows.map((row, index) => {
                    const isItemSelected = selected.includes(row.questionId)
                    const labelId = `enhanced-table-checkbox-${index}`

                    return (
                      <TableRow
                        hover
                        onClick={(event) => handleClick(event, row.questionId)}
                        onDoubleClick={() => handleRowDoubleClick(row)}
                        role='checkbox'
                        aria-checked={isItemSelected}
                        tabIndex={-1}
                        key={row.questionId}
                        selected={isItemSelected}
                        sx={{ cursor: 'pointer' }}
                      >
                        <TableCell padding='checkbox'>
                          <Checkbox
                            color='primary'
                            checked={isItemSelected}
                            inputProps={{ 'aria-labelledby': labelId }}
                          />
                        </TableCell>
                        <TableCell component='th' id={labelId} scope='row' padding='none'>
                          <Chip label={row.categoryTitle} color='primary' size='small' />
                        </TableCell>
                        <TableCell>{row.questionId}</TableCell>
                        <TableCell>{row.questionTitle}</TableCell>
                        <TableCell sx={{ maxWidth: 400 }}>
                          <Box sx={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>
                            {row.questionText}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ maxWidth: 300 }}>
                          <Box sx={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>
                            {row.choices}
                          </Box>
                        </TableCell>
                        <TableCell>{row.round1 || '-'}</TableCell>
                        <TableCell>{row.round2 || '-'}</TableCell>
                        <TableCell>{row.round3 || '-'}</TableCell>
                        <TableCell>{row.round4 || '-'}</TableCell>
                        <TableCell>{row.round5 || '-'}</TableCell>
                        <TableCell>{row.round6 || '-'}</TableCell>
                        <TableCell>{row.round7 || '-'}</TableCell>
                        <TableCell>{row.round8 || '-'}</TableCell>
                        <TableCell>{row.round9 || '-'}</TableCell>
                        <TableCell>{row.round10 || '-'}</TableCell>
                      </TableRow>
                    )
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                      <TableCell colSpan={16} />
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[5, 10, 25, 50]}
              component='div'
              count={questions?.length || 0}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </>
        )}
      </Paper>

      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label='Dense padding'
      />

      {/* Question Detail Dialog */}
      <Dialog open={detailOpen} onClose={handleDetailClose} maxWidth='md' fullWidth>
        <DialogTitle>Question Details</DialogTitle>
        <DialogContent>
          {selectedQuestion && (
            <Box>
              <Typography variant='body1'>
                <strong>Category:</strong> {selectedQuestion.categoryTitle}
              </Typography>
              <Typography variant='body1'>
                <strong>Question ID:</strong> {selectedQuestion.questionId}
              </Typography>
              <Typography variant='body1'>
                <strong>Title:</strong> {selectedQuestion.questionTitle}
              </Typography>
              <Typography variant='body1' sx={{ mt: 2 }}>
                <strong>Question Text:</strong>
              </Typography>
              <Box sx={{ whiteSpace: 'pre-wrap', mt: 1, mb: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                {selectedQuestion.questionText}
              </Box>
              <Typography variant='body1'>
                <strong>Choices:</strong>
              </Typography>
              <Box sx={{ whiteSpace: 'pre-wrap', mt: 1, mb: 2, p: 1, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                {selectedQuestion.choices}
              </Box>
              <Typography variant='body1' sx={{ mt: 2 }}><strong>Rounds:</strong></Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                {Array.from({ length: 10 }, (_, i) => {
                  const roundKey = `round${i + 1}` as keyof Question
                  const roundValue = selectedQuestion[roundKey]
                  return roundValue ? (
                    <Chip key={i + 1} label={`R${i + 1}: ${roundValue}`} size="small" />
                  ) : null
                })}
              </Box>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDetailClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  )
}
