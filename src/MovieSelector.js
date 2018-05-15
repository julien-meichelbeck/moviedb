import React from "react"

export default ({ id, movieName, results, onSelectMovie }) => (
  <div>
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
                onSelectMovie(resultId)
              }}
            >
              {title}
            </a>
          )}
        </li>
      ))}
    </ul>
  </div>
)
