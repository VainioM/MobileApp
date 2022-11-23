import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, ScrollView, Image, TouchableOpacity, SafeAreaView } from 'react-native';
import SearchField from '../components/SearchBar'
import { SearchBar, ListItem, Icon, Avatar } from 'react-native-elements';
import { addGame, fetchGameList} from '../sqlconnection/db'
import findGameapiService from '../services/findGameapi';
import { color } from 'react-native-elements/dist/helpers';

//import { render } from 'react-dom';


export default function GameSearch(props) {

    
      const [topGames, SetTopGames] = useState([])

      const [games, setGames] = useState([])
      let [isLoading, setLoading]=useState(true);

      

      
      // fetch top games from Rawg.io API
      /*const GetTopGames = async () => {
        const temp = await fetch("https://rawg.io/api/games?key=04251274a77f4ee09322b7cfd664c6d9&page_size=10")
        .then(response => response.json()) 
        .then((resjson) => { SetTopGames(resjson.results) }) 
        setLoading(false);
        //console.log(isLoading);
        
      }*/

      const GetTopGames = async () => {
        findGameapiService.getPopularGames()
        .then((resjson) => { SetTopGames(resjson.results) }) 
        setLoading(false);
        //console.log(isLoading);
        
      }

      // fetch game by the query word
      /*const FetchGames = async (query) => {
        const tempSearch = await fetch(`https://rawg.io/api/games?key=04251274a77f4ee09322b7cfd664c6d9&search_precise=true&search=${query}&page_size=20`)
        .then(res => res.json()) 
        .then((responsejson) => { setGames(responsejson.results) }) 
        console.log(games)
        console.log(query)
        
      }*/

      const FetchGames = async (query) => {
        findGameapiService.getGameByKeyword(query)
        .then(resjson => {
          setGames(resjson.results)
        }) 
        console.log(query)
        
      }

      //console.log(isLoading);

      useEffect(() => {
        GetTopGames();
      }, []);

      const AddGame = async (name, gameid) => {
        addGame(name, gameid);
        console.log(fetchGameList());
        
      }

      console.log(games);
      return (

        <SafeAreaView style={styles.container}>

          <SearchField FetchGames={FetchGames}

          />
          <View style={styles.favoritesList}>
          {/* show 10 most popular games on a horizontal flatlist*/}
          <FlatList horizontal={true}
              showsHorizontalScrollIndicator={false}
              data={topGames}
              keyExtractor = {game => game.id.toString()}
              // data={topGames}
              
              renderItem={({item}) => (
                <TouchableOpacity 
                  onPress={() => props.navigation.navigate('GameDetails', {gameId: item.id})}
                  onLongPress={() => AddGame(item.name, item.id)}
                  >
                <Image source={{uri:item.background_image}} style={{
                  width:75,
                  height:75,
                  borderWidth:0,
                  resizeMode:'cover',
                  marginTop:8,
                  marginRight:15,
                  
                }}></Image></TouchableOpacity>
                
              )}
            />
        </View>

        <ScrollView style={{backgroundColor:'#202020', marginTop:25}}>

        <View style={styles.screen}>
        

        <View style={styles.searchResultsList}>
              {
                games.map((item, id) => ( 
                  <ListItem style={styles.listItem}  key={id} bottomDivider>
                    
                    <Avatar source={{uri: item.background_image}} />

                    <Icon color="purple" name="add" onPress={() => AddGame(item.name, item.id)}/>
                    <ListItem.Content style={styles.listItem}>
                      
                      <TouchableOpacity onPress={() => props.navigation.navigate('GameDetails', {gameId: item.id})}>
                        <ListItem.Title style={{color:'purple', marginLeft:5}}>{item.name}</ListItem.Title>
                      </TouchableOpacity>
                    </ListItem.Content>
                    <ListItem.Chevron />
                  </ListItem>
                ))
              }
        </View>
        
        </View>
        </ScrollView>
        </SafeAreaView>
        
      );
}

// Styles
const styles = StyleSheet.create ({
     screen: {
       marginTop: 0,
       backgroundColor:'#202020',
       color:'#202020',
     },
     formStyle: {
       flexDirection: 'row',
       justifyContent:'space-between',
       alignItems:"center"
     },
     listItem:{
      padding: 0,
      marginVertical: 1,
      flex: 1, 
      width:'100%',
      marginLeft:0,
    },

    container:{
      marginTop:0,
      backgroundColor:'#202020',
    },
    searchResultsList:{
      marginTop:0,
      backgroundColor:'#202020',
      color:'#202020'
    },
    favoritesList:{
      backgroundColor:'#202020',
      marginBottom:-15
    },
   });
