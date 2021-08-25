import React from 'react';
import { createStackNavigator } from 'react-navigation-stack';
import HomeScreen from '../Screens/HomeScreen';
import UserDetails from '../Screens/UserDetails';

export const StackNavigator = createStackNavigator({

  HomeScreen: {
    screen: HomeScreen,
    navigationOptions: { headerShown: false }
  },

  UserDetails: {
    screen: UserDetails,
    navigationOptions: { headerShown: false }
  }

},
  
  { initialRouteName: 'HomeScreen' }

)