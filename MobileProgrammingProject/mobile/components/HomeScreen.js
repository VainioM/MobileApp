import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { StyleSheet, View, Modal, TextInput, Button, Text, SectionList, SafeAreaView, FlatList } from 'react-native';

import RandomDetails from './RandomDetails';
import HotDetails from './HotDetails';
import { fetchGameList, hotGameService } from '../sqlconnection/db';
import FavDetails from './FavDetails';

export default function HomeScreen(props) {

  const [hotgames, setHotGames] = useState([])
  const [newgames, setNewGames] = useState([])
  const [favgames, setFavGames] = useState([])
  const [x, setx] = useState([])
  const [y, sety] = useState([])

  const FetchHotGames = async () => {
    fetch(`https://gameapp-328719.ew.r.appspot.com/rest/homeservice/games/hot`)
      .then((response) => {
        return response.json()
      })
      .catch((err) => {
        return err
      })
      .then(resjson => {
        setHotGames(resjson.results)
      })


  }

  const FetchNewGames = async () => {
    fetch(`https://gameapp-328719.ew.r.appspot.com/rest/homeservice/games/new`)
      .then((response) => {
        return response.json()
      })
      .catch((err) => {
        return err
      })
      .then(resjson => {
        setNewGames(resjson.results)
      })


  }

  const readAllGames = async (id) => {
    try {
      const dbResult = await fetchGameList(x, y)
      console.log(dbResult.rows._array)
      setFavGames(dbResult.rows._array)
    }
    catch (err) {
      console.log(err);
    }
    finally {
      console.log("Game list fetched");
    }
  }

  React.useEffect(() => {

    fetch("https://api.rawg.io/api/games?key=2267b095084a464180515bfe1418acf2&dates=2021-01-01,2021-10-10&ordering=-added") //Not Needed
      .then(() => {
        FetchNewGames()
        FetchHotGames()
        readAllGames()
      })
      .catch((err) => {

      })
  }, [])



  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <SafeAreaView style={{ flex: 1 }}>
        <SectionList
          contentContainerStyle={{ paddingHorizontal: 10 }}
          stickySectionHeadersEnabled={false}
          sections={SECTIONS}
          renderSectionHeader={({ section }) => (
            <>
              <Text style={styles.sectionHeader}>{section.title}</Text>
              {(function () {
                switch (section.title) {

                  case 'Random Suggestions':
                    return (
                      <FlatList
                        horizontal
                        data={SECTIONS[0].data}
                        keyExtractor={item => item.key.toString()}
                        renderItem={itemData => <RandomDetails id={Math.floor(Math.random() * 2500) + 1} />}
                        showsHorizontalScrollIndicator={false}
                      />
                    )
                    break;

                  case 'New Releases':
                    return (
                      <FlatList
                        horizontal
                        data={newgames}
                        keyExtractor={item => item.id.toString()}
                        renderItem={itemData => <HotDetails game={itemData} />}
                        showsHorizontalScrollIndicator={false}
                      />
                    )

                  case 'Hot Right Now':
                    return (<FlatList
                      horizontal
                      data={hotgames}
                      keyExtractor={item => item.id.toString()}
                      renderItem={itemData => <HotDetails game={itemData} />}
                      showsHorizontalScrollIndicator={false}
                    />)
                    break;

                  case 'Favourites':
                    return (
                      <FlatList
                        horizontal
                        data={favgames}
                        keyExtractor={item => item.id.toString()}
                        renderItem={itemData => <FavDetails id={itemData} />}
                        showsHorizontalScrollIndicator={false}
                      />
                    )
                    break;

                  default:
                    console.log(section.title)
                    null;
                    break;
                }
              })()}
            </>
          )}
          renderItem={({ item, section }) => {
            if (section.horizontal) {
              return null;
            }
            return <RandomDetails item={item} />;
          }}
        />
      </SafeAreaView>
    </View>

  );
};

SECTIONS = [
  {
    title: 'Hot Right Now',
    horizontal: true,
    data: [
      {
        key: '1',
        text: "",
        uri: "",
      },
      {
        key: '2',
        text: "",
        uri: "",
      },

      {
        key: '3',
        text: "",
        uri: "",
      },
      {
        key: '4',
        text: "",
        uri: "",
      },
      {
        key: '5',
        text: "",
        uri: "",
      },
    ],
  },
  {
    title: 'New Releases',
    horizontal: true,
    data: [
      {
        key: '1',
        text: "",
        uri: "",
      },
      {
        key: '2',
        text: "",
        uri: "",
      },

      {
        key: '3',
        text: "",
        uri: "",
      },
      {
        key: '4',
        text: "",
        uri: "",
      },
      {
        key: '5',
        text: "",
        uri: "",
      },
    ],
  },
  {
    title: 'Favourites',
    horizontal: true,
    data: [
      {

        key: '1',
        text: "",
        uri: "",
      },
      {
        key: '2',
        text: "",
        uri: "",
      },

      {
        key: '3',
        text: "",
        uri: "",
      },
      {
        key: '4',
        text: "",
        uri: "",
      },
      {
        key: '5',
        text: "",
        uri: "",
      },
    ],
  },
  {
    title: 'Random Suggestions',
    horizontal: true,
    data: [
      {
        key: '1',
        text: "",
        uri: "",
      },
      {
        key: '2',
        text: "",
        uri: "",
      },

      {
        key: '3',
        text: "",
        uri: "",
      },
      {
        key: '4',
        text: "",
        uri: "",
      },
      {
        key: '5',
        text: "",
        uri: "",
      },
    ],
  },
];

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#202020',
  },
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
  sectionHeader: {
    fontWeight: '500',
    fontSize: 20,
    color: '#f1f1f1',
    marginTop: 20,
    marginBottom: 5,
  },
});
