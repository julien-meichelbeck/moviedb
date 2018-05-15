import React from "react"

export default ({ videos }) => {
  if (!videos.length) return null

  return (
    <div>
      <strong>Vidéos</strong>
      {videos
        .filter(video => video.site === "YouTube")
        .slice(0, 3)
        .map(video => (
          <div key={video.id}>
            <a href={`https://www.youtube.com/watch?v=${video.key}`} target="_blank">
              {video.name}
            </a>
          </div>
        ))}
    </div>
  )
}
