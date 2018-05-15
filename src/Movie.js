import React, { Component } from "react"
import * as movieApi from "./MovieApi"
import Videos from "./Videos"
import MovieSelector from "./MovieSelector"

const GENRES = {
  28: "Action",
  12: "Aventure",
  16: "Animation",
  35: "Comédie",
  80: "Crime",
  99: "Documentaire",
  18: "Drame",
  10751: "Familial",
  14: "Fantastique",
  36: "Histoire",
  27: "Horreur",
  10402: "Musique",
  9648: "Mystère",
  10749: "Romance",
  878: "Science-Fiction",
  10770: "Téléfilm",
  53: "Thriller",
  10752: "Guerre",
  37: "Western"
}

export default class Movie extends Component {
  state = {
    selectedMovie: this.props.results[0],
    details: {}
  }

  onSelectMovie = id => {
    this.setState({
      selectedMovie: this.props.results.find(result => result.id === id),
      details: {}
    })
  }

  showDetails = event => {
    event.preventDefault()
    movieApi
      .details(this.state.selectedMovie)
      .then(response => response.json())
      .then(details => this.setState({ details }))
  }

  render() {
    const { selectedMovie, details = {} } = this.state
    const { videos = { results: [] } } = details
    const { movieName, results } = this.props
    if (!selectedMovie) {
      return (
        <div className="card mb-3">
          <div className="card-header">
            <h5 className="card-title">{movieName}</h5>
          </div>
          <div className="card-body">Not Found</div>
        </div>
      )
    }
    const { id, overview, release_date, poster_path, genre_ids, title, original_title } = selectedMovie
    return (
      <div className="card mb-3">
        <div className="card-header">
          <MovieSelector id={id} movieName={movieName} results={results} onSelectMovie={this.onSelectMovie} />
        </div>
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <div className="card-text d-flex">
            <div>
              <img src={`https://image.tmdb.org/t/p/w500/${poster_path}`} style={{ width: 150, maxHeight: "100%" }} />
              <a href="#" className="btn btn-primary btn-dark btn-block mt-2" onClick={this.showDetails}>
                More
              </a>
            </div>
            <div className="px-3">
              {original_title && original_title !== title ? (
                <div>
                  <strong>Nom VO:</strong> {original_title}
                </div>
              ) : null}
              <div>
                <strong>Sortie:</strong> {release_date}
              </div>
              <div>
                <strong>Genres:</strong> {genre_ids.map(id => GENRES[id]).join(", ")}
              </div>
              <div>
                {details.production_countries ? (
                  <span>
                    <strong>Countries:</strong> {details.production_countries.map(({ name }) => name).join(", ")}
                  </span>
                ) : null}
              </div>
              <div>
                {details.credits && details.credits.cast ? (
                  <span>
                    <strong>Casting:</strong>{" "}
                    {details.credits.cast
                      .slice(0, 5)
                      .map(({ name }) => name)
                      .join(", ")}
                  </span>
                ) : null}
              </div>
              <Videos videos={videos.results} />
              <div className="py-3">{overview}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
