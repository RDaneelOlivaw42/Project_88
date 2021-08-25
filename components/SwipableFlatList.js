import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import { SwipeListView } from 'react-native-swipe-list-view';
import db from '../config';

export default class SwipableFlatList extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      allNotifications: this.props.allNotifications
    }
  }


  updateMarkAsRead = (notification) => {
    db.collection('all_notifications')
    .doc(notification.doc_id)
    .update({
      "notification_status": "read"
    })
  }


  onSwipeValueChange = (swipeData) => {
    var allNotifications = this.state.allNotifications;
    var {key, value} = swipeData;

    if( value > -Dimensions.get("window").width ){
      const newData = [...allNotifications];
      const prevIndex = allNotifications.findIndex( item => item.key === key );

      this.updateMarkAsRead(allNotifications[prevIndex]);

      newData.splice(prevIndex, 1);

      this.setState({
        allNotifications: newData
      });
    }
  }


  renderItem(data){
    <ListItem bottomDivider >
      <ListItem.Content>
        
        <View style = {styles.listContainer}>

          <View style = {styles.leftElement}>
            <Icon name = 'book' type = 'font-awesome' color = '#696969' />
          </View>

          <View>
            <ListItem.Title style = {styles.title}> {data.item.object_name} </ListItem.Title>
            <ListItem.Subtitle style = {styles.subtitle}> {data.item.message} </ListItem.Subtitle>
          </View>

        </View>

      </ListItem.Content>
    </ListItem>
  }


  renderHiddenItem(){
    <View style = {styles.hiddenRow}>
      <View style = {[ styles.hiddenRowButton, styles.hiddenRowButtonRight ]}>
        <Text style = {styles.hiddenRowText}>Mark as Read</Text>
      </View>
    </View>
  }

//doubt here
  render(){
    return(
      <View style = {styles.container}>
        <SwipeListView 
          disableRightSwipe = {true}

          data = {this.state.allNotifications}
          renderItem = {this.renderItem}
          renderHiddenItem = {this.renderHiddenItem}

          rightOpenValue = {-Dimensions.get("window").width}

          previewRowKey = {"0"}
          previewOpenValue = {-40}
          previewOpenDelay = {3000}

          onSwipeValueChange = {this.onSwipeValueChange}
        />
      </View>
    )
  }

}


const styles = StyleSheet.create({

  listContainer: {
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
  },

  hiddenRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: "space-between",
    backgroundColor: '#29B6F6',
    paddingLeft: 15
  },

  hiddenRowButton: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 0,
    bottom: 0,
    position: 'absolute',
    width: 100
  },

  hiddenRowButtonRight: {
    backgroundColor: '#29B6F6',
    right: 0
  },

  hiddenRowText: {
    color: '#FFF',
    fontFamily: 'big caslon',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
    alignSelf: 'flex-start'
  }

})



















