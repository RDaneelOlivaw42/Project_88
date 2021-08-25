import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Modal, KeyboardAvoidingView, ScrollView } from 'react-native';
import db from '../config';
import firebase from 'firebase'
require('firebase/auth')

export default class LoginScreen extends React.Component {

    constructor(){
        super();

        this.state = {
            emailId: '',
            password: '',
            isModalVisible: false,
            firstName: '',
            lastName: '',
            phoneNumber: '',
            address: '',
            confirmPassword: '',
            currencyCode: ''
        }
    }


    login = async (emailId, password)=>{

        firebase.auth().signInWithEmailAndPassword(emailId, password)
        .then(()=>{

        })
        .catch((error)=>{
            var errorCode = error.code;
            var errorMessage = error.message;
            return alert(errorMessage);
        });

        this.props.navigation.navigate('HomeScreen');

    }


    signUp = async (emailId, password, confirmPassword)=>{

        if(password !== confirmPassword){
            return alert("Password does not match Confirm Password");
        }
        else{

            firebase.auth().createUserWithEmailAndPassword(emailId, password)
            .then((response)=>{

                db.collection("users").add({
                    first_name: this.state.firstName,
                    last_name: this.state.lastName,
                    contact_number: this.state.phoneNumber,
                    address: this.state.address,
                    email_id: this.state.emailId,
                    password: this.state.password,
                    confirm_password: this.state.confirmPassword,
                    is_barter_proposed: false,
                    currency_code: this.state.currencyCode 
                });
    
                return(
                    alert(
                        'User Registered Successfully',
                        '',
                        [{text: 'okay', onPress: ()=> this.hideModal() }]
                    )
                );
                
            })
            .catch((error)=>{
              var errorCode = error.message;
              var errorMessage = error.message;
              return alert(errorMessage);
            });

        }

    }


    showModal = () =>{
        return(
            <Modal
              animationType = "fade"
              transparent = {true}
              visible = {this.state.isModalVisible}
              style = {[styles.modalView, {marginTop: 80}]}>

                <View style = {styles.modalView}>

                    <ScrollView style = {{width: '100%'}}>
                        <KeyboardAvoidingView style = {styles.keyboardAvoidingView}>

                            <Text style = {styles.formTitle}>Registration Form</Text>

                            <TextInput 
                              style = {styles.formInput}
                              placeholder = {"First Name"}
                              placeholderTextColor = {'#F6C4B2'}
                              onChangeText = {(text)=>{
                                  this.setState({
                                      firstName: text
                                  })
                              }}/>

                            <TextInput 
                              style = {styles.formInput}
                              placeholder = {"Last Name"}
                              placeholderTextColor = {'#F6C4B2'}
                              onChangeText = {(text)=>{
                                  this.setState({
                                      lastName: text
                                  })
                              }}/>

                            <TextInput 
                              style = {styles.formInput}
                              placeholder = {"Phone Number"}
                              placeholderTextColor = {'#F6C4B2'}
                              maxLength = {10}
                              onChangeText = {(text)=>{
                                  this.setState({
                                      phoneNumber: text
                                  })
                              }}/>

                            <TextInput 
                              style = {styles.formInput}
                              placeholder = {"Residential Address"}
                              placeholderTextColor = {'#F6C4B2'}
                              onChangeText = {(text)=>{
                                  this.setState({
                                      address: text
                                  })
                              }}/>

                            <TextInput 
                              style = {styles.formInput}
                              placeholder = {"Currency Code"}
                              placeholderTextColor = {'#F6C4B2'}
                              onChangeText = {(text)=>{
                                  this.setState({
                                      currencyCode: text
                                  })
                              }}/>

                            <TextInput 
                              style = {styles.formInput}
                              placeholder = {"Email ID"}
                              placeholderTextColor = {'#F6C4B2'}
                              keyboardType = 'email-address'
                              onChangeText = {(text)=>{
                                  this.setState({
                                      emailId: text
                                  })
                              }}/>

                            <TextInput 
                              style = {styles.formInput}
                              placeholder = {"Password"}
                              placeholderTextColor = {'#F6C4B2'}
                              secureTextEntry = {true}
                              onChangeText = {(text)=>{
                                  this.setState({
                                      password: text
                                  })
                              }}/>

                            <TextInput 
                              style = {styles.formInput}
                              placeholder = {"Confirm Password"}
                              placeholderTextColor = {'#F6C4B2'}
                              secureTextEntry = {true}
                              onChangeText = {(text)=>{
                                  this.setState({
                                      confirmPassword: text
                                  })
                              }}/>

                            <TouchableOpacity
                              style = {[styles.registerButton, {marginTop: 10}]}
                              onPress = {()=>{
                                  this.signUp(this.state.emailId, this.state.password, this.state.confirmPassword);
                              }}>
                                <Text style = {styles.buttonText}>REGISTER</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style = {[styles.registerButton, {marginTop: 13}]}
                              onPress = {()=>{
                                  this.hideModal();
                              }}>
                                <Text style = {[styles.buttonText]}>CANCEL</Text>
                            </TouchableOpacity>

                        </KeyboardAvoidingView>
                    </ScrollView>

                </View>
            </Modal>
        )
    }


