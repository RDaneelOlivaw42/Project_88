import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';

import SwipableFlatList from '../components/SwipableFlatList';
import AppHeader from '../components/AppHeader';
import db from '../config';
import firebase from 'firebase';

export default class NotificationsScreen extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      userId: firebase.auth().currentUser.email,
      allNotifications: []
    }

    this.notificationsRef = null;
  }


  getNotifications = () => {
    this.notificationsRef = db.collection('all_notifications')
    .where('targeted_user_id','==',this.state.userId)
    .where('notification_status','==',"unread")
    .onSnapshot( (snapshot)=> {
      
      var allNotifications = []

      snapshot.docs.map( (doc)=>{
        var notification = doc.data()
        notification["doc_id"] = doc.id
        allNotifications.push(notification)
      })

      this.setState({
        allNotifications: allNotifications
      })

    })
  }


  componentDidMount(){
    this.getNotifications();
  }


  componentWillUnmount(){
    this.notificationsRef();
  }


  keyExtractor = (item, index) => index.toString()


  renderItem = ({ item, index }) => {
    return(
      <ListItem key = {index} bottomDivider >
        <ListItem.Content>
          
          <View style = {styles.renderItem}>

            <View style = {styles.leftElement}>
              <Icon name = 'address-card' type = 'font-awesome' color = '#696969'/>
            </View>
            
            <View>
              <ListItem.Title style = {styles.title}>{item.object_name}</ListItem.Title>
              <ListItem.Subtitle style = {styles.subtitle}>{item.message}</ListItem.Subtitle>
            </View>

          </View>

        </ListItem.Content>
      </ListItem>
    )
  }


  render(){
    return(
      <View>
        <AppHeader title = "Notifications" navigation = {this.props.navigation} />

        { 
          this.state.allNotifications.length === 0 ?
          (
            <Text>You have no Notifications</Text>
          ) :
          (
           /* <FlatList 
              keyExtractor = {this.keyExtractor}
              data = {this.state.allNotifications}
              renderItem = {this.renderItem}
            />*/

            <SwipableFlatList allNotifications = {this.state.allNotifications} />
          )
        }
      </View>
    )
  }

}


const styles = StyleSheet.create({

  renderItem: {
    flex: 2,
    flexDirection: 'row'
  },

  leftElement: {
    marginRight: 20
  },

  title: {
    fontFamily: 'big caslon',
    fontWeight: 'bold'
  },

  subtitle: {
    fontFamily: 'big caslon'
  }

})