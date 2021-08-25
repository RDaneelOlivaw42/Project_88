import React from 'react';
import { Image } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import ExchangeScreen from '../Screens/ExchangeScreen';
import HomeScreen from '../Screens/HomeScreen';
import { StackNavigator } from './AppStackNavigator';


export const TabNavigator = createBottomTabNavigator({

    HomeScreen: {
        screen: StackNavigator,
        navigationOptions: {
            tabBarIcon: <Image 
                          style = {{ width: 30, height: 30 }}
                          source = {require('../assets/homeicon.png')}/>,
            tabBarLabel: "Home"
        }
    },

    ExchangeScreen: {
        screen: ExchangeScreen,
        navigationOptions: {
            tabBarIcon: <Image 
                          style = {{ width: 30, height: 30 }}
                          source = {require('../assets/exchangeicon.png')}/>,
            tabBarLabel: "Exchange"
        }
    }

});