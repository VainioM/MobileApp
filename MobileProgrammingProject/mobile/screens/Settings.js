import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Button, Input, Text, Divider } from 'react-native-elements'
import {Buffer} from 'buffer';
import AsyncStorage from '@react-native-async-storage/async-storage'

import authApi from '../services/authapi';
import gamelistApi from '../services/gamelistapi';

import ProfileContext from '../contexts/ProfileContext'

import {deleteLocalData, fetchGameList} from '../sqlconnection/db'

const Settings = () => {

  const ctx = React.useContext(ProfileContext)

  const [username, setUsername] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [user, setUser] = React.useState('')
  const [gamelist, setGameList]=React.useState([]);

  const [message, setMessage] = React.useState('')
  
  const sendLogin = async () => {
    //console.log(username + " " + password)
    await authApi.login(username, password)
    .then(response => {
      if(response.ok){
        return response.text()
      }else{
        throw response
      }
    })
    .then(text => {
      // Right login found, set token
      ctx.setToken(text)
      AsyncStorage.setItem("token", text)
      setMessage('')
    })
    .catch(err => {
      if(err.text){
        err.text().then(errText => {
          setMessage(errText)
        })
      }else{
        console.log(err)
      }
    })
  }

  const sendRegister = async () => {

    await authApi.register(username, password)
    .then(response => {
      if(response.ok){
        return response.text()
      }else{
        throw response
      }
    })
    .then(text => {
      // Do something with the response
      setMessage(text)
    })
    .catch(err => {
      if(err.text){
        err.text().then(errText => {
          setMessage(errText)
        })
      }else{
        console.log(err)
      }
    })
  }

  const sendVerify = async() => {
    authApi.verify(ctx.token)
    .then(response => {
      if(response.ok){
        return response.text()
      }else{
        throw response
      }
    })
    .then(text => {
      if(text === 'true'){
        setMessage("Token verified")
      }else{
        setMessage("Token not valid")
      }
    })
    .catch(err => {
      if(err.text){
        err.text().then(errText => {
          setMessage(errText)
        })
      }else{
        console.log(err)
      }
    })
  }

  const sendLogout = () => {
    ctx.setToken('')
    AsyncStorage.removeItem("token")
    setMessage('Logged out')
  }

  const getSubjectFromToken = token => {
    let data = token.split(".")[1]
    let json = JSON.parse(Buffer.from(data, 'base64').toString())
    return json.sub
  }

  const deleteData = async () => {
    try{
      const dbResult = await deleteLocalData();
    }catch(err){
      console.log(err)
    }
  }

  const readAllGames= async () => {
    try{
        const dbResult = await fetchGameList();
        setGameList(dbResult.rows._array);
      }
      catch(err){
        console.log(err);
      }
      finally{
        console.log("Game list fetched");
        
      }
    }
  const exportList= async () => {
    //console.log("gamelist in exportList: " + gamelist);
    gamelistApi.exportGameList(getSubjectFromToken(ctx.token), JSON.stringify(gamelist))
  }
  
  React.useEffect(() => {
    readAllGames()
  }, [])

  return (
    <View style={styles.container}>
      <View style={styles.profile}>
          { message != '' &&
          <View style={{alignItems: 'center'}}>
            <Text h4>{ message }</Text>
          </View> 
          }
          <Text h4>Profile information:</Text>
          {ctx.token === '' ?
          <View>
            <View>
              <Input label="Username" placeholder="Username" onChangeText={setUsername} />
              <Input label="Password" placeholder="Password" onChangeText={setPassword} secureTextEntry={true}/>
            </View>
            <View>
              <Button title="Login" onPress={sendLogin} />
              <Button title="Register" onPress={sendRegister} />
            </View>
          </View>
          :
          <View>
            <Text>Logged in as {getSubjectFromToken(ctx.token)}</Text>
            <Button title="Logout" onPress={sendLogout} />
            <Button title="Verify" onPress={sendVerify} />
          </View>
          }
          <Divider />
          <Text h4>Local data</Text>
          <View>
            <Button title="Delete local data" color="red" onPress={deleteData} />
          </View>
          <Divider />
          <Text h4>Export gamelist</Text>
          <View>
            <Button title="Export local gamelist" color="blue" onPress={exportList} />
          </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',

  },
  profile: {
    alignSelf: 'stretch',
    margin: 20
  }
})

export default Settings;