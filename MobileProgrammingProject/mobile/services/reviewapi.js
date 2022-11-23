const baseUrl = 'https://gameapp-328719.ew.r.appspot.com/rest/reviewservice'

const getGameReviews = id => {
  //console.log(`${baseUrl}/${id}/reviews`)
  return fetch(`${baseUrl}/${id}/reviews`)
      .then((response) => {
        return response.json()
      })
      .catch((err) => {
        return err
      })
}

const reviewApi = {
  getGameReviews
}

export default reviewApi