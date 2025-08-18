import { useEffect, useState } from 'react'
import axios from 'axios'
import type { Question } from '../../types/questions/allquestions'
import './questions.css'
import { v4 as uuidv4 } from 'uuid'

const questions_endpoint = 'http://localhost:3000/api/questions'

const Questions = () => {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await axios.get(questions_endpoint)
        setQuestions(response.data.data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [])

  if (loading) return <div>Loading questions...</div> // Add global styling for this
  if (error) return <div>Error loading questions: {error}</div> // Ditto

  return (
    <div className='questions-container'>
      <h2 className='questions-title'>Main Survey Questions</h2>
      <div className='container'>
        <table className='table-bordered'>
          {/* Table head */}
          <thead>
            <tr>
              <td>Category</td>
              <td>Question Title</td>
              <td>Question Text</td>
              <td>Choices</td>
            </tr>
          </thead>
          {/* Table Body */}
          <tbody>
            {questions.map((question) => (
              <tr className='question-card' key={uuidv4()}>
                <td className='col-category'>
                  <p className='question-category'>{question.categoryTitle}</p>
                </td>
                <td className='col-title'>
                  <p className='question-title'>{question.questionTitle}</p>
                </td>
                <td className='col-text'>
                  <p className='question-text'>{question.questionText}</p>
                </td>
                <td className='col-choices'>
                  <p className='question-choices'>{question.choices}</p>
                </td>
              </tr>
            ))}
          </tbody>
          {/* End of Table body */}
        </table>
      </div>
    </div>
  )
}

export default Questions
