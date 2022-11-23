const baseUrl = 'https://gameapp-328719.ew.r.appspot.com/rest/gameservice'

// get game by keyword
const getGameByKeyword = query => {

  if(query.includes(' ')){
    query = query.replace(" ", "-");
  }

  return fetch(`${baseUrl}/game/${query}/find`)
      .then((response) => {
        return response.json()
      })
      .catch((err) => {
        return err
      })
}

function getPopularGames()  {


  return fetch(`${baseUrl}/game/popular`)
      .then((response) => {
        return response.json()
      })
      .catch((err) => {
        return err
      })
}

const findGameapiService = {
  getGameByKeyword,
  getPopularGames
}


export default findGameapiService
