import React from "react"
import recompact from "recompact"
import Movie from "./Movie"
import { Observable, BehaviorSubject, Subject } from "rxjs"
import * as movieApi from "./MovieApi"
import "./App.css"

const MAX = 40
export default recompact.compose(
  recompact.withObs(() => {
    const submit$ = new Subject()
    const text$ = new BehaviorSubject("")
    const movieNames$ = submit$.withLatestFrom(text$, (submit, text) => text.split("\n").filter(name => name.length))

    const movieResults$ = movieNames$
      .switchMap(movieNames => Promise.all(movieNames.map(movieApi.search)))
      .switchMap(responses => Promise.all(responses.map(response => response.json())))
      .withLatestFrom(movieNames$, (jsons, names) =>
        names.reduce(
          (acc, elem, index) => ({
            ...acc,
            [elem]: jsons[index].results
          }),
          {}
        )
      )
      .do(movieResults => localStorage.setItem("movieResults", JSON.stringify(movieResults)))
      .startWith(localStorage.getItem("movieResults") ? JSON.parse(localStorage.getItem("movieResults")) : undefined)

    const loading$ = Observable.merge(submit$.mapTo(true), movieResults$.mapTo(false)).startWith(false)

    return {
      text$,
      loading$,
      submit$,
      movieNames$,
      movieResults$
    }
  }),
  recompact.connectObs(({ text$, submit$, loading$, movieResults$ }) => ({
    onChange: text$,
    onSubmit: submit$,
    loading: loading$,
    value: text$,
    movieResults: movieResults$
  })),
  recompact.withHandlers({
    onChange: ({ onChange }) => event => {
      const text = event.target.value
      if (text.split("\n").length <= MAX) {
        onChange(text)
      }
    }
  })
)(({ value, onChange, onSubmit, loading, movieResults }) => (
  <div className="container mt-3">
    <h2>Movie database</h2>
    <textarea
      value={value}
      onChange={onChange}
      className="movie-search-input"
      placeholder={`One movie name per line (max ${MAX})`}
      rows={5}
      className="form-control"
    />
    <button onClick={onSubmit} disabled={loading} className="btn btn-success mt-2">
      {loading ? "Loading ..." : "Search"}
    </button>
    <div style={{ float: "right" }}>
      <strong>
        {(value || "").split("\n").length} / {MAX}
      </strong>
    </div>
    {movieResults ? (
      <div>
        <hr />

        {Object.entries(movieResults).map(([movieName, results]) => (
          <Movie key={movieName} movieName={movieName} results={results} />
        ))}
      </div>
    ) : null}
  </div>
))
