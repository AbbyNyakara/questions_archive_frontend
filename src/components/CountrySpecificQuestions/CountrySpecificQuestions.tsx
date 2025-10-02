
import type { CSQQuestion } from '../../types/csq-question'
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
  createTheme,
  ThemeProvider,
} from '@mui/material'
import CSQFilter from '../CsqFilters/CSQFilters'
import type { CSQFilterValues } from '../CsqFilters/CSQFilters'

interface CSQApiResponse {
  success: boolean
  data: CSQQuestion[]
}

const BASE_URL = `${import.meta.env.VITE_BASE_URL}`

// Create font theme:
const theme = createTheme({
  typography: {
    fontFamily: "'Montserrat', Helvetica, sans-serif",
  },
})

const buildCSQQuestionsUrl = ({
  selectedCountry,
  selectedRound,
}: CSQFilterValues): string => {
  const base = `${BASE_URL}/questions/csq`

  // Country + Round combination
  if (selectedCountry && selectedRound) {
    return `${base}/by-country-round/${encodeURIComponent(
      selectedCountry
    )}/${encodeURIComponent(selectedRound)}`
  }

  // Single filters
  // Round
  if (selectedRound) {
    return `${base}/by-round/${encodeURIComponent(selectedRound)}`
  }

  // Country
  if (selectedCountry) {
    return `${base}/by-country/${encodeURIComponent(selectedCountry)}`
  }

  // Default: all questions
  return `${base}/all`
}

interface HeadCell {
  disablePadding: boolean
  id: keyof CSQQuestion
  label: string
  numeric: boolean
  width?: number
}

// Updated headCells - removed csqId and csqCountryCode
const headCells: readonly HeadCell[] = [
  {
    id: 'csqRoundId',
    numeric: true,
    disablePadding: false,
    label: 'Round',
    width: 80,
  },
  {
    id: 'csqCountryName',
    numeric: false,
    disablePadding: false,
    label: 'Country',
    width: 120,
  },
  {
    id: 'csqQuestionTag',
    numeric: false,
    disablePadding: false,
    label: 'Tags',
    width: 250,
  },
  {
    id: 'csqQuestionText',
    numeric: false,
    disablePadding: false,
    label: 'Question Text',
    width: 450,
  },
  {
    id: 'csqLanguageTag',
    numeric: false,
    disablePadding: false,
    label: 'Language',
    width: 100,
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
  currentFilters: CSQFilterValues
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, onDownload, currentFilters } = props

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
            {/* Country Specific Questions */}
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
        <Tooltip title='Filter list'>
          <IconButton>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  )
}

// Helper function to render tags as chips with different colors
const renderTagChips = (tagString: string) => {
  const tags = tagString.split(' / ').map(tag => tag.trim()).filter(tag => tag.length > 0)
  const colors = ['primary', 'secondary', 'error', 'warning', 'info', 'success'] as const

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {tags.map((tag, index) => (
        <Chip
          key={index}
          label={tag}
          color={colors[index % colors.length]}
          size='small'
          variant='outlined'
        />
      ))}
    </Box>
  )
}

// Helper function to format text with newlines
const formatTextWithNewlines = (text: string) => {
  return text.replace(/\n/g, '\n')
}

