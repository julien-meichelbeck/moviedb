import React, { Component } from 'react'
import * as movieApi from './MovieApi'

const GENRES = {
  28: 'Action',
  12: 'Aventure',
  16: 'Animation',
  35: 'Comédie',
  80: 'Crime',
  99: 'Documentaire',
  18: 'Drame',
  10751: 'Familial',
  14: 'Fantastique',
  36: 'Histoire',
  27: 'Horreur',
  10402: 'Musique',
  9648: 'Mystère',
  10749: 'Romance',
  878: 'Science-Fiction',
  10770: 'Téléfilm',
  53: 'Thriller',
  10752: 'Guerre',
  37: 'Western',
}

export default class Movie extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedMovie: this.props.results[0],
    }
  }

  onSelectMovie(id) {
    this.setState({ selectedMovie: this.props.results.find(result => result.id === id), details: {} })
  }

  showDetails(event) {
    event.preventDefault()
    movieApi
      .details(this.state.selectedMovie)
      .then(response => response.json())
      .then(details => this.setState({ details }))
  }

  render() {
    const { selectedMovie, details = {} } = this.state
    const { movieName, results } = this.props
    if (!selectedMovie) {
      return (
        <tr>
          <td>{movieName}</td>
          <td>Not Found</td>
        </tr>
      )
    }
    const { id, title, overview, release_date, poster_path, genre_ids, original_title } = selectedMovie
    return (
      <tr>
        <td style={{ width: 250 }}>
          <strong>{movieName}</strong>
          <ul>
            {results.slice(0, 6).map(({ id: resultId, title }) => (
              <li key={resultId}>
                {id === resultId ? (
                  title
                ) : (
                  <a
                    href="#"
                    onClick={event => {
                      event.preventDefault()
                      this.onSelectMovie(resultId)
                    }}
                  >
                    {title}
                  </a>
                )}
              </li>
            ))}
          </ul>
        </td>
        <td>
          <div className="d-flex">
            <div>
              <img src={`https://image.tmdb.org/t/p/w500/${poster_path}`} style={{ width: 150 }} />
            </div>
            <div className="px-3">
              <a href="#" className="btn btn-outline-dark float-right" onClick={this.showDetails.bind(this)}>
                show more
              </a>
              <strong>{title}</strong>
              {original_title && original_title !== title ? <span>{` (${original_title}) `}</span> : null} ({
                release_date
              })
              <div>
                <strong>Genres:</strong> {genre_ids.map(id => GENRES[id]).join(', ')}
              </div>
              <div>
                {details.production_countries ? (
                  <span>
                    <strong>Countries:</strong> {details.production_countries.map(({ name }) => name).join(', ')}
                  </span>
                ) : null}
              </div>
              <div>
                {details.credits && details.credits.cast ? (
                  <span>
                    <strong>Casting:</strong>{' '}
                    {details.credits.cast
                      .slice(0, 5)
                      .map(({ name }) => name)
                      .join(', ')}
                  </span>
                ) : null}
              </div>
              <div className="py-3">{overview}</div>
            </div>
          </div>
        </td>
      </tr>
    )
  }
}
