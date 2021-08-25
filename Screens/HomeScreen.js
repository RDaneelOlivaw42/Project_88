import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { ListItem } from 'react-native-elements';
import db from '../config';
import AppHeader from '../components/AppHeader';


export default class HomeScreen extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      requestedItemsList: []
    }

    this.requestRef = null;
  }


  getRequestedItemsList = () => {
    this.requestRef = db.collection("requested_items")
    .onSnapshot( (snapshot)=>{

       var requestedItemsList = snapshot.docs.map( document => document.data() )
       this.setState({
         requestedItemsList: requestedItemsList
       })

    })
  }

  
  componentDidMount(){
    this.getRequestedItemsList();
  }


  componentWillUnmount(){
    this.requestRef();
  }


  keyExtractor = (item, index) => index.toString()


  renderItem = ({item, i}) => {
    return(
        <ListItem key = {i} bottomDivider containerStyle = {styles.listItemContainer}>
          <ListItem.Content>

            <ListItem.Title style = {styles.titleStyle} >{item.object_name}</ListItem.Title>
            <ListItem.Subtitle style = {{ fontFamily: 'big caslon' }} >{item.object_description}</ListItem.Subtitle>

            <View style = {styles.rightElement}>
              <TouchableOpacity 
                style = {styles.button}
                onPress = {()=>{
                  this.props.navigation.navigate('UserDetails', { "details": item } );
                }}>
                  <Text style = {styles.buttonText}>Exchange</Text>
              </TouchableOpacity>
            </View>

          </ListItem.Content>
        </ListItem>
    )
  }


  render(){
    return(
      <View>
        <AppHeader title = "Donate Articles" navigation = {this.props.navigation} />

        <View>
          {
            this.state.requestedItemsList.length === 0 ?
            (
              <View style = {styles.nullContainer} >
                <Text style = {{ fontSize: 20 }} >List of All Articles Available for Exchange</Text>
              </View>
            )
            : (
              <View style = {styles.listContainer}>
                <FlatList 
                  keyExtractor = {this.keyExtractor}
                  data = {this.state.requestedItemsList}
                  renderItem = {this.renderItem}
                />
              </View>
            )
          }
        </View>
      </View>
    )
  }

}
  

const styles = StyleSheet.create({

  nullContainer: {    
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  listItemContainer: {
    backgroundColor: '#B8897D',
    overflow: 'scroll'
  },

  titleStyle: {
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'big caslon',
    paddingBottom: 5
  },

  button: {
    padding: 7,
    marginTop: 10,
    backgroundColor: '#DBAC9B'
  },

  buttonText: {
    fontFamily: 'big caslon'
  },

  listContainer: {
    marginLeft: '25%',
    marginRight: '25%',
    shadowColor: '#5C96B6',
    shadowRadius: 50,
    overflow: 'scroll'
  }

})