    hideModal = ()=>{
        this.setState({
            isModalVisible: false
        });
    }


    render(){
        return(
            <View style = {{height: '100%'}}>
            <ImageBackground source = {require('../assets/bg.png')}  style = {{width: '100%', height: '100%'}}>
            <View style = {{marginLeft: 100, marginRight: 100}}>
                
                <View style = {styles.bgBlur} />
                <Text style = {styles.header}>BARTER SYSTEM</Text>

                <View>
                    {this.showModal()}
                </View>

                <View style = {{flex: 1, flexDirection: 'column', marginTop: 30}}>
                    <TextInput 
                      style = {styles.loginInput}
                      placeholder = "Enter Email-ID"
                      placeholderTextColor = '#F6C4B2'
                      keyboardType = 'email-address'
                      autoFocus = {true}
                      onChangeText = {(text)=>{
                          this.setState({
                              emailId: text
                          })
                      }}/>

                    <TextInput 
                      style = {styles.loginInput}
                      placeholder = "Enter Password"
                      placeholderTextColor = '#F6C4B2'
                      secureTextEntry = {true}
                      onChangeText = {(text)=>{
                          this.setState({
                              password: text
                          })
                      }}/>
                </View>

                <View style = {{flex: 1, flexDirection: 'column', marginTop: 50}}>
                  <TouchableOpacity
                    style = {styles.loginButton}
                    onPress = {()=>{
                        this.login(this.state.emailId, this.state.password);
                    }}>
                        <Text style = {styles.buttonText}>LOGIN</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style = {[styles.loginButton, {marginBottom: 50}]}
                    onPress = {()=>{
                       this.setState({
                           isModalVisible: true
                       });
                    }}>
                        <Text style = {styles.buttonText}>SIGN UP</Text>
                  </TouchableOpacity>
                </View>

            </View>
            </ImageBackground>
            </View>
        )
    }

}


const styles = StyleSheet.create({

    sideView: {
        backgroundColor: '#1D3E4D',
        width: '10%',
        height: '100%'
    },

    header: {
        fontSize: 80,
        fontFamily: 'big caslon',
        alignSelf: 'center',
        color: '#fff',
        marginTop: -115,
    },

    loginInput: {
        backgroundColor: '#AE8277',
        borderBottomColor: '#494951',
        borderBottomWidth: 2,
        width: '50%',
        alignSelf: 'center',
        height: 40,
        marginTop: 30,
        borderRadius: 3,
        padding: 10,
        fontFamily: 'baskerville',
        fontSize: 16
    },

    loginButton: {
        backgroundColor: '#5C96B6',
        alignSelf: 'flex-start',
        width: '10%',
        justifyContent: 'center',
        marginTop: 30,
        padding: 13,
        shadowColor: '#31565F',
        shadowOffset: {width: 5, height: 5},
        shadowRadius: 4,
        marginLeft: 300
    },

    buttonText: {
        textAlign: 'center',
        fontFamily: 'baskerville'
    },

    bgBlur: {
        backgroundColor: 'white',
        width: '65%',
        height: 140,
        alignSelf: 'center',
        opacity: 0.4,
        marginTop: 90,
    },

    formInput: {
        width: 300,
        height: 30,
        padding: 10,
        backgroundColor: '#AE8277',
        color: '#ffffff',
        borderBottomWidth: 2,
        borderBottomColor: '#494951',
        margin: 10,
        fontFamily: 'big caslon'
    },

    registerButton: {
        alignSelf: 'center',
        backgroundColor: '#5C96B6',
        padding: 10,
        width: 100
    },

    formTitle: {
        alignSelf: 'center',
        color: '#fff',
        fontFamily: 'big caslon',
        fontSize: 20,
        marginBottom: 10
    },

    modalView: {
        borderRadius: 4,
        borderColor: '#2D3134',
        padding: 2,
        alignSelf: 'center'
    },

    keyboardAvoidingView: {
        borderWidth: 2,
        borderColor: '#fff',
        padding: 9
    }

})