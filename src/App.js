import React, { Component } from 'react'
import recompact from './recompact'
import logo from './logo.svg'
import './App.css'

export default recompact.withProps({ a: 1 })(({ a }) => (
  <div className="App">
    <p>{a}</p>
  </div>
))
