import * as React  from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

import { createDrawerNavigator } from '@react-navigation/drawer';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { init } from './sqlconnection/db';
import authApi from './services/authapi';

import HomeScreen from './components/HomeScreen';
import GameList from './components/GameList';
import GameDetails from './screens/GameDetails';
import Settings from './screens/Settings';

import {ProfileProvider} from './contexts/ProfileContext'


import GameSearch from './components/GameSearch';

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

init()
.then(()=>{
  console.log('Database creation succeeded!');
}).catch((err)=>{
  console.log('Database IS NOT initialized! '+err);
});

export default function App() {

  const [token, setToken] = React.useState('')

  const initToken = async () => {
    const value = await AsyncStorage.getItem("token")
    if(value !== null) {
      authApi.verify(value)
      .then(response => {
        if(response.ok){
          return response.text()
        }else{
          throw response
        }
      })
      .then(text => {
        if(text === 'true'){
          setToken(value)
        }
      })
      .catch(err => {
        console.log(err)
      })
    }
  }

  React.useEffect(() => {
    initToken();
  }, [])

  return (
    <ProfileProvider value={{token: token, setToken: setToken}} >
      <View style={styles.container}>
        <NavigationContainer>
          <Stack.Navigator>
            <Stack.Screen 
              name="root"
              component={root}
              options={{headerShown: false}}
            />
            <Stack.Screen name="GameDetails">
              {props => <GameDetails {...props} />}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </View>
    </ProfileProvider>
  );
}

const root = () => {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home Screen">
        {props => <HomeScreen {...props} />}
      </Drawer.Screen>
      <Drawer.Screen name="Game List">
        {props => <GameList {...props} />}
      </Drawer.Screen>
      <Drawer.Screen name="Search game">
        {props => <GameSearch {...props} />}
      </Drawer.Screen>
      <Drawer.Screen name="Settings">
        {props => <Settings {...props} />}
      </Drawer.Screen>
    </Drawer.Navigator>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
