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
  createTheme,
  ThemeProvider,
} from '@mui/material'
import Filter from '../Filters/Filters'
import type { FilterValues } from '../Filters/Filters'

interface ApiResponse {
  success: boolean
  data: Question[]
}

const BASE_URL = `${import.meta.env.VITE_BASE_URL}`
// console.log(`Base url is : ${BASE_URL}`)
// Create font theme:
const theme = createTheme({
  typography: {
    fontFamily: "'Montserrat', Helvetica, sans-serif",
  },
})

// Modified to exclude search from URL building
const buildQuestionsUrl = ({
  selectedCountry,
  selectedCategory,
  selectedRound,
}: Omit<FilterValues, 'search'>): string => {
  const base = `${BASE_URL}/questions`

  // All three filters: Country + Round + Category
  if (selectedCountry && selectedRound && selectedCategory) {
    return `${base}/by-country-round-category/${encodeURIComponent(
      selectedCountry
    )}/${encodeURIComponent(selectedRound)}/${encodeURIComponent(
      selectedCategory
    )}`
  }

  // Two filter combinations:
  // Country and Round
  if (selectedCountry && selectedRound) {
    return `${base}/by-country-round/${encodeURIComponent(
      selectedCountry
    )}/${encodeURIComponent(selectedRound)}`
  }

  // Category and Round
  if (selectedCategory && selectedRound) {
    return `${base}/by-category-round/${encodeURIComponent(
      selectedCategory
    )}/${encodeURIComponent(selectedRound)}`
  }

  // Country and Category
  if (selectedCountry && selectedCategory) {
    return `${base}/by-country-category/${encodeURIComponent(
      selectedCountry
    )}/${encodeURIComponent(selectedCategory)}`
  }

  // Single filters
  // Round
  if (selectedRound) {
    return `${base}/by-round/${encodeURIComponent(selectedRound)}`
  }

  // Category
  if (selectedCategory) {
    return `${base}/by-category/${encodeURIComponent(selectedCategory)}`
  }

  // country
  if (selectedCountry) {
    return `${base}/by-country/${encodeURIComponent(selectedCountry)}`
  }

  // else: - All default questions
  return base
}

