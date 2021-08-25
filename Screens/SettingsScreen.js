import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AppHeader from '../components/AppHeader';
import db from '../config';
import firebase from 'firebase';

export default class SettingsScreen extends React.Component {

  constructor(props){
    super(props);

    this.state = {
      emailId: '',
      firstName: '',
      lastName: '',
      address: '',
      contactNumber: '',
      docId: ''
    }
  }


  getData = () => {
    var email = firebase.auth().currentUser.email;
    console.log(email);

    db.collection("users")
    .where('emailId','==',email)
    .get()
    .then( (snapshot)=>{
      snapshot.forEach( (doc)=>{

        var data = doc.data();
        console.log(data);
      })
    })
  }


  componentDidMount(){
    this.getData();
  }


  render(){
    return(
      <View>
        <AppHeader title = "Settings" navigation = {this.props.navigation}/>
        <Text>Us and them</Text>
      </View>
    )
  }

}

const styles = StyleSheet.create({})

/*import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import AppHeader from '../components/AppHeader';
import db from '../config';
import firebase from 'firebase';

export default class SettingsScreen extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            emailId: '',
            firstName: '',
            lastName: '',
            contactNumber: '',
            address: '',
            docId: ''
        }
    }


    getUserDetails = () => {
        var email = firebase.auth().currentUser.email;

        db.collection('users')
        .where('emailId','==',email)
        .get()
        .then( (snapshot)=>{
            snapshot.forEach( (doc)=>{

                var data = doc.data();
                this.setState({
                    emailId: data.emailId,
                    firstName: data.first_name,
                    lastName: data.last_name,
                    contactNumber: data.phone_number,
                    address: data.address,
                    docId: doc.id
                });

            })
        });

        console.log(this.state);
    }


    updateUserDetails = () => {
        db.collection('users')
        .doc(this.state.docId)
        .update({
            "first_name": this.state.firstName,
            "last_name": this.state.lastName,
            "phone_number": this.state.contactNumber,
            "address": this.state.address
        });
    }


    componentDidMount(){
        this.getUserDetails();
    }


    render(){
        return(
            <View>
                <AppHeader title = "Settings" navigation = {this.props.navigation}/>

                <View style = {styles.container}>

                    <View style = {styles.formContainer}>

                        <TextInput 
                          style = {styles.formInput}
                          placeholder = {"First Name"}
                          placeholderTextColor = {'#F6C4B2'}
                          maxLength = {8}
                          onChangeText = {(text)=>{
                              this.setState({
                                  firstName: text
                              })
                          }}
                          value = {this.state.firstName} />

                        <TextInput 
                          style = {styles.formInput}
                          placeholder = {"Last Name"}
                          placeholderTextColor = {'#F6C4B2'}
                          maxLength = {8}
                          onChangeText = {(text)=>{
                              this.setState({
                                  lastName: text
                              })
                          }}
                          value = {this.state.lastName} />

                        <TextInput 
                          style = {styles.formInput}
                          placeholder = {"Contact Number"}
                          placeholderTextColor = {'#F6C4B2'}
                          maxLength = {10}
                          onChangeText = {(text)=>{
                              this.setState({
                                  contactNumber: text
                              })
                          }}
                          value = {this.state.contactNumber} />

                        <TextInput 
                          style = {styles.formInput}
                          placeholder = {"Address"}
                          placeholderTextColor = {'#F6C4B2'}
                          multiline = {true}
                          onChangeText = {(text)=>{
                              this.setState({
                                  address: text
                              })
                          }}
                          value = {this.state.address} />

                        <TouchableOpacity
                          style = {styles.saveButton}
                          onPress = {()=>{
                              this.updateUserDetails();
                              alert("Profile Updated Successfully");
                          }}>
                            <Text style = {styles.saveButtonText}>SAVE CHANGES</Text>
                        </TouchableOpacity>

                    </View>

                </View>

            </View>
        )
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40
    },

    formContainer: {
        flex: 1,
        width: '100%',
        alignItems: 'center'
    },

    formInput: {
        backgroundColor: '#AE8277',
        borderBottomColor: '#4E4C53',
        borderBottomWidth: 2,
        fontFamily: 'big caslon',
        padding: 15,
        marginTop: 40,
        width: '65%',
        borderRadius: 5
    },

    saveButton: {
        backgroundColor: '#5C96B6',
        padding: 20,
        borderRadius: 2,
        shadowColor: '#31565F',
        shadowOffset: { width: 5, height: 6 },
        shadowRadius: 5,
        marginTop: 50
    },

    saveButtonText: {
        fontFamily: 'big caslon',
        fontSize: 16,
    }

});*/