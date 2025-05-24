type Film = {
  id: string
  name: string
  description: string
  rating: number
}

type FilmSummary = Omit<Film, "description" | "rating">
