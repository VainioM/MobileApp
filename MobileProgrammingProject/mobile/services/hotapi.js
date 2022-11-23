//Isn't used anywhere.


const baseUrl = 'https://gameapp-328719.ew.r.appspot.com/rest/homeservice'

const getHotDetails = () => {
  return fetch(`${baseUrl}/games/hot`)
      .then((response) => {
        return response.json()
      })
      .catch((err) => {
        return err
      })
}

const hotGameService = {
  getHotDetails
}

export default hotGameService