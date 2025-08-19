import { useState, useEffect } from 'react'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import type { CountrySpecificQuestion } from '../../types/csq/csq'
import './csq.css'

const csq_endpoint = 'http://localhost:3000/api/questions/csq/Togo/5'

const CountrySpecificQuestions = () => {
  const [csqQuestions, setCsqQuestions] = useState<CountrySpecificQuestion[]>(
    []
  )
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCsqQuestions = async () => {
      try {
        setLoading(true)
        setError(null)

        const response = await axios.get(csq_endpoint)
        setCsqQuestions(response.data.data)
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchCsqQuestions()
  }, [])

  if (loading) return <div>Loading...</div> // Create a different component for this:
  if (error) return <div>Error Loading Country-specific Questions: {error}</div> // Ditto

  return (
    <div className='csq-container'>
      <h2 className='questions-title'>Country-Specific Questions</h2>
      <div className='q-container'>
        <table className='table-bordered'>
          {/* Table head */}
          <thead className='csq-thead'>
            <tr>
              <td>Question Tag</td>
              <td>Question Text</td>
              <td>Country Name</td>
              <td>Survey round</td>
              <td>Language</td>
            </tr>
          </thead>

          {/* Table body */}
          <tbody>
            {csqQuestions.map((question) => (
              <tr className='question-card' key={uuidv4()}>
                <td className='col-qstnTag'>
                  <p className='csq-question-tag'>{question.csqQuestionTag}</p>
                </td>
                <td className='col-qstnText'>
                  <p className='csq-question'>{question.csqQuestionText}</p>
                </td>
                <td className='col-qstnCountry'>
                  <p className='csq-country'>{question.csqCountryName}</p>
                </td>
                <td className='col-qstnRound'>
                  <p className='csq-round'>{question.csqRoundId}</p>
                </td>
                <td className='col-language'>
                  <p className='csq-language'>{question.csqLanguageTag}</p>
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

export default CountrySpecificQuestions
