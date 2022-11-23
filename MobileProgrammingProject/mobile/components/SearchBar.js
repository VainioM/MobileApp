import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList } from 'react-native';
import { SearchBar, Button, Icon } from 'react-native-elements';


// function for user input
function SearchField(props) {

    const { FetchGames } = props;

    const [searchValue, setSearchValue] = useState('');
    //input handler for the search term
    const handleInput = (e) => {
        const text = e;
        setSearchValue(text);
      }
    //submit handler for the search term
    const handleSubmit = (e) => {
        FetchGames(searchValue)
      }


    return(
        <View>
        <SearchBar placeholder="Search by name..."
        
        onChangeText={handleInput}
        value={searchValue} 
        
        />
        <View style={{backgroundColor:"purple"}}>
        <Button title="Search" onPress={handleSubmit} buttonStyle={{
         backgroundColor: "purple"
      }}/>
        </View>
        </View>
    );
}

export default SearchField;