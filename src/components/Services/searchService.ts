// src/services/searchService.ts
import axios from "axios"

interface Filters {
  country?: string
  category?: string
  round?: string
  search?: string
}

export async function searchDatabase(filters: Filters) {
    return []
//   try {
//     const res = await axios.get("http://localhost:3000/api/search", {
//       params: filters,
//     })
//     return res.data
//   } catch (err) {
//     console.error("Search error:", err)
//     throw err
//   }
}
