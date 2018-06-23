import React, { Component } from "react"
import * as movieApi from "./MovieApi"
import Videos from "./Videos"
import MovieSelector from "./MovieSelector"
import ImdbRating from "./ImdbRating"
import $ from "jquery"

window.imdb = {
  rating: {
    run({ resource: { id, rating, ratingCount } }) {
      window[id]({ rating, ratingCount })
    }
  }
}

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
    selectedMovieId: this.props.results[0] ? this.props.results[0].id : null,
    results: this.props.results
  }

  getSelectedMovie = () => this.state.results.find(result => result.id === this.state.selectedMovieId)

  updateResult = newValues => {
    this.setState({
      results: this.state.results.map(
        result => (result.id === this.state.selectedMovieId ? { ...result, ...newValues } : result)
      )
    })
  }

  showDetails = event => {
    event.preventDefault()

    movieApi
      .details(this.state.selectedMovieId)
      .then(response => response.json())
      .then(details => {
        this.updateResult({ details })
        window[`/title/${details.imdb_id}/`] = imdbData => this.updateResult({ imdbData })
        $.getScript(
          `https://p.media-imdb.com/static-content/documents/v1/title/${
            details.imdb_id
          }/ratings%3Fjsonp=imdb.rating.run:imdb.api.title.ratings/data.json`
        )
      })
  }

  render() {
    const selectedMovie = this.getSelectedMovie()
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

    const {
      id,
      overview,
      release_date,
      poster_path,
      genre_ids,
      title,
      original_title,
      details = {},
      imdbData
    } = selectedMovie
    const { videos = { results: [] } } = details

    return (
      <div className="card mb-3">
        <div className="card-header">
          <MovieSelector
            id={id}
            movieName={movieName}
            results={results}
            onSelectMovie={selectedMovieId => this.setState({ selectedMovieId })}
          />
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
              {imdbData ? (
                <div>
                  <ImdbRating {...imdbData} />
                </div>
              ) : null}
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
