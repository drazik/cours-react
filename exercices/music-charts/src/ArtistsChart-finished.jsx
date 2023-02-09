import * as React from "react"
import { fetchTopArtistsChart } from "./api"

export const ArtistsChart = (props) => {
  const [query, setQuery] = React.useState({
    status: "idle",
    data: null,
    error: null,
  })

  React.useEffect(() => {
    const abortController = new AbortController()

    const fetchData = async () => {
      setQuery((prevQuery) => ({ ...prevQuery, status: "loading" }))

      try {
        const response = await fetchTopArtistsChart({
          signal: abortController.signal,
        })

        setQuery((prevQuery) => ({
          ...prevQuery,
          status: "success",
          data: response.artists.artist,
          error: null,
        }))
      } catch (err) {
        console.error(err)
        setQuery((prevQuery) => ({
          ...prevQuery,
          status: "error",
          error: err,
        }))
      }
    }

    fetchData()

    return () => {
      abortController.abort()
    }
  }, [])

  const handleSelectArtist = (artist) => () => {
    props.onSelectArtist(artist)
  }

  return (
    <div>
      {query.status === "loading" ? <p>Loading artists chart...</p> : null}
      {query.status === "error" ? (
        <p>Error while fetching artists chart</p>
      ) : null}
      {query.status === "success" && query.data ? (
        <div>
          {query.data.map((artist) => {
            return (
              <button key={artist.name} onClick={handleSelectArtist(artist)}>
                {artist.name}
              </button>
            )
          })}
        </div>
      ) : null}
    </div>
  )
}
