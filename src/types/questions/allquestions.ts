export type Question = {
  categoryTitle: string
  questionTitle: string
  questionText: string
  choices: string
}

export type ApiResponse = {
  data: Question[]
  total: number 
  page: number
  pageSize: number
}
