
import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Button, Card, Chip, Image, Text, Header, Tab } from 'react-native-elements'
import React, {useState, useEffect} from 'react';



const RandomDetails = (props) => {

  const [game, setGame] = useState({});
  const testLog = () =>{
    //console.log("----")
  }

    useEffect(() => {
        if(!isNaN(props.id)){
          fetch('https://gameapp-328719.ew.r.appspot.com/rest/homeservice/games/'+props.id+'/random')
            .then((response) => response.json())
            .then((resjson) => {
              setGame(resjson)
              incrementCounter()
            })
            .catch((err) => {
              
            })
          }else{
            
          }
      }, [props.id])
      if(Object.entries(game).length === 0){
        return (
          <Text>ERROR</Text>
        )
      }else{
        return (
            <View style={styles.item}>
      <Image
        source={{
          uri: game.background_image,
        }}
        style={styles.itemPhoto}
        resizeMode="cover"
      />
      <Text style={styles.itemText}>{game.name}</Text>
    </View>
    )}
}

const styles = StyleSheet.create({
  itemText: {
    color: 'rgba(255, 255, 255, 0.5)',
    marginTop: 5,
  },
  item: {
    margin: 5,
  },
  itemPhoto: {
    width: 200,
    height: 200,
  },
})

export default RandomDetails;