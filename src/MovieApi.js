const API_KEY = "d533369a57d21cba80e1b1c060585c47"
const BASE_PATH = "https://api.themoviedb.org/3"

const search = movieName => fetch(`${BASE_PATH}/search/movie?api_key=${API_KEY}&query=${movieName}&language=fr`)

const MOVIE_RESOURCES = ["credits", "videos"].join(",")
const details = id =>
  fetch(`${BASE_PATH}/movie/${id}?api_key=${API_KEY}&language=fr&append_to_response=${MOVIE_RESOURCES}`)

export { search, details }
