import 'react-native-gesture-handler';
import React from 'react';
import {StyleSheet, Text, View, SafeAreaView, Dimensions} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';

import Home from '../screens/Home';
import Video from '../screens/Videos/index';
import Settings from '../screens/Settings/index';

const Drawer = createDrawerNavigator();

const {width, height} = Dimensions.get('window');

DrawerContent = () => {
  return (
    <DrawerContentScrollView scrollEnabled={false}>
      <SafeAreaView style={{backgroundColor: '#1C212D'}}>
        {/* <View
          style={{
            height: height * 0.3,
            backgroundColor: '#1C212D',
            alignItems: 'center',
            justifyContent: 'center',
          }}></View> */}
      </SafeAreaView>
    </DrawerContentScrollView>
  );
};

const DrawerStack = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerPosition="right"
      drawerContent={props => <DrawerContent />}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Video" component={Video} />
      <Drawer.Screen name="Settings" component={Settings} />
    </Drawer.Navigator>
  );
};

export default DrawerStack;
