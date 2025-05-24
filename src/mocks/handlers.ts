/* eslint-disable @typescript-eslint/no-explicit-any */
import { http, HttpResponse } from "msw"

const films =
  ((globalThis as any).filmsMap as Map<number, Film>) ||
  new Map([
    [1, { id: "1", name: "Test film", description: "Test film", rating: 5 }],
  ])
;(globalThis as any).filmsMap = films

const backendUrl = `http://localhost:3100`

function getIsError() {
  return Math.random() > 0.75
}

export const handlers = [
  http.get(`${backendUrl}/films`, () => {
    const filmsValues = Array.from(films.values())

    const filmsSummary = filmsValues.map((film) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { description, rating, ...strippedFilm } = film

      return strippedFilm
    })

    return getIsError() ? HttpResponse.error() : HttpResponse.json(filmsSummary)
  }),
  http.get(`${backendUrl}/films/:filmId`, ({ params }) => {
    const filmId =
      typeof params.filmId === "string" ? Number(params.filmId) : NaN

    if (!Number.isInteger(filmId)) {
      return HttpResponse.json({ message: "Invalid film ID" }, { status: 400 })
    }

    const film = films.get(filmId)

    return film
      ? HttpResponse.json(film)
      : HttpResponse.json({ message: "Film not found" }, { status: 404 })
  }),
  http.post(`${backendUrl}/films`, async ({ request }) => {
    const film = (await request.json()) as Omit<Film, "id">

    const newId = films.size > 0 ? Math.max(...films.keys()) + 1 : 1

    const newFilm: Film = {
      ...film,
      id: String(newId),
    }

    films.set(newId, newFilm)

    return HttpResponse.json(newFilm, { status: 201 })
  }),
  http.delete(`${backendUrl}/films/:filmId`, ({ params }) => {
    const filmId =
      typeof params.filmId === "string" ? Number(params.filmId) : NaN

    if (!Number.isInteger(filmId)) {
      return HttpResponse.json({ message: "Invalid film ID" }, { status: 400 })
    }

    const deleted = films.delete(filmId)

    return deleted
      ? HttpResponse.json(
          { message: "Film deleted successfully" },
          { status: 200 }
        )
      : HttpResponse.json({ message: "Film not found" }, { status: 404 })
  }),
]
