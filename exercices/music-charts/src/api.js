const API_KEY = "8909350b57a5f2bc8d8b9a5f86cd1642"

/**
 * @param {Record<string, string>} params
 * @returns {string}
 */
const getURL = (params) => {
  const url = new URL("https://ws.audioscrobbler.com/2.0/")
  url.search = new URLSearchParams([
    ["api_key", API_KEY],
    ["format", "json"],
    ...Object.entries(params),
  ])

  return url
}

/**
 * @param {string} method
 * @param {Record<string, string>} params
 * @param {Object} [fetchOptions]
 */
const callAPI = async (method, params, fetchOptions) => {
  const url = getURL({ method, ...params })
  const response = await fetch(url, fetchOptions)

  if (!response.ok) {
    throw response
  }

  return response.json()
}

/**
 * @param {Object} fetchOptions
 * @throws {Response}
 */
export const fetchTopArtistsChart = async (fetchOptions) => {
  return callAPI("chart.gettopartists", {}, fetchOptions)
}

/**
 * @param {string} query
 * @param {Object} fetchOptions
 * @throws {Response}
 */
export const fetchArtists = async (query, fetchOptions) => {
  return callAPI("artist.search", { artist: query.trim() }, fetchOptions)
}

/**
 * @param {string} query
 * @param {Object} fetchOptions
 * @throws {Response}
 */
export const fetchArtist = async (query, fetchOptions) => {
  return callAPI("artist.getinfo", { artist: query }, fetchOptions)
}