// CSV Download function - updated to exclude removed columns
const downloadCSV = (data: CSQQuestion[], filename: string) => {
  const headers = [
    'Round',
    'Country',
    'Tags',
    'Question Text',
    'Language',
  ]

  const csvContent = [
    headers.join(','),
    ...data.map((question) =>
      [
        `"${question.csqRoundId}"`,
        `"${question.csqCountryName}"`,
        `"${question.csqQuestionTag.replace(/"/g, '""')}"`,
        `"${question.csqQuestionText.replace(/"/g, '""').replace(/\n/g, '\\n')}"`,
        `"${question.csqLanguageTag}"`,
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

// Fetch CSQ questions function
const fetchCSQQuestions = async (filters: CSQFilterValues): Promise<CSQQuestion[]> => {
  const url = buildCSQQuestionsUrl(filters)
  console.log('Fetching from URL:', url)
  const response = await axios.get<CSQApiResponse>(url)
  return response.data.data
}

export default function CSQQuestions() {
  const [selected, setSelected] = React.useState<readonly number[]>([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(10)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [selectedQuestion, setSelectedQuestion] = React.useState<CSQQuestion | null>(null)

  // Filter state
  const [currentFilters, setCurrentFilters] = React.useState<CSQFilterValues>({
    selectedCountry: '',
    selectedRound: '',
    search: '',
  })
  const [searchTriggered, setSearchTriggered] = React.useState(false)

  // Fetch questions with current filters
  const {
    data: questions,
    isLoading,
    error,
    // refetch,
  } = useQuery<CSQQuestion[]>({
    queryKey: ['csq-questions', currentFilters, searchTriggered],
    queryFn: () => fetchCSQQuestions(currentFilters),
    enabled: true,
  })

  // Apply text search filtering on the client side
  const filteredQuestions = React.useMemo(() => {
    if (!questions) return []

    if (!currentFilters.search || !currentFilters.search.trim()) {
      return questions
    }

    const searchTerm = currentFilters.search.toLowerCase().trim()
    return questions.filter((question) =>
      question.csqQuestionText.toLowerCase().includes(searchTerm) ||
      question.csqQuestionTag.toLowerCase().includes(searchTerm) ||
      question.csqCountryName.toLowerCase().includes(searchTerm) ||
      question.csqLanguageTag.toLowerCase().includes(searchTerm)
    )
  }, [questions, currentFilters.search])

  const handleFilterChange = (filters: CSQFilterValues) => {
    setCurrentFilters(filters)
    setPage(0) // Reset to first page when filters change
  }

  const handleSearch = (filters: CSQFilterValues) => {
    setCurrentFilters(filters)
    setSearchTriggered((prev) => !prev) // Trigger refetch
    setPage(0)
  }

  const handleSelectAllClick = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked && filteredQuestions) {
      const newSelected = filteredQuestions.map((n) => n.csqId)
      setSelected(newSelected)
      return
    }
    setSelected([])
  }

  const handleClick = (_event: React.MouseEvent<unknown>, id: number) => {
    const selectedIndex = selected.indexOf(id)
    let newSelected: readonly number[] = []

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

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeDense = (event: any) => {
    setDense(event.target.checked)
  }

  const handleDownload = () => {
    if (!filteredQuestions || selected.length === 0) {
      alert('Please select questions to download')
      return
    }

    const selectedQuestions = filteredQuestions.filter((question) =>
      selected.includes(question.csqId)
    )

    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-')
    const filename = `selected-csq-questions-${timestamp}.csv`

    downloadCSV(selectedQuestions, filename)
    alert(`Successfully downloaded ${selectedQuestions.length} questions!`)
    setSelected([])
  }

  const handleRowDoubleClick = (question: CSQQuestion) => {
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
        <CSQFilter
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          loading={isLoading}
        />
        <Alert severity='error' sx={{ m: 2 }}>
          Error loading CSQ questions: {(error as Error).message}
        </Alert>
      </Box>
    )
  }

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ width: '100%' }}>
        {/* Filter Component */}
        <CSQFilter
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          loading={isLoading}
        />

        {/* CSQ Questions Table */}
        <Paper sx={{ width: '100%', mb: 2 }}>
          <EnhancedTableToolbar
            numSelected={selected.length}
            onDownload={handleDownload}
            currentFilters={currentFilters}
          />

          {isLoading ? (
            <Box display='flex' justifyContent='center' alignItems='center' p={4}>
              <CircularProgress />
              <Typography sx={{ ml: 2 }}>Loading CSQ questions...</Typography>
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
                  size={dense ? 'small' : 'medium'}
                >
                  <EnhancedTableHead
                    numSelected={selected.length}
                    onSelectAllClick={handleSelectAllClick}
                    rowCount={filteredQuestions?.length || 0}
                  />
                  <TableBody>
                    {visibleRows.map((row, index) => {
                      const isItemSelected = selected.includes(row.csqId)
                      const labelId = `enhanced-table-checkbox-${index}`

                      return (
                        <TableRow
                          hover
                          onClick={(event) => handleClick(event, row.csqId)}
                          onDoubleClick={() => handleRowDoubleClick(row)}
                          role='checkbox'
                          aria-checked={isItemSelected}
                          tabIndex={-1}
                          key={row.csqId}
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
                          {/* Round - plain text without chip */}
                          <TableCell component='th' id={labelId} scope='row'>
                            {row.csqRoundId}
                          </TableCell>
                          {/* Country */}
                          <TableCell>{row.csqCountryName}</TableCell>
                          {/* Tags with colored chips */}
                          <TableCell sx={{ maxWidth: 250 }}>
                            {renderTagChips(row.csqQuestionTag)}
                          </TableCell>
                          {/* Question Text with newlines */}
                          <TableCell sx={{ maxWidth: 450 }}>
                            <Box sx={{ whiteSpace: 'pre-wrap', overflow: 'auto' }}>
                              {formatTextWithNewlines(row.csqQuestionText)}
                            </Box>
                          </TableCell>
                          {/* Language */}
                          <TableCell>{row.csqLanguageTag}</TableCell>
                        </TableRow>
                      )
                    })}
                    {emptyRows > 0 && (
                      <TableRow style={{ height: (dense ? 33 : 53) * emptyRows }}>
                        <TableCell colSpan={6} />
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

        <FormControlLabel
          control={<Switch checked={dense} onChange={handleChangeDense} />}
          label='Dense padding'
        />

        {/* Question Detail Dialog */}
        <Dialog open={detailOpen} onClose={handleDetailClose} maxWidth='md' fullWidth>
          <DialogTitle>CSQ Question Details</DialogTitle>
          <DialogContent>
            {selectedQuestion && (
              <Box>
                <Typography variant='body1'>
                  <strong>Round:</strong> {selectedQuestion.csqRoundId}
                </Typography>
                <Typography variant='body1'>
                  <strong>Country:</strong> {selectedQuestion.csqCountryName} ({selectedQuestion.csqCountryCode})
                </Typography>
                <Typography variant='body1'>
                  <strong>Language:</strong> {selectedQuestion.csqLanguageTag}
                </Typography>
                <Typography variant='body1' sx={{ mt: 2 }}>
                  <strong>Tags:</strong>
                </Typography>
                <Box sx={{ mt: 1, mb: 2 }}>
                  {renderTagChips(selectedQuestion.csqQuestionTag)}
                </Box>
                <Typography variant='body1'>
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
                  {formatTextWithNewlines(selectedQuestion.csqQuestionText)}
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





