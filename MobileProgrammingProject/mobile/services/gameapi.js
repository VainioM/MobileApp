const baseUrl = 'https://gameapp-328719.ew.r.appspot.com/rest/gameservice'

const getGameDetails = async id => {
  return fetch(`${baseUrl}/game/${id}/details`)
      .then((response) => {
        return response.json()
      })
      .catch((err) => {
        return err
      })
}

const gameapiService = {
  getGameDetails
}

export default gameapiService