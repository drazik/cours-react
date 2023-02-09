import * as React from "react"
import { fetchArtists } from "./api"

export const SearchForm = (props) => {
  const [query, setQuery] = React.useState({
    status: "idle",
    data: null,
    error: null,
  })

  const [value, setValue] = React.useState("")

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  const handleInput = (event) => {
    const value = event.target.value

    setValue(value)

    if (event.nativeEvent.inputType === "insertReplacementText") {
      const selectedArtist = query.data
        ? query.data.find((artist) => artist.name === value)
        : null

      if (selectedArtist) {
        props.onSelect(selectedArtist)
      }
    }
  }

  React.useEffect(() => {
    const abortController = new AbortController()

    const fetchData = async () => {
      const trimmedValue = value.trim()

      if (trimmedValue === "") {
        setQuery((prevQuery) => ({
          ...prevQuery,
          status: "success",
          error: null,
          data: [],
        }))
      } else {
        setQuery((prevQuery) => ({ ...prevQuery, status: "loading" }))

        try {
          const response = await fetchArtists(value, {
            signal: abortController.signal,
          })

          setQuery((prevQuery) => ({
            ...prevQuery,
            status: "success",
            error: null,
            data: response.results.artistmatches.artist,
          }))
        } catch (err) {
          if (err instanceof DOMException) {
            // Do nothing
          } else {
            console.error(err)
            setQuery((prevQuery) => ({
              ...prevQuery,
              status: "error",
              error: err,
            }))
          }
        }
      }
    }

    fetchData()

    return () => {
      abortController.abort()
    }
  }, [value])

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="query">Rechercher un(e) artiste</label>
      <input
        type="text"
        id="query"
        name="query"
        list="search-artists"
        value={value}
        onInput={handleInput}
      />
      <datalist id="search-artists">
        {query.data?.map((artist) => (
          <option key={artist.name}>{artist.name}</option>
        ))}
      </datalist>
    </form>
  )
}
