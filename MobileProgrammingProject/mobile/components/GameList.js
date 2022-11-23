import React, { useState, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ListItem, Button } from 'react-native-elements';

import { fetchGameList, deleteGame, setGameAsCompleted } from '../sqlconnection/db';
import { ScrollView } from 'react-native-gesture-handler';

export default function GameList(props) {
const [gameList, setGameList]=useState([]);
const [newGameName, setNewGameName]=useState('');
const [newGameCompleted, setNewGameCompleted]=useState('');

const [params, setParams]=useState(false);

const readAllGames=async(id)=>{
    try{
        const dbResult = await fetchGameList(newGameName, newGameCompleted);
        setGameList(dbResult.rows._array);
      }
      catch(err){
        console.log(err);
      }
      finally{
        console.log("Game list fetched");
      }
}

const setAsCompleted=async(id, completed)=>{
    try{
        console.log("Toggling completed. Currently: " + completed);
        const dbResult = await setGameAsCompleted(id, completed);
        readAllGames();
    }
    catch(err){
        console.log(err);
    }
    finally{
        console.log("Game set as completed");
    }
}

const deleteGameFromList=async(id)=>{
    try{
        console.log("Trying to delete game...");
        const dbResult = await deleteGame(id);
        readAllGames();
    }
    catch(err){
        console.log(err);
    }
    finally{
        console.log("Game deleted");
    }
}

useFocusEffect(useCallback(()=> {
    setParams({something:true})
    readAllGames();
    console.log("useFocusEffect updating screen...")
  },[setParams]));

/*
return(
    <View style={styles.Screen}>
        <FlatList
        keyExtractor={item=>gameList.indexOf(item).toString()}
        data={gameList}
        renderItem={({item}) => (
          <View style={styles.listItem}>
              <Text style={styles.listMainText}>{item.id}: {item.name}</Text>
              <Text style={styles.listLesserText}>Completed: {item.completed}</Text>
              <Text style={styles.listLesserText}>Game id: {item.gameid} </Text>
              <View style={styles.buttonContainerStyle}>
                <Button style={styles.buttonStyle} title="Completed" onPress={()=> setAsCompleted(item.id, item.completed)} />
                <Button style={styles.buttonStyle} title="Info" onPress={() => props.navigation.navigate('GameDetails', {gameId: item.gameid})} />
                <Button style={styles.buttonStyle} title="Remove" onPress={()=> deleteGameFromList(item.id)} />
              </View>
          </View>
        )}
        />
    </View>
);
*/

return(
<View style={styles.Screen}>
    <ScrollView>
    {
        gameList.map((item, id) => (
            <ListItem key={id} bottomDivider>
                <ListItem.Content>
                    <ListItem.Title>{item.name}</ListItem.Title>
                    <ListItem.Subtitle style={styles.listLesserText}>Completed: {item.completed}</ListItem.Subtitle>
                    <View style={styles.buttonContainerStyle}>
                        <Button type="outline" style={styles.buttonStyle} title="Completed" onPress={()=> setAsCompleted(item.id, item.completed)} />
                        <Button type="outline" style={styles.buttonStyle} title="Info" onPress={() => props.navigation.navigate('GameDetails', {gameId: item.gameid})} />
                        <Button type="outline" style={styles.buttonStyle} title="Remove" onPress={()=> deleteGameFromList(item.id)} /> 
                    </View>
                </ListItem.Content>
            </ListItem>
        ))
    }
    </ScrollView>
</View>
);
}

const styles=StyleSheet.create({
    Screen:{
        flex:1,
        paddingHorizontal:10,
        paddingTop:5,
        backgroundColor: '#cfcfcf',
    },
    listItem:{
        padding: 10,
        marginVertical: 10,
        borderWidth: 2,
        borderColor: 'blue',
        backgroundColor: 'lightblue',
      },
    listMainText:{
        height:30,
        fontSize:20,
    },
    listLesserText:{
        height:30,
    },
    buttonStyle:{

    },
    buttonContainerStyle:{
        width: '65%',
        paddingLeft:-10,
        flexDirection: 'row',
        alignContent: 'space-around',
        justifyContent: 'space-around',
    }
});