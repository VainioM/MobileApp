import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, SafeAreaView, FlatList, LogBox, Picker, TextInput } from 'react-native';
import { Button, Card, Chip, Image, Text, Header, Tab, Rating } from 'react-native-elements'
import { Divider } from 'react-native-elements/dist/divider/Divider';

import GameDescription from '../components/GameDescription';
import GameInfoItem from '../components/GameInfoItem';
import GameReview from '../components/GameReview';
import ProfileContext from '../contexts/ProfileContext'

import gameapiService from '../services/gameapi'
import reviewApi from '../services/reviewapi';

LogBox.ignoreLogs(['VirtualizedLists should never be nested']) //TODO: Actually fix this rather than ignore warnings
// Cant have Flatlist inside scrollview, breaks flatlist optimizations. not a consern for small amounts of items

const GameDetails = (props) => {
  //console.log(props)

  const ctx = React.useContext(ProfileContext)

  const [game, setGame] = useState({})
  const [reviews, setReviews] = useState([])
  const [mc_color, setMC_Color] = useState('white')
  const [selectedValue, setSelectedValue] = useState("rating");
  const [text, onChangeText] = React.useState("Your Review...");
  const [rev, onChangeRev] = React.useState("3.3");

  const [loggedIn, setLoggedIn] = React.useState(true);

  useEffect(() => {
    let gameId = props.route.params.gameId

    if (ctx.token != '') {
      setLoggedIn(true)
    } else {
      setLoggedIn(false)
    }

    if (!isNaN(gameId)) {
      gameapiService.getGameDetails(gameId)
        .then(resjson => {
          setGame(resjson)
          setMC_Color(resjson.metacritic >= 75 ? 'green' : resjson.metacritic >= 50 ? 'yellow' : resjson.metacritic >= 1 ? 'red' : 'white')
        })
      reviewApi.getGameReviews(gameId)
        .then(reviewsjson => {
          console.log(reviewsjson)
          if (reviewsjson.length > 0) {
            setReviews(reviewsjson)

          }
        })
        .catch(err => {
          console.log(err)
        })
    } else {
      // Error on gameId prop
    }
  }, [props.route.params.gameId])

  const sortReviews = type => {
    //console.log(reviews)
    let newArr = reviews
    switch (type) {
      case 'rating':
        newArr.sort((a, b) => parseFloat(a.rating) - parseFloat(b.rating))
        setReviews(newArr)
        break;
      case '-rating':
        newArr.sort((a, b) => parseFloat(b.rating) - parseFloat(a.rating))
        setReviews(newArr)
        break;
      case 'oldest':
        newArr.sort((a, b) => new Date(a.created_at * 1000) - new Date(b.created_at * 1000))
        setReviews(newArr)
        break;
      case 'newest':
        newArr.sort((a, b) => new Date(b.created_at * 1000) - new Date(a.created_at * 1000))
        setReviews(newArr)
        break;
      default:
        break;
    }
  }

  /*
    function getToken() {
      const value = await AsyncStorage.getItem("token")
      return value
    }
  */
  if (Object.entries(game).length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator />
      </View>
    )
  } else {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text h2 style={{ alignSelf: 'center' }}>{game.name}</Text>
          <Card.Divider />
          <View>
            <Image
              resizeMode="cover"
              source={{ uri: game.background_image }}
              style={{ height: 200 }}
            />
            <View style={[styles.metacritic_score, { backgroundColor: mc_color }]}>
              <Text style={{ fontSize: 21, fontWeight: 'bold' }}>{game.metacritic ? game.metacritic : "?"}</Text>
            </View>
          </View>
          <View style={styles.genres}>
            {
              game.genres.map((genre, index) => {
                return (
                  <Chip title={genre.name} key={index} />
                )
              })
            }
          </View>
          <Card.Divider />
          <GameDescription description={game.description_raw} />
          <Card.Divider />
          {/* Info Section */}
          <View style={[styles.infosection]}>
            <GameInfoItem title="Platforms" data={game.platforms} />
            <GameInfoItem title="Release Date" data={game.released} />
          </View>
          <View style={[styles.infosection]}>
            <GameInfoItem title="Developers" data={game.developers} />
            <GameInfoItem title="Publishers" data={game.publishers} />
          </View>
          <Card.Divider />
          <Text>Reviews:</Text>
          {reviews.length > 1 ?
            <Picker
              selectedValue={selectedValue}
              onValueChange={(itemValue, itemIndex) => { setSelectedValue(itemValue); sortReviews(itemValue) }}
            >
              <Picker.Item label="Newest" value="newest" />
              <Picker.Item label="Oldest" value="oldest" />
              <Picker.Item label="Rating Desc" value="-rating" />
              <Picker.Item label="Rating Asc" value="rating" />
            </Picker>
            :
            null
          }
          <FlatList
            data={reviews}
            keyExtractor={item => item.id.toString()}
            renderItem={({ item }) => <GameReview review={item} />}
            ListEmptyComponent={<Text>No reviews yet. be the first to add?</Text>}
          />
          {loggedIn &&
            <Divider>
              <Rating showRating fractions={1} startingValue={3.3} />
              <SafeAreaView>
                <TextInput
                  style={styles.reviewBox}
                  onChangeText={onChangeText}
                  value={text}
                  multiline={true}
                  title="TITLE"
                />
                <Button style={styles.center} title="Submit" />
              </SafeAreaView>
            </Divider>
          }
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    margin: 5
  },
  genres: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
    padding: 10
  },
  metacritic_score: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 25,
    padding: 10,
    height: 50,
    width: 50,
    bottom: 10,
    right: 20,
  },
  infosection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  infobox: {
    flex: 1,
    padding: 10
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

});


export default GameDetails;

