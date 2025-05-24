/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState, type FormEvent } from "react"

type FilmSummary = {
  id: string
  name: string
  description: string
  rating: number
}

const backendUrl = `http://localhost:3100`

function App() {
  const [films, setFilms] = useState<FilmSummary[]>([])
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [rating, setRating] = useState(5)
  const [error, setError] = useState<string | null>(null)

  const fetchAndSetFilms = async () => {
    try {
      const response = await fetch(`${backendUrl}/films`)
      if (!response.ok)
        throw new Error(`Error fetching films: ${response.status}`)
      const data = await response.json()
      setFilms(data)
    } catch (e: any) {
      setError(e.message || "Unknown error")
    }
  }

  useEffect(() => {
    fetchAndSetFilms()
  }, [])

  const handleAddFilm = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    const newFilm = { name, description, rating }

    try {
      const response = await fetch(`${backendUrl}/films`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFilm),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.message || `Failed to add film (${response.status})`
        )
      }

      await fetchAndSetFilms()

      setName("")
      setDescription("")
      setRating(5)
    } catch (e: any) {
      setError(e.message)
    }
  }

  const handleDeleteFilm = async (id: string) => {
    setError(null)
    try {
      const response = await fetch(`${backendUrl}/films/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(
          errorData.message || `Failed to delete film (${response.status})`
        )
      }

      await fetchAndSetFilms()
    } catch (e: any) {
      setError(e.message)
    }
  }

  return (
    <div>
      <h1>Films</h1>

      {error && (
        <p style={{ color: "red" }}>
          <strong>Error:</strong> {error}
        </p>
      )}

      <form onSubmit={handleAddFilm} style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{ marginRight: 8 }}
        />
        <input
          type="text"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{ marginRight: 8 }}
        />
        <input
          type="number"
          placeholder="Rating"
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          min={1}
          max={10}
          required
          style={{ marginRight: 8, width: 60 }}
        />
        <button type="submit">Add Film</button>
      </form>

      <ul>
        {films.map((film) => (
          <li key={film.id} style={{ marginBottom: 8 }}>
            <a href={`/film/${film.id}`}>{film.name}</a>{" "}
            <button
              onClick={() => handleDeleteFilm(film.id)}
              style={{ marginLeft: 8 }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App
