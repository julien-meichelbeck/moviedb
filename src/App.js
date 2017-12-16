import React, { Component } from 'react'
import recompact from 'recompact'
import { BehaviorSubject, Subject } from 'rxjs'
import './App.css'

const API_KEY = 'd533369a57d21cba80e1b1c060585c47'

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

class Movie extends Component {
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
        <td style={{ width: 200 }}>
          <strong>
            {title} ({release_date})
          </strong>
          <div>{genre_ids.map(id => GENRES[id]).join(', ')}</div>
        </td>
        <td>
          <img src={`https://image.tmdb.org/t/p/w500/${poster_path}`} style={{ width: 150, height: 200 }} />
        </td>
        <td className="movie-table-description">{overview}</td>
      </tr>
    )
  }
}

export default recompact.compose(
  recompact.withObs(() => {
    const savedMovieDescriptions = localStorage.getItem('movieResults')
      ? JSON.parse(localStorage.getItem('movieResults'))
      : undefined
    const submit$ = new Subject()
    const text$ = new BehaviorSubject('')
    const movieNames$ = submit$.withLatestFrom(text$, (submit, text) => text.split('\n').filter(name => name.length))
    const movieResults$ = movieNames$
      .switchMap(movieNames => {
        return Promise.all(
          movieNames.map(movieName =>
            fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${movieName}&language=fr`)
          )
        ).then(responses => Promise.all(responses.map(response => response.json())))
      })
      .withLatestFrom(movieNames$, (jsons, names) =>
        names.reduce(
          (acc, elem, index) => ({
            ...acc,
            [elem]: jsons[index].results,
          }),
          {}
        )
      )
      .do(movieResults => localStorage.setItem('movieResults', JSON.stringify(movieResults)))
      .startWith(savedMovieDescriptions)

    return {
      text$,
      submit$,
      movieNames$,
      movieResults$,
    }
  }),
  recompact.connectObs(({ text$, submit$, movieResults$ }) => ({
    onChange: text$,
    onSubmit: submit$,
    value: text$,
    movieResults: movieResults$,
  })),
  recompact.withHandlers({
    onChange: ({ onChange }) => event => {
      const text = event.target.value
      if (text.split('\n').length <= 40) {
        onChange(text)
      }
    },
  })
)(({ value, onChange, onSubmit, movieResults }) => (
  <div className="container">
    <h2>Movie database</h2>
    <textarea
      value={value}
      onChange={onChange}
      style={{ width: 300, height: 440 }}
      placeholder="One movie name per line (max 40)"
    />

    <br />

    <button onClick={onSubmit} className="btn btn-success">
      Search
    </button>

    {movieResults ? (
      <div>
        <hr />
        <table className="movie-table">
          <tbody>
            {Object.entries(movieResults).map(([movieName, results]) => (
              <Movie key={movieName} movieName={movieName} results={results} />
            ))}
          </tbody>
        </table>
      </div>
    ) : null}
  </div>
))
