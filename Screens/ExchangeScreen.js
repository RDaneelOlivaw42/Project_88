import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Touchable } from 'react-native';
import firebase from 'firebase';
import db from '../config';

import AppHeader from '../components/AppHeader';

export default class ExchangeScreen extends React.Component {

    constructor(){
        super();

        this.state = {
            userId: firebase.auth().currentUser.email,
            objectName: '',
            objectDescription: '',
            objectCost: '',

            userDocId: '',

            docId: '',
            requestedObjectName: '',
            requestId: '',
            objectStatus: '',
            UserCurrencyCode: '',
            objectCost: '',

            isBarterActive: '',

            receiverId: '',
            receiverCurrencyCode: ''
        }
    }


    getIsBarterActive = () => {
        db.collection('users')
        .where('email_id','==',this.state.userId)
        .get()
        .then( (snapshot)=>{
            snapshot.forEach( (doc)=>{

                this.setState({
                    isBarterActive: doc.data().is_barter_proposed
                })

            })
        });

        db.collection('requested_items')
        .where('user','==',this.state.userId)
        .get()
        .then( (snapshot)=>{
            snapshot.forEach( (doc)=>{

                if( doc.data().object_status === "requested" ){
                    this.setState({
                        isBarterActive: true
                    })
                }
                else{
                    this.setState({
                        isBarterActive: false
                    })
                }

            })
        });
    }


    getBarter = () => {
        var barter = db.collection('requested_items')
        .where('user','==',this.state.userId)
        .get()
        .then( (snapshot)=>{
            snapshot.forEach( (doc)=>{

                if(doc.data().object_status !== 'received'){

                    this.setState({
                        requestId: doc.data().request_id,
                        requestedObjectName: doc.data().object_name,
                        objectStatus: doc.data().object_status,
                        docId: doc.id,
                        objectCost: doc.data().object_cost,
                        receiverId: doc.data().user
                    })

                }

            })
        });
    }


    getCurrencyCodeForUser(){
        db.collection('users')
        .where('email_id','==',this.state.userId)
        .get()
        .then( (snapshot)=>{
            snapshot.forEach( (doc)=>{

                this.setState({
                    UserCurrencyCode: doc.data().currency_code
                })

            })
        });
    }


    getCurrencyCodeForReceiver(){
        db.collection('users')
        .where('email_id','==',this.state.receiverId)
        .get()
        .then( (snapshot)=>{
            snapshot.forEach( (doc)=>{
                
                this.setState({
                    receiverCurrencyCode: doc.data().currency_code
                })

            })
        });
    }
    

    generateId(){
        var id = Math.random().toString(36).substring(7);
        return id;
    }


    addRequest = (objectName, objectDescription) => {

        var id = this.generateId();
        var userId = this.state.userId;

        db.collection("requested_items").add({
            "user": this.state.userId,
            "object_name": objectName,
            "object_description": objectDescription,
            "object_cost": this.state.objectCost,
            "request_id": id,
            "object_status": "requested",
            "date": firebase.firestore.FieldValue.serverTimestamp()
        });

        db.collection('users')
        .where('email_id','==',userId)
        .get()
        .then()
        .then( (snapshot)=>{
            snapshot.forEach( (doc)=>{

                db.collection('users').doc(doc.id).update({
                    'is_barter_active': true
                })

            })
        })

        this.setState({
            objectName: '',
            objectDescription: '',
            requestId: id
        });

    }


    componentDidMount(){
        this.getIsBarterActive();
        this.getBarter();
        this.getCurrencyCodeForUser();
        this.getCurrencyCodeForReceiver();
    }


    forReceivedObjects = ( objectName ) => {
        var userId = this.state.userId;
        var requestId = this.state.requestId;

        db.collection('completed_barters').add({
            'user_id': userId,
            'object_name': objectName,
            'object_status': "received",
            'request_id': requestId,
        });
    }


    updateObjectStatusAndUserBarter = () => {
        
        db.collection('requested_items').doc(this.state.docId).update({
            object_status: "received"
        });

        db.collection('users')
        .where('email_id','==',this.state.userId)
        .get()
        .then( (snapshot)=>{
            snapshot.forEach( (doc)=>{

                db.collection('users').doc(doc.id).update({
                    is_barter_active: false
                })

            })
        });

    }
    

    sendNotification = () => {

        db.collection('users')
        .where('email_id','==',this.state.userId)
        .get()
        .then( (snapshot)=>{
            snapshot.forEach( (doc)=>{

                var firstName = doc.data().first_name
                var lastName = doc.data().last_name

                db.collection('all_notifications')
                .where('request_id','==',this.state.request_id)
                .get()
                .then( (snapshot)=>{
                    snapshot.forEach( (doc)=>{

                        var reciprocatorId = doc.data().reciprocator_id
                        var objectName = doc.data().object_name

                        db.collection('all_notifications').add({
                            'targeted_user_id': reciprocatorId,
                            'message': firstName + " " + lastName + " has received the object",
                            'notification_status': "unread",
                            'object_name': objectName
                        })

                    })
                })

            })
        })

    }


    setStatusInRequested_Items = () => {
        db.collection('requested_items')
        .where('request_id','==',this.state.requestId)
        .where('object_name','==',this.state.objectName)
        .where('user_id','==',this.state.userId)
        .get()
        .then( (snapshot)=>{
            snapshot.forEach( (doc)=>{

                db.collection('requested_items').doc(doc.id).set({
                    object_status: 'received'
                })

            })
        });
    }


