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
} from '@mui/material'

interface ApiResponse {
  success: boolean
  data: Question[]
}

const QUESTIONS_URL = 'http://localhost:3000/api/questions'

interface HeadCell {
  disablePadding: boolean
  id: keyof Question
  label: string
  numeric: boolean
}

const headCells: readonly HeadCell[] = [
  {
    id: 'categoryTitle',
    numeric: false,
    disablePadding: true,
    label: 'Category',
  },
  {
    id: 'questionId',
    numeric: false,
    disablePadding: false,
    label: 'ID',
  },
  {
    id: 'questionTitle',
    numeric: false,
    disablePadding: false,
    label: 'Title',
  },
  {
    id: 'questionText',
    numeric: false,
    disablePadding: false,
    label: 'Question Text',
  },
  {
    id: 'round1',
    numeric: false,
    disablePadding: false,
    label: 'R1',
  },
  {
    id: 'round2',
    numeric: false,
    disablePadding: false,
    label: 'R2',
  },
  {
    id: 'round3',
    numeric: false,
    disablePadding: false,
    label: 'R3',
  },
  {
    id: 'round4',
    numeric: false,
    disablePadding: false,
    label: 'R4',
  },
  {
    id: 'round5',
    numeric: false,
    disablePadding: false,
    label: 'R5',
  },
  {
    id: 'round6',
    numeric: false,
    disablePadding: false,
    label: 'R6',
  },
  {
    id: 'round7',
    numeric: false,
    disablePadding: false,
    label: 'R7',
  },
  {
    id: 'round8',
    numeric: false,
    disablePadding: false,
    label: 'R8',
  },
  {
    id: 'round9',
    numeric: false,
    disablePadding: false,
    label: 'R9',
  },
  {
    id: 'round10',
    numeric: false,
    disablePadding: false,
    label: 'R10',
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
  onDownload: () => void // This should be on download? (To doownload the questions)
}

function EnhancedTableToolbar(props: EnhancedTableToolbarProps) {
  const { numSelected, onDownload } = props

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
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant='h6'
          id='tableTitle'
          component='div'
        ></Typography>
      )}
      {numSelected > 0 ? (
        <Tooltip title='Download'>
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

// Fetch the questions from the API
const fetchQuestions = async (): Promise<Question[]> => {
  const response = await axios.get<ApiResponse>(QUESTIONS_URL)
  return response.data.data
}

export default function Questions() {
  const [selected, setSelected] = React.useState<readonly string[]>([])
  const [page, setPage] = React.useState(0)
  const [dense, setDense] = React.useState(false)
  const [rowsPerPage, setRowsPerPage] = React.useState(5)
  const [detailOpen, setDetailOpen] = React.useState(false)
  const [selectedQuestion, setSelectedQuestion] =
    React.useState<Question | null>(null)

  const {
    data: questions,
    isLoading,
    error,
  } = useQuery<Question[]>({
    queryKey: ['questions'],
    queryFn: fetchQuestions,
  })

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

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0)
  }

  const handleChangeDense = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDense(event.target.checked)
  }

  const handleDownload = () => {
    // Implement delete functionality here
    console.log('Download selected:', selected)
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

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 && questions
      ? Math.max(0, (1 + page) * rowsPerPage - questions.length)
      : 0

  const visibleRows = React.useMemo(() => {
    if (!questions) return []

    return [...questions].slice(
      page * rowsPerPage,
      page * rowsPerPage + rowsPerPage
    )
  }, [page, rowsPerPage, questions])

  if (isLoading) {
    return <div>Loading Questions...</div>
  }

  if (error) {
    return <div>Something went wrong</div>
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar
          numSelected={selected.length}
          onDownload={handleDownload}
        />
        <TableContainer
          sx={{
            fontFamily: "'Montserrat', Helvetica, sans-serif",
          }}
        >
          <Table
            sx={{
              minWidth: 750,
              fontFamily: 'Helvetica, Arial, sans-serif',
              '& .MuiTableCell-root': {
                fontFamily: 'inherit',
              },
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
                        inputProps={{
                          'aria-labelledby': labelId,
                        }}
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
                    <TableCell sx={{ maxWidth: 300 }}>
                      <Box
                        sx={{
                          whiteSpace: 'pre-wrap',
                          overflow: 'auto',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {row.questionText}
                      </Box>
                    </TableCell>
                    <TableCell>{row.round1 || ' '}</TableCell>
                    <TableCell>{row.round2 || ' '}</TableCell>
                    <TableCell>{row.round3 || ' '}</TableCell>
                    <TableCell>{row.round4 || ' '}</TableCell>
                    <TableCell>{row.round5 || ' '}</TableCell>
                    <TableCell>{row.round6 || ' '}</TableCell>
                    <TableCell>{row.round7 || ' '}</TableCell>
                    <TableCell>{row.round8 || ' '}</TableCell>
                    <TableCell>{row.round9 || ' '}</TableCell>
                    <TableCell>{row.round10 || ' '}</TableCell>
                  </TableRow>
                )
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component='div'
          count={questions?.length || 0}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label='Dense padding'
      />

      {/* Question Detail Dialog */}
      {/* Add the api for the question details for all questions */}
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
              <Typography variant='body1'>
                <strong>Question Text:</strong> {selectedQuestion.questionText}
              </Typography>
              <Typography variant='body1'>
                <strong>Choices:</strong>
              </Typography>
              <Box component='ul' sx={{ pl: 2, mt: 1 }}>
                {selectedQuestion.choices.split('\n').map((choice, index) => (
                  <li key={index}>{choice}</li>
                ))}
              </Box>
              <Typography variant='body1' sx={{ mt: 2 }}>
                <strong>Round 1:</strong> {selectedQuestion.round1 || ''}
              </Typography>
              <Typography variant='body1' sx={{ mt: 2 }}>
                <strong>Round 2:</strong> {selectedQuestion.round2 || ''}
              </Typography>
              <Typography variant='body1' sx={{ mt: 2 }}>
                <strong>Round 3:</strong> {selectedQuestion.round3 || ''}
              </Typography>
              <Typography variant='body1' sx={{ mt: 2 }}>
                <strong>Round 4:</strong> {selectedQuestion.round4 || ''}
              </Typography>
              <Typography variant='body1' sx={{ mt: 2 }}>
                <strong>Round 5:</strong> {selectedQuestion.round5 || ''}
              </Typography>
              <Typography variant='body1' sx={{ mt: 2 }}>
                <strong>Round 6:</strong> {selectedQuestion.round6 || ''}
              </Typography>
              <Typography variant='body1' sx={{ mt: 2 }}>
                <strong>Round 7:</strong> {selectedQuestion.round7 || ''}
              </Typography>
              <Typography variant='body1' sx={{ mt: 2 }}>
                <strong>Round 8:</strong> {selectedQuestion.round8 || ''}
              </Typography>
              <Typography variant='body1' sx={{ mt: 2 }}>
                <strong>Round 9:</strong> {selectedQuestion.round9 || ''}
              </Typography>
              <Typography variant='body1' sx={{ mt: 2 }}>
                <strong>Round 10:</strong> {selectedQuestion.round10 || ''}
              </Typography>
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
