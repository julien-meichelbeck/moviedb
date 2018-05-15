import React from "react"

export default ({ id, movieName, results, onSelectMovie }) => (
  <ul className="nav nav-tabs card-header-tabs">
    {results.slice(0, 6).map(({ id: resultId, title }) => (
      <li key={resultId} className="nav-item">
        <a
          href="#"
          className={`nav-link ${id === resultId ? "active" : null}`}
          onClick={event => {
            event.preventDefault()
            onSelectMovie(resultId)
          }}
        >
          {title}
        </a>
      </li>
    ))}
  </ul>
)
