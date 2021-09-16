import 'react-native-gesture-handler';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import {
  createDrawerNavigator,
  DrawerContentScrollView,
} from '@react-navigation/drawer';

import Home from '../screens/Home';
import Video from '../screens/Videos/index';
import Settings from '../screens/Settings/index';
import BillModal from '../modals/BillModal';
import PassModal from '../modals/PassModal';

import Icon from 'react-native-vector-icons/Ionicons';

const Drawer = createDrawerNavigator();

const {width, height} = Dimensions.get('window');

DrawerContent = ({navigation}) => {
  return (
    <DrawerContentScrollView
      scrollEnabled={false}
      style={{backgroundColor: '#1C212D'}}>
      <SafeAreaView style={styles.drawerContainerStyle}>
        <View style={styles.topViewStyle}>
          <View style={styles.logoStyle}>
            <Text style={[styles.textStyle, {color: '#fff'}]}>Logo here</Text>
          </View>
          <Text style={[styles.textStyle, styles.titleStyle]}>
            Account Settings
          </Text>
          <Text style={styles.textStyle}>check@check.com</Text>
          <View style={{flexDirection: 'row', marginVertical: height * 0.02}}>
            <Text style={[styles.textStyle, styles.tagStyle]}>
              created at:{'  '}
            </Text>
            <Text style={styles.textStyle}>20-Aug-2021</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('Bill')}>
            <View style={styles.itemViewStyle}>
              <Icon
                name="md-receipt-outline"
                color="#fff"
                size={height * 0.03}
                style={styles.iconStyle}
              />
              <Text style={styles.textStyle}>Billing Information</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Pass')}>
            <View style={styles.itemViewStyle}>
              <Icon
                name="lock-open-outline"
                color="#fff"
                size={height * 0.03}
                style={styles.iconStyle}
              />
              <Text style={styles.textStyle}>Change Password</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.bottomViewStyle}>
          <TouchableOpacity
            onPress={() => {
              navigation.replace('Login');
            }}>
            <View style={styles.itemViewStyle}>
              <Icon
                name="md-log-out-outline"
                color="#fff"
                size={height * 0.03}
                style={styles.iconStyle}
              />
              <Text style={styles.textStyle}>Sign Out</Text>
            </View>
          </TouchableOpacity>
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
      screenOptions={{swipeEnabled: false}}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={Home} />
      <Drawer.Screen name="Video" component={Video} />
      <Drawer.Screen name="Settings" component={Settings} />
      <Drawer.Screen name="Bill" component={BillModal} />
      <Drawer.Screen name="Pass" component={PassModal} />
    </Drawer.Navigator>
  );
};

export default DrawerStack;

const styles = StyleSheet.create({
  drawerContainerStyle: {
    height: height,
    paddingVertical: height * 0.05,
    justifyContent: 'space-between',
  },
  logoStyle: {
    width: width * 0.2,
    height: width * 0.2,
    borderColor: '#0f35bd',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: width * 0.002,
    borderRadius: width * 0.2,
    marginTop: height * 0.02,
    bottom: height * 0.05,
  },
  textStyle: {
    color: '#fff',
    opacity: 0.85,
    fontSize: width * 0.035,
  },
  titleStyle: {
    fontSize: width * 0.05,
  },
  tagStyle: {
    color: '#828282',
  },
  iconStyle: {paddingHorizontal: width * 0.05},
  itemViewStyle: {
    width: width / 2,
    flexDirection: 'row',
    marginVertical: height * 0.025,
  },
  topViewStyle: {
    alignItems: 'center',
  },
  bottomViewStyle: {
    alignItems: 'center',
  },
});
