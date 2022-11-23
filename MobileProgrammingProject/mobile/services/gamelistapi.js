const baseUrl = 'https://gameapp-328719.ew.r.appspot.com/rest'
import GameList from '../components/GameList';
import { fetchGameList } from '../sqlconnection/db';


const exportGameList = (username, gamelist) => {



    console.log('running function: exportGameList, list content: ' + username + gamelist)
    return fetch(`${baseUrl}/listgame/exportlist/export`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: `user=${username}&games=${gamelist.toString()}`
  })
  .then(response => {
    return response
  })
  .catch(err => {
    err
  })
}
/*
const exportGameList = async (username, password) => {
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
*/
const gamelistApi = {
  exportGameList
  
}

export default gamelistApi