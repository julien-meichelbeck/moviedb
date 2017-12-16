import React from 'react'
import recompact from 'recompact'
import { BehaviorSubject } from 'rxjs'
import axios from 'axios'
import './App.css'

const API_KEY = 'd533369a57d21cba80e1b1c060585c47'
const url = 'https://api.themoviedb.org/3/movie/550?api_key=d533369a57d21cba80e1b1c060585c47'

export default recompact.compose(
  recompact.withObs({
    text$: new BehaviorSubject(''),
  }),
  recompact.connectObs(({ text$ }) => ({
    onChange: text$,
    value: text$,
    results: text$
      .distinctUntilChanged()
      .switchMap(query =>
        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}&language=fr`)
      )
      .switchMap(response => response.json())
      .pluck('results'),
  })),
  recompact.withHandlers({
    onChange: ({ onChange }) => event => onChange(event.target.value),
  })
)(({ value, onChange, results }) => (
  <div className="App">
    <textarea value={value} onChange={onChange} />
    <ul>{results && results.map(({ title }) => <li key={title}>{title}</li>)}</ul>
  </div>
))
