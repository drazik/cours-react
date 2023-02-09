import * as React from "react"
import { fetchArtist } from "./api"

export const Artist = (props) => {
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
        const response = await fetchArtist(props.name, {
          signal: abortController.signal,
        })

        setQuery((prevQuery) => ({
          ...prevQuery,
          status: "success",
          error: null,
          data: response.artist,
        }))
      } catch (err) {
        console.error(query)
        setQuery((prevQuery) => ({ ...prevQuery, status: "error", error: err }))
      }
    }

    if (props.name) {
      fetchData()
    }

    return () => {
      abortController.abort()
    }
  }, [props.name])

  return (
    <div>
      {query.status === "loading" ? <p>Loading...</p> : null}
      {query.status === "error" ? <p>Une erreur est survenue</p> : null}
      {query.status === "success" && query.data ? (
        <article>
          <h2>{query.data.name}</h2>
          <ul>
            {query.data.tags.tag.map((tag) => (
              <li key={tag.name}>{tag.name}</li>
            ))}
          </ul>
          <p dangerouslySetInnerHTML={{ __html: query.data.bio.summary }} />
          <ul>
            {query.data.similar.artist.map((artist) => (
              <li key={artist.name}>{artist.name}</li>
            ))}
          </ul>
        </article>
      ) : null}
    </div>
  )
}
