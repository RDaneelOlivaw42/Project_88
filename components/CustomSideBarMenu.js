/*
//mine
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerItems } from 'react-navigation-drawer';
import firebase from 'firebase';

export default class CustomSideBarMenu extends React.Component {

    render(){
        return(
            <View style = {styles.container}>

                <View style = {styles.drawerItemsContainer}>
                    <DrawerItems {...this.props} />
                </View>

                <View style = {styles.logOutContainer}>
                    <TouchableOpacity
                      style = {styles.logOutButton}
                      onPress = {()=>{
                          firebase.auth().signOut();
                          this.props.navigation.navigate('Login')
                      }}>
                        <Text style = {styles.logOutText}>Log Out</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    drawerItemsContainer: {
        flex: 0.8
    },

    logOutContainer: {
        flex: 0.02,
        justifyContent: 'center',
        paddingBottom: 30
    },

    logOutButton: {
        height: 30,
        width: '100%',
        justifyContent: 'center',
        padding: 10
    },

    logOutText: {
        fontWeight: 'bold'
    }

});*/

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Avatar } from 'react-native-elements';
import { DrawerItems } from 'react-navigation-drawer';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase';
import db from '../config';


export default class CustomSideBarMenu extends React.Component {

    constructor(){
        super();

        this.state = {
            userId: firebase.auth().currentUser.email,
            image: '',
            userName: ''
        }
    }


    getUserName = () => {
        db.collection('users')
        .where('email_id','==',this.state.userId)
        .get()
        .then( (snapshot)=>{
            snapshot.forEach( (doc)=>{

                this.setState({
                    userName: doc.data().first_name + " " + doc.data().last_name
                })

            })
        });
    }


    selectImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1
        });

        if(!result.cancelled){

            this.setState({
                image: result.uri
            });

            this.uploadImage(result.uri, this.state.userId);

        }
    }


    uploadImage = async ( uri, userId ) => {
        var response = await fetch(uri);

        var blob = await response.blob();

        var ref = firebase.storage().ref().child('user_profiles/' + userId);

        return(
            ref.put(blob).then( ()=>{
                alert('Image has been successfully uploaded');
                this.fetchImage(userId);
            })
        )
    }


    fetchImage = (userId) => {
        var ref = firebase.storage().ref().child('user_profiles/' + userId);

        ref.getDownloadURL().then( (uri)=>{

            this.setState({
                image: uri
            })

        })
        .catch( (error)=>{

            var errorMessage = error.message
            alert(errorMessage)

            this.setState({
                image: ''
            })

        });
    }


    componentDidMount(){
        this.getUserName();
        this.fetchImage(this.state.userId);
    }


    render(){
        return(
            <View style = {styles.container}>

                <View style = {styles.avatar}>
                    <Avatar 
                        source = {{ uri: this.state.image }}
                        rounded = {true}
                        size = 'xlarge'
                        onPress = {()=>{
                            this.selectImage()
                        }}
                    />
                </View>

                <View style = {styles.nameContainer}>
                    <Text style = {styles.userName}>{this.state.userName}</Text>
                </View>

                <View style = {styles.drawerItemsContainer}>
                    <DrawerItems {...this.props} />
                </View>

                <View style = {styles.logOutContainer}>
                    <TouchableOpacity
                      style = {styles.logOutButton}
                      onPress = {()=>{
                          firebase.auth().signOut();
                          this.props.navigation.navigate('Login');
                      }}>
                        <Text style = {styles.logOutText}>Log Out</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }

}

const styles = StyleSheet.create({

    container: {
        flex: 1
    },

    drawerItemsContainer: {
        flex: 0.8
    },

    logOutContainer: {
        flex: 0.02,
        justifyContent: 'center',
        paddingBottom: 30
    },

    logOutButton: {
        height: 30,
        width: '100%',
        justifyContent: 'center',
        padding: 10
    },

    logOutText: {
        fontWeight: 'bold'
    }

})