    getDisplayCost(){
        var displayCost;

        fetch('http://data.fixer.io/api/latest?access_key=42b6c110dd15f154acb5f36f13b707ca')
        .then( (response)=>{
            return response.json()
        })
        .then( (responseData)=>{
            var userCC = this.state.UserCurrencyCode
            var userCCR = responseData.rates.userCC

            var receiverCC = this.state.receiverCurrencyCode
            var receiverCCR = responseData.rates.receiverCC

            var objectCost = this.state.objectCost

            var euroCost = objectCost/receiverCCR

            displayCost = euroCost*userCCR
        });

        return displayCost;
    }


    render(){
        if(this.state.isBarterActive === true){
            return(
                <View>
                    <AppHeader title = "Exchange Articles" />

                    <View style = {styles.activeRequestScreen}>
                        <Text style = {styles.activeRequestText}>You already have an active request</Text>

                        <View style = {styles.activeRequestLabel}>
                            <Text style = {[ styles.defaultText,  { fontWeight: 'bold' } ]}>Object Name: </Text>
                            <Text style = {styles.defaultText}>{this.state.requestedObjectName}</Text>
                        </View>

                        <View style = {styles.activeRequestLabel}>
                            <Text style = {[ styles.defaultText, { fontWeight: 'bold' } ]}>Object Cost: </Text>
                            <Text style = {styles.defaultText}>{this.getDisplayCost()}</Text>
                        </View>

                        <View style = {styles.activeRequestLabel}>
                            <Text style = {[ styles.defaultText,  { fontWeight: 'bold' } ]}>Object Status: </Text>
                            <Text style = {styles.defaultText}>{this.state.objectStatus}</Text>
                        </View>

                        <View>
                            <TouchableOpacity
                              style = {styles.receivedButton}
                              onPress = {()=>{
                                 this.sendNotification();
                                 this.updateObjectStatusAndUserBarter();
                                 this.forReceivedObjects(this.state.objectName);
                                 this.setStatusInRequested_Items();
                              }}>
                               <Text style = {[ styles.defaultText, { fontSize: 16 } ]}>RECEIVED THE OBJECT</Text>
                           </TouchableOpacity>
                        </View>
                    </View>
                    
                </View>
            )
        }
        else{
            return(
                <View>
    
                    <AppHeader title = "Exchange Articles"/>
                    <Text>{this.state.isUserQueryWorking}</Text>
    
                    <View style = {styles.container}>
    
                        <TextInput 
                          style = {styles.formInput}
                          placeholder = "Enter the object to request"
                          placeholderTextColor = '#F6C4B2'
                          autoFocus = {true}
                          onChangeText = {(text)=>{
                            this.setState({
                              objectName: text
                             })
                          }}/>

                        <TextInput 
                          style = {styles.formInput}
                          placeholder = "Enter the cost of the object"
                          placeholderTextColor = '#F6C4B2'
                          onChangeText = {(text)=>{
                            this.setState({
                              objectCost: text
                             })
                          }}/>
    
                        <TextInput 
                          style = {styles.formInput}
                          placeholder = "Describe the aforementioned object"
                          placeholderTextColor = '#F6C4B2'
                          onChangeText = {(text)=>{
                            this.setState({
                              objectDescription: text
                            })
                          }}
                          multiline = {true}
                          numberOfLines = {11}/>
    
                        <TouchableOpacity
                          style = {styles.submitButton}
                          onPress = {()=>{
                            this.addRequest(this.state.objectName, this.state.objectDescription);
                            alert("Added Request");
                          }}>
                            <Text style = {styles.submitButtonText}>SUBMIT</Text>
                        </TouchableOpacity>
    
                    </View>
                </View>
            )
        }
    }

}


const styles = StyleSheet.create({

    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 100
    },

    formInput: {
        width: '75%',
        backgroundColor: '#AE8277',
        borderBottomColor: '#494951',
        borderBottomWidth: 2,
        padding: 13,
        borderRadius: 4,
        fontSize: 15,
        fontFamily: 'big caslon',
        marginBottom: 30
    },

    submitButton: {
        backgroundColor: '#5C96B6',
        padding: 15,
        justifyContent: 'center',
        marginTop: 10,
        shadowColor: '#31565F',
        shadowOffset: {width: 5, height: 5},
        shadowRadius: 4,
    },

    submitButtonText: {
        fontFamily: 'big caslon',
        textAlign: 'center',
        fontSize: 19
    },

    activeRequestScreen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 30
    },

    activeRequestText: {
        fontFamily: 'big caslon',
        fontWeight: 'bold',
        alignSelf: 'center',
        fontSize: 20,
    },

    activeRequestLabel: {
        marginTop: 25,
        padding: 10,
        width: '75%',
        borderColor: '#AE8277',
        borderWidth: 3
    },

    defaultText: { 
        fontFamily: 'big caslon' 
    },

    receivedButton: {
        padding: 19,
        backgroundColor: '#5C96B6',
        shadowColor: '#31565F',
        shadowOffset: {width: 5, height: 5},
        shadowRadius: 4,
        margin: 30
    }

});