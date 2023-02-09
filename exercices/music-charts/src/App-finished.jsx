import { ArtistsChart } from "./ArtistsChart"
import { Artist } from "./Artist"
import { SearchForm } from "./SearchForm"
import * as React from "react"

function App() {
  const [selectedArtist, setSelectedArtist] = React.useState(null)

  const handleSelectArtist = (artist) => {
    setSelectedArtist(artist.name)
  }

  return (
    <div>
      <ArtistsChart onSelectArtist={handleSelectArtist} />
      <SearchForm onSelect={handleSelectArtist} />
      <Artist name={selectedArtist} />
    </div>
  )
}

export default App
