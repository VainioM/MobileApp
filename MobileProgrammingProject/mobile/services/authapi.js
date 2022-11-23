const baseUrl = 'https://gameapp-328719.ew.r.appspot.com/rest/auth'

const login = async (username, password) => {
  return fetch(`${baseUrl}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${username}&password=${password}`
  })
  .then(response => {
    return response
  })
  .catch(err => {
    err
  })
}

const register = async (username, password) => {
  return fetch(`${baseUrl}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `username=${username}&password=${password}`
  })
  .then(response => {
    return response
  })
  .catch(err => {
    err
  })
}

const verify = async (token) => {
  return fetch(`${baseUrl}/verify`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(response => {
    return response
  })
  .catch(err => {
    return err
  })
}

const authApi = {
  login,
  register,
  verify,
}

export default authApi