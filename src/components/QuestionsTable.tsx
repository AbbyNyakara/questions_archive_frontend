// src/components/QuestionsTable.tsx
import { useEffect, useState } from 'react'
import type { Question } from '../types/allquestions'
import { paginate } from '../utils/pagination'
import { v4 as uuidv4 } from 'uuid'
const PAGE_SIZE = 10

export default function QuestionsTable() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  useEffect(() => {
    async function fetchQuestions() {
      setLoading(true)
      setError(null)
      try {
        const res = await fetch('http://localhost:3000/api/questions')
        if (!res.ok) {
          throw new Error(`HTTP error: ${res.status}`)
        }
        const apiData = await res.json()
        setQuestions(apiData.data) // expects { data: [...] }
      } catch (err) {
        setError((err as Error).message)
      } finally {
        setLoading(false)
      }
    }
    fetchQuestions()
  }, [])

  const paginatedQuestions = paginate(questions, page, PAGE_SIZE)
  const totalPages = Math.ceil(questions.length / PAGE_SIZE)

  return (
    <div>
      <h2>Main questions</h2>
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>{error}</p>
      ) : (
        <>
          <table
            border={1}
            cellPadding={8}
            style={{ width: '100%', margin: '1rem 0' }}
          >
            <thead>
              <tr>
                <th>Category</th>
                <th>Question Title</th>
                <th>Question Text</th>
              </tr>
            </thead>
            <tbody>
              {paginatedQuestions.map((q) => (
                <tr key={uuidv4()}>
                  <td>{q.categoryTitle}</td>
                  <td>{q.questionTitle}</td>
                  <td>{q.questionText}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  )
}
