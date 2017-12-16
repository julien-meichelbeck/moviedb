import React from 'react'
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

const Movie = ({ movieName, movieDescription }) => {
  if (!movieDescription) {
    return (
      <tr>
        <td>{movieName}</td>
        <td>Not Found</td>
      </tr>
    )
  }

  const { title, overview, release_date, poster_path, genre_ids } = movieDescription
  return (
    <tr>
      <td>
        {title} ({release_date})
      </td>
      <td>{genre_ids.map(id => GENRES[id]).join(', ')}</td>
      <img src={`https://image.tmdb.org/t/p/w500/${poster_path}`} style={{ width: 150, height: 200 }} />
      <td>{overview}</td>
    </tr>
  )
}

export default recompact.compose(
  recompact.withObs(() => {
    const submit$ = new Subject()
    const text$ = new BehaviorSubject('')
    const movieNames$ = submit$.withLatestFrom(text$, (submit, text) => text.split('\n'))
    const movieDescriptions$ = movieNames$
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
            [elem]: jsons[index].results[0],
          }),
          {}
        )
      )

    return {
      text$,
      submit$,
      movieNames$,
      movieDescriptions$,
    }
  }),
  recompact.connectObs(({ text$, submit$, movieDescriptions$ }) => ({
    onChange: text$,
    onSubmit: submit$,
    value: text$,
    movieDescriptions: movieDescriptions$,
  })),
  recompact.withHandlers({
    onChange: ({ onChange }) => event => onChange(event.target.value),
  })
)(({ value, onChange, onSubmit, movieDescriptions }) => (
  <div>
    <div>One movie name per line:</div>
    <textarea value={value} onChange={onChange} style={{ width: 300, height: 440 }} />

    <br />

    <button onClick={onSubmit}>Search</button>
    <table>
      {movieDescriptions
        ? Object.entries(movieDescriptions).map(([movieName, movieDescription]) => (
            <Movie key={movieName} movieName={movieName} movieDescription={movieDescription} />
          ))
        : null}
    </table>
  </div>
))
