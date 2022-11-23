import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-elements';

const GameInfoItem = (props) => {
  
  return (
    <View style={styles.infobox}>
      <Text>{props.title}:</Text>
      <View>
        {
          !Array.isArray(props.data) ? <Text>{props.data}</Text> :
          props.data.map((item, index) => {
            if(props.title === "Platforms"){
              return (
                <Text key={index}>{item.platform.name}</Text>
              )
            }else{
              return (
                <Text key={index}>{item.name}</Text>
              )
            }
          })
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  infobox: {
    flex: 1,
    padding: 10
  }
});

export default GameInfoItem;