import React from 'react';
import { createDrawerNavigator } from 'react-navigation-drawer';

import { TabNavigator } from './AppTabNavigator';
import CustomSideBarMenu from './CustomSideBarMenu';
import SettingsScreen from '../Screens/SettingsScreen';
import MyBarters from '../Screens/MyBarters';
import NotificationsScreen from '../Screens/NotificationsScreen';
import MyReceivedObjects from '../Screens/MyReceivedObjects';

export const DrawerNavigator = createDrawerNavigator({

    Settings: { screen: SettingsScreen },
    Home: { screen: TabNavigator },
    Notifications: { screen: NotificationsScreen },
    MyBarters: { screen: MyBarters },
    ReceivedObjects: { screen: MyReceivedObjects }

},

    { contentComponent: CustomSideBarMenu },
    { initialRouteName: 'Home' }
    
);