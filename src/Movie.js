import React, { Component } from 'react'

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
      movie: this.props.results[0],
    }
  }

  onSelectMovie(id) {
    this.setState({ movie: this.props.results.find(result => result.id === id) })
  }

  render() {
    const { movie } = this.state
    const { movieName, results } = this.props
    if (!movie) {
      return (
        <tr>
          <td>{movieName}</td>
          <td>Not Found</td>
        </tr>
      )
    }
    const { id, title, overview, release_date, poster_path, genre_ids } = movie
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
              <strong>
                {title} ({release_date})
              </strong>
              <div>{genre_ids.map(id => GENRES[id]).join(', ')}</div>
              <div className="py-3">{overview}</div>
            </div>
          </div>
        </td>
      </tr>
    )
  }
}
