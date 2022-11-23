import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, Rating, Button } from 'react-native-elements';

const GameReview = ({review}) => {

  const [descOpen, setDescOpen] = React.useState(false)

  return (
    <Card>
      <Card.Title>{review.title}</Card.Title>
      <Rating readonly startingValue={review.rating} imageSize={15}/>
      <Card.Divider />
      {review.content.length > 100 ?
      <>
        <Text>{descOpen ? review.content : review.content.substring(0, 110)+'...'}</Text>
        <Button
          title={descOpen ? 'View less' : 'View More'}
          type="clear"
          onPress={() => setDescOpen(!descOpen)}
          />
      </>
      :
      <Text>{review.content}</Text>
      }
      <Text style={styles.writtentxt}>written by: {review.username}</Text>
    </Card>
  );
}

const styles = StyleSheet.create({
  writtentxt: {
    color: 'grey'
  }
})

export default GameReview;