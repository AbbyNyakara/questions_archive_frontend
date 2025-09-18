// import './questions.css'
// import type { Question } from '../../types/questions'
// import { useQuery } from '@tanstack/react-query'
// import axios from 'axios'
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Typography,
//   Box,
//   CircularProgress,
//   Alert,
//   IconButton,
//   Collapse,
//   Chip,
//   styled
// } from '@mui/material';


// const QUESTIONS_URL = 'http://localhost:3000/api/questions'

// interface apiResponse {
//   success: boolean;
//   data: Question[]
// }

// const fetchQuestions = async():Promise<Question[]> => {
//   const response = await axios.get<apiResponse>(QUESTIONS_URL)
//   return response.data.data
// }

// const Questions = () => {

//   const {data, isLoading, error} = useQuery<Question[]>({
//     queryKey: ['questions'], 
//     queryFn: fetchQuestions
//   })

//   if (isLoading) return <div className="loading">Loading Questions...</div>
//   if (error) return <div className="err">Something went wrong </div>
//   return (
//     <div className="questions">
//       {
//         data?.map(q => (
//           q.categoryTitle
//         ))
//       }
//     </div>
//   )
// }

// export default Questions

