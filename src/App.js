import React, { Component } from 'react'
import recompact from 'recompact'
import Movie from './Movie'
import { BehaviorSubject, Subject } from 'rxjs'
import './App.css'

const API_KEY = 'd533369a57d21cba80e1b1c060585c47'

export default recompact.compose(
  recompact.withObs(() => {
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
      .startWith(localStorage.getItem('movieResults') ? JSON.parse(localStorage.getItem('movieResults')) : undefined)

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
  <div className="container mt-3">
    <h2>Movie database</h2>
    <textarea
      value={value}
      onChange={onChange}
      className="movie-search-input"
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
