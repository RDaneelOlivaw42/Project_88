import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card, Header, Icon } from 'react-native-elements';
import db from '../config';
import firebase from 'firebase';
import { LinearGradient } from 'expo-linear-gradient'

import UserDetailsHeader from '../components/UserDetailsHeader';


export default class UserDetails extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      userId: firebase.auth().currentUser.email,
      userName: '',

      recieverId: this.props.navigation.getParam("details")["user_id"],
      requestId: this.props.navigation.getParam("details")["request_id"],
      objectName: this.props.navigation.getParam("details")["object_name"],
      objectDescription: this.props.navigation.getParam("details")["object_description"],

      recieverName: '',
      recieverContact: '',
      recieverAddress: '',
      recieverRequestDocId: ''
    }
  }


  getRecieverDetails(){
    var email_id = this.state.recieverId

    db.collection('users')
    //.where('email_id','==',email_id)
    .where('email_id','==',"")
    .get()
    .then( (snapshot)=>{
      snapshot.forEach( (doc)=>{

        this.setState({
          recieverName: doc.data().first_name,
          recieverContact: doc.data().contact_number,
          recieverAddress: doc.data().address
        })

      })
    });

    db.collection('requested_items')
    .where('request_id','==',this.state.requestId)
    .get()
    .then( (snapshot)=>{
      snapshot.forEach( (doc)=>{

        this.setState({
          recieverRequestDocId: doc.id
        })

      })
    });

  }


  getUserDetails = () => {
    db.collection('users')
    .where('email_id','==',this.state.userId)
    .get()
    .then( (snapshot)=>{
      snapshot.forEach( (doc)=>{

        this.setState({
          userName: doc.data().first_name + " " + doc.data().last_name
        })

      })
    })
  }


  addBarter = () => {
    db.collection('all_barters').add({
      object_name: this.state.objectName,
      request_id: this.state.requestId,
      initiated_by: this.state.recieverId,
      reciprocated_by: this.state.userId,
      request_status: "User Interested"
    });
  }


  addNotification = () => {
    var message = this.state.userName + " has shown interest in barter"

    db.collection("all_notifications").add({
      'targeted_user_id': this.state.recieverId,
      'reciprocator_id': this.state.userId,
      'request_id': this.state.requestId,
      'object_name': this.state.objectName,
      'date': firebase.firestore.FieldValue.serverTimestamp(),
      'notification_status': "unread",
      'message': message
    })
  }


  componentDidMount(){
    this.getRecieverDetails();
    this.getUserDetails();
    console.log(this.state)
  }


  render(){
    return(
      <View>
        <UserDetailsHeader title = "User Details" />

        <View style = {styles.cardContainer}>

          <Card containerStyle = {styles.card}>
            <LinearGradient 
              style = {styles.background}
              colors={['#B8897E', 'transparent']}
            />
          
            <Card.Title style = {styles.cardTitle}>OBJECT INFORMATION</Card.Title>

            <Card>
              <Text style = {{ fontFamily: 'big caslon' }}>Object Name: {this.state.objectName}</Text>
            </Card>

            <Card>
              <Text style = {{ fontFamily: 'big caslon' }}>Description: {this.state.objectDescription}</Text>
            </Card>
          
          </Card>

          <Card containerStyle = {styles.card}>
            <LinearGradient 
              style = {styles.background}
              colors={['#B8897E', 'transparent']}
            />

            <Card.Title style = {styles.cardTitle}>RECIEVER INFORMATION</Card.Title>

            <Card>
              <Text style = {{ fontFamily: 'big caslon' }}>Name: {this.state.recieverName}</Text>
            </Card>

            <Card>
              <Text style = {{ fontFamily: 'big caslon' }}>Address: {this.state.recieverAddress}</Text>
            </Card>

            <Card>
              <Text style = {{ fontFamily: 'big caslon' }}>Contact Number: {this.state.recieverContact}</Text>
            </Card>

          </Card>

        </View>

        <View style = {styles.buttonContainer}>
          {
            this.state.userId === this.state.recieverId ?
            null : 
            (
              <TouchableOpacity 
                style = {styles.button}
                onPress = {()=>{
                  this.addBarter();
                  this.addNotification();
                  this.props.navigation.navigate('MyBarters');
                }} >
                <Text style = {styles.buttonText}>PROCEED  WITH  BARTER</Text>
              </TouchableOpacity>
            )
          }
        </View>

      </View>
    )
  }

}


const styles = StyleSheet.create({

  cardContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 150
  },

  card: {
    backgroundColor: '#E5AEA1',
    width: '90%',
    marginTop: 40
  },

  background: {
    position: 'absolute',
    left: -15,
    right: 0,
    top: -15,
    height: '100%',
    width: '102.39%'
  },

  cardTitle: {
    color: '#fff',
    fontFamily: 'big caslon',
    zIndex: 2,
    fontSize: 20
  },

  buttonContainer: {
    flex: 1,
    alignItems: 'center'
  },

  button: {
    backgroundColor: '#5C96B6',
    padding: 20,
    marginTop: 30,
    shadowOffset: { width: 5, height: 5 },
    shadowColor: '#2F5059',
    shadowRadius: 5
  },

  buttonText: {
    fontFamily: 'big caslon'
  }

})
