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
    <DrawerContentScrollView
      scrollEnabled={false}
      style={{backgroundColor: '#1C212D'}}>
      <SafeAreaView
        style={{
          height: height,
          alignItems: 'center',
          paddingVertical: height * 0.05,
        }}>
        <View style={styles.logoStyle}>
          <Text style={[styles.textStyle, {color: '#fff'}]}>Logo here</Text>
        </View>
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

const styles = StyleSheet.create({
  logoStyle: {
    width: height * 0.17,
    height: height * 0.17,
    borderColor: '#0f35bd',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: height * 0.002,
    borderRadius: height * 0.2,
    marginVertical: height * 0.02,
    bottom: height * 0.05,
    padding: height * 0.002,
  },
  textStyle: {
    color: '#fff',
    opacity: 0.85,
    fontSize: width * 0.05,
  },
});
