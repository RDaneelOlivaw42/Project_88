import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Header, Icon, Badge } from 'react-native-elements';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { withNavigation } from 'react-navigation';
import { DrawerActions } from 'react-navigation-drawer';
import db from '../config';
import firebase from 'firebase';


class AppHeader extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      value: '',
      userId: firebase.auth().currentUser.email
    }
  }


  getUnreadNotifications = () => {
    db.collection('all_notifications')
    .where('targeted_user_id','==',this.state.userId)
    .where('notification_status','==',"unread")
    .onSnapshot( (snapshot)=>{

      var unreadNotifications = snapshot.docs.map( (doc)=> doc.data() )
      this.setState({
        value: unreadNotifications.length
      })

    })
  }


  componentDidMount(){
    this.getUnreadNotifications();
  }


  BellIconWithBadge = () => {
    return(
      <View>
        <SafeAreaProvider>

          <Icon name = 'bell' type = 'font-awesome' color = '#696969' size = {30} style = {{ marginTop: 7, marginRight: 14 }}
           onPress = {()=>{ this.props.navigation.navigate('Notifications') }} />

          <Badge 
            value = {this.state.value}
            status = "error"
            containerStyle = {{ position: 'absolute', top: 4, right: 9 }}
          />

        </SafeAreaProvider>
      </View>
    )
  }


  render(){
    return(
        <SafeAreaProvider>
            <Header 
              backgroundColor = '#5C96B6'
              
              centerComponent = {{
                  text: this.props.title,
                  style: { fontFamily: 'big caslon', textAlign: 'center', fontSize: 30, padding: 5 }
              }}
              
              leftComponent = { <Icon 
                                  name = 'bars'
                                  type = 'font-awesome'
                                  color = '#696969'
                                  style = {{ paddingLeft: 15, paddingTop: 10}}
                                  onPress = {()=>{
                                      this.props.navigation.dispatch(DrawerActions.toggleDrawer());
                                  }} /> }

              rightComponent = { < this.BellIconWithBadge {...this.props} /> }

            />
        </SafeAreaProvider>
    )
  }

}

export default withNavigation(AppHeader);