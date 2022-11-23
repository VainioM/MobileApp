import React, {useState} from 'react';
import { View } from 'react-native';
import { Button, Text } from 'react-native-elements';

const GameDescription = ({description}) => {

  const [descOpen, setDescOpen] = useState(false)

  return (
    <View>
    <Text>Description:</Text>
    <Text>{descOpen ? description : description.substring(0, 110)+'...'}</Text>
    <Button
      title={descOpen ? 'View less' : 'View More'}
      type="clear"
      onPress={() => setDescOpen(!descOpen)}
      />
  </View>
  );
}

export default GameDescription;