// Client-side search function - The text search implemented on client side
const filterQuestionsBySearch = (
  questions: Question[],
  searchTerm: string
): Question[] => {
  if (!searchTerm.trim()) return questions

  const lowercaseSearch = searchTerm.toLowerCase().trim()

  return questions.filter(
    (question) =>
      question.categoryTitle.toLowerCase().includes(lowercaseSearch) ||
      question.questionText.toLowerCase().includes(lowercaseSearch) ||
      question.questionTitle.toLowerCase().includes(lowercaseSearch)
  )
}

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
    label: 'Label',
    width: 120,
  },
  {
    id: 'questionId',
    numeric: false,
    disablePadding: false,
    label: 'ID',
    width: 120,
  },
  {
    id: 'questionTitle',
    numeric: false,
    disablePadding: false,
    label: 'Title',
    width: 230,
  },
  {
    id: 'questionText',
    numeric: false,
    disablePadding: false,
    label: 'Question text',
    width: 450,
  },
  {
    id: 'choices',
    numeric: false,
    disablePadding: false,
    label: 'Response options',
    width: 350,
  },
  {
    id: 'round1',
    numeric: false,
    disablePadding: false,
    label: 'R1',
    width: 100,
  },
  {
    id: 'round2',
    numeric: false,
    disablePadding: false,
    label: 'R2',
    width: 70,
  },
  {
    id: 'round3',
    numeric: false,
    disablePadding: false,
    label: 'R3',
    width: 70,
  },
  {
    id: 'round4',
    numeric: false,
    disablePadding: false,
    label: 'R4',
    width: 70,
  },
  {
    id: 'round5',
    numeric: false,
    disablePadding: false,
    label: 'R5',
    width: 70,
  },
  {
    id: 'round6',
    numeric: false,
    disablePadding: false,
    label: 'R6',
    width: 70,
  },
  {
    id: 'round7',
    numeric: false,
    disablePadding: false,
    label: 'R7',
    width: 70,
  },
  {
    id: 'round8',
    numeric: false,
    disablePadding: false,
    label: 'R8',
    width: 70,
  },
  {
    id: 'round9',
    numeric: false,
    disablePadding: false,
    label: 'R9',
    width: 70,
  },
  {
    id: 'round10',
    numeric: false,
    disablePadding: false,
    label: 'R10',
    width: 70,
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
              width: headCell.width,
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
  totalQuestions: number
  filteredQuestions: number
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const {
    numSelected,
    onDownload,
    currentFilters,
    totalQuestions,
    filteredQuestions,
  } = props

  const hasFilters = Object.values(currentFilters).some((value) => value !== '')

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
        <Box
          sx={{
            flex: '1 1 100%',
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Typography variant='h6' id='tableTitle' component='div'>
            {hasFilters && (
              <span style={{ fontSize: '0.9rem', fontWeight: 'normal' }}>
                Showing {filteredQuestions} of {totalQuestions} questions
              </span>
            )}
          </Typography>
          {hasFilters && (
            <Chip
              label='Filtered'
              color='primary'
              size='small'
              icon={<FilterListIcon fontSize='small' />}
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
        // Remove this altogether
        <Tooltip title='Filter list'>
          <IconButton>
            {/* <FilterListIcon /> */}
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
    'Round 10',
  ]

  const csvContent = [
    headers.join(','),
    ...data.map((question) =>
      [
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
      ].join(',')
    ),
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

// Modified fetch function - excludes search parameter
const fetchQuestions = async (filters: FilterValues): Promise<Question[]> => {
  const { search, ...serverFilters } = filters
  const url = buildQuestionsUrl(serverFilters)
  const response = await axios.get<ApiResponse>(url)
  return response.data.data
}

export default function Questions() {
  const [selected, setSelected] = React.useState<readonly string[]>([])
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [selectedQuestion, setSelectedQuestion] =
    React.useState<Question | null>(null)

  // Filter state
  const [currentFilters, setCurrentFilters] = React.useState<FilterValues>({
    selectedCountry: '',
    selectedCategory: '',
    selectedRound: '',
    search: '',
  })

  // Fetch questions with current filters (excluding search)
  const {
    data: allQuestions,
    isLoading,
    error,
  } = useQuery<Question[]>({
    queryKey: [
      'questions',
      currentFilters.selectedCountry,
      currentFilters.selectedCategory,
      currentFilters.selectedRound,
    ],
    queryFn: () => fetchQuestions(currentFilters),
    enabled: true,
  })

  // Apply client-side search filtering
  const filteredQuestions = React.useMemo(() => {
    if (!allQuestions) return []
    return filterQuestionsBySearch(allQuestions, currentFilters.search)
  }, [allQuestions, currentFilters.search])

  const handleFilterChange = (filters: FilterValues) => {
    setCurrentFilters(filters)
    setPage(0) // Reset to first page when filters change
    setSelected([]) // Clear selections when filters change
  }

  const handleSearch = (filters: FilterValues) => {
    // For client-side search, just update filters
    handleFilterChange(filters)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && filteredQuestions) {
      const newSelected = filteredQuestions.map((n) => n.questionId)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (_event: React.MouseEvent<unknown>, id: string) => {
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

  const handleChangePage = (_event: unknown, newPage: number) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleDownload = () => {
    if (!filteredQuestions || selected.length === 0) {
      alert('Please select questions to download')
      return
    }

    const selectedQuestions = filteredQuestions.filter((question) =>
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

  const emptyRows =
    page > 0 && filteredQuestions
      ? Math.max(0, (1 + page) * rowsPerPage - filteredQuestions.length)
      : 0

  const visibleRows = React.useMemo(() => {
    if (!filteredQuestions) return []
    return [...filteredQuestions].slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    )
  }, [page, rowsPerPage, filteredQuestions])

  if (error) {
    return (
      <Box>
        <Filter
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          loading={isLoading}
        />
        <Alert severity='error' sx={{ m: 2 }}>
          Error loading questions: {(error as Error).message}
        </Alert>
      </Box>
    )
  }

  return (
    <ThemeProvider theme={theme}>
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
            totalQuestions={allQuestions?.length || 0}
            filteredQuestions={filteredQuestions?.length || 0}
          />

          {isLoading ? (
            <Box
              display='flex'
              justifyContent='center'
              alignItems='center'
              p={4}
            >
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Loading questions...</Typography>
            </Box>
          ) : (
            <>
              <TableContainer sx={{ maxHeight: 400 }}>
                <Table
                  stickyHeader
                  sx={{
                    minWidth: 750,
                    '& .MuiTableCell-root': {
                      fontFamily: 'inherit',
                    },
                    '& .MuiTableHead-root .MuiTableCell-root': {
                      fontFamily: 'inherit',
                      fontWeight: 600,
                      backgroundColor: 'white',
                    },
                  }}
                  aria-labelledby='tableTitle'
                >
                  <EnhancedTableHead
                    numSelected={selected.length}
                    onSelectAllClick={handleSelectAllClick}
                    rowCount={filteredQuestions?.length || 0}
                  />
                  <TableBody>
                    {visibleRows.map((row, index) => {
                      const isItemSelected = selected.includes(row.questionId)
                      const labelId = `enhanced-table-checkbox-${index}`

                      return (
                        <TableRow
                          hover
                          onClick={(event) =>
                            handleClick(event, row.questionId)
                          }
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
                          <TableCell
                            component='th'
                            id={labelId}
                            scope='row'
                            padding='none'
                          >
                            <Chip
                              label={row.categoryTitle}
                              color='primary'
                              size='small'
                            />
                          </TableCell>
                          <TableCell>{row.questionId}</TableCell>
                          <TableCell>{row.questionTitle}</TableCell>
                          <TableCell sx={{ maxWidth: 400 }}>
                            <Box
                              sx={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}
                            >
                              {row.questionText}
                            </Box>
                          </TableCell>
                          <TableCell sx={{ maxWidth: 300 }}>
                            <Box
                              sx={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}
                            >
                              {row.choices}
                            </Box>
                          </TableCell>
                          <TableCell>{row.round1 || ''}</TableCell>
                          <TableCell>{row.round2 || ''}</TableCell>
                          <TableCell>{row.round3 || ''}</TableCell>
                          <TableCell>{row.round4 || ''}</TableCell>
                          <TableCell>{row.round5 || ''}</TableCell>
                          <TableCell>{row.round6 || ''}</TableCell>
                          <TableCell>{row.round7 || ''}</TableCell>
                          <TableCell>{row.round8 || ''}</TableCell>
                          <TableCell>{row.round9 || ''}</TableCell>
                          <TableCell>{row.round10 || ''}</TableCell>
                        </TableRow>
                      )
                    })}
                    {emptyRows > 0 && (
                      <TableRow>
                        <TableCell colSpan={16} />
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
              <TablePagination
                rowsPerPageOptions={[5, 10, 25, 50]}
                component='div'
                count={filteredQuestions?.length || 0}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </>
          )}
        </Paper>

        {/* Question Detail Dialog */}
        <Dialog
          open={detailOpen}
          onClose={handleDetailClose}
          maxWidth='md'
          fullWidth
        >
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
                <Box
                  sx={{
                    whiteSpace: 'pre-wrap',
                    mt: 1,
                    mb: 2,
                    p: 1,
                    bgcolor: '#f5f5f5',
                    borderRadius: 1,
                  }}
                >
                  {selectedQuestion.questionText}
                </Box>
                <Typography variant='body1'>
                  <strong>Response options:</strong>
                </Typography>
                <Box
                  sx={{
                    whiteSpace: 'pre-wrap',
                    mt: 1,
                    mb: 2,
                    p: 1,
                    bgcolor: '#f5f5f5',
                    borderRadius: 1,
                  }}
                >
                  {selectedQuestion.choices}
                </Box>
                <Typography variant='body1' sx={{ mt: 2 }}>
                  <strong>Rounds:</strong>
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {Array.from({ length: 10 }, (_, i) => {
                    const roundKey = `round${i + 1}` as keyof Question
                    const roundValue = selectedQuestion[roundKey]
                    return roundValue ? (
                      <Chip
                        key={i + 1}
                        label={`R${i + 1}: ${roundValue}`}
                        size='small'
                      />
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
    </ThemeProvider>
  )
}
