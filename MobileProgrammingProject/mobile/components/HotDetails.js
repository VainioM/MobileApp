import { View, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { Button, Card, Chip, Image, Text, Header, Tab } from 'react-native-elements'
import React, {useState, useEffect} from 'react';
 
 
 
const HotDetails = (props) => {
  return(
    <View style={styles.item}>
      <Image
        source={{
          uri: props.game.item.background_image,
        }}
        style={styles.itemPhoto}
        resizeMode="cover"
      />
      <Text style={styles.itemText}>{props.game.item.name}</Text>
    </View>
  )
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
 
export default HotDetails;