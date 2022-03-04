const url = 'https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/party'
const token = '5a61cea0fba0fa0ace998b1c60aaef200712aa1c'

export const fetchSuggestions = (options = {}) => {
  const fetchOptions = {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: 'Token ' + token,
    },
    body: JSON.stringify(options),
  }

  return fetch(url, fetchOptions).then((response) => response.json())
}
