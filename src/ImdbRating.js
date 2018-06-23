import React from "react"

export default class ImdbRating extends React.Component {
  render() {
    const { rating, ratingCount } = this.props
    return (
      <div>
        <img
          src="https://ia.media-imdb.com/images/G/01/imdb/plugins/rating/images/imdb_46x22.png"
          style={{ marginRight: 14 }}
        />
        {[rating, "/10"].join("")} ({ratingCount} votes)
      </div>
    )
  }
}
