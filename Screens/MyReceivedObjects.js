import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { ListItem, Icon } from 'react-native-elements';
import firebase from 'firebase';
import db from '../config';
import AppHeader from '../components/AppHeader';

export default class MyReceivedObjects extends React.Component {

    constructor(props){
        super(props);

        this.state = {
            allReceivedObjects: [],
            userId: firebase.auth().currentUser.email
        }

        this.requestRef = null;
        this.objectsRef = null;
    }


    getAllReceivedObjects(){
        this.requestRef = db.collection('completed_barters')
        .where('user_id','==',this.state.userId)
        .onSnapshot( (snapshot)=>{

            var allReceivedObjects = snapshot.docs.map( (document) => document.data() )
            this.setState({
                allReceivedObjects: allReceivedObjects
            })

        })
    }


    getAllReceivedObjectsBackUp(){
        this.objectsRef - db.collection('requested_items')
        .where('object_status','==',"received")
        .where('user','==',this.state.userId)
        .onSnapshot( (snapshot)=>{

            var allReceivedObjects = snapshot.docs.map( (document) => document.data() )
            this.setState({
                allReceivedObjects: allReceivedObjects
            })

        });
    }


    componentDidMount(){
        this.getAllReceivedObjects();
        this.getAllReceivedObjectsBackUp();
    }


    keyExtractor = ( item, index ) => index.toString();


    renderItem = ({ item, i }) => {
        return(
            <ListItem key = {i} bottomDivider = {true}>
                <ListItem.Content>

                    <View style = {styles.listContainer}>

                        <View style = {styles.rightElement}>
                            <Icon name = 'archive' type = 'font-awesome' color = '#696969' />
                        </View>

                        <View style = {styles.leftElement}>
                            <ListItem.Title style = {styles.titleText}>{item.object_name}</ListItem.Title>
                            <ListItem.Subtitle style = {{ fontFamily: 'big caslon' }}>{item.object_status}</ListItem.Subtitle>
                        </View>

                    </View>
                </ListItem.Content>
            </ListItem>
        )
    }


    render(){
        return(
            <View>
                <AppHeader title = "Receieved Objects" />

                <View>
                    {
                        this.state.allReceivedObjects === 0 ?
                        (
                            <View style = {styles.nullContainer}>
                                <Text style = {{ fontSize: 20, fontWeight: 'bold' }}>List of Received Objects</Text>
                            </View>
                        ) :
                        (
                            <FlatList
                              data = {this.state.allReceivedObjects}
                              keyExtractor = {this.keyExtractor}
                              renderItem = {this.renderItem} 
                            />
                        )
                    }
                </View>
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

    titleText: {
        fontFamily: 'big caslon',
        fontWeight: 'bold'
    },
    
    nullContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }

})