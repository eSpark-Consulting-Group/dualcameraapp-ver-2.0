import React, {useEffect} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
  StyleSheet,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import HomeIcon from 'react-native-vector-icons/AntDesign';
import DotIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Fonts} from '../utils/fonts';
import {useNavigation} from '@react-navigation/native';
import {useDimensions} from '@react-native-community/hooks';
import {useState as uS} from '@hookstate/core';

import {rS, cS} from '../states';

// import Color from './../../theme/Colors';
// import { Images, Metrics, Colors, Fonts } from '../../theme';

// import styles from './style';
// import style from './style';

function Footer(props) {
  const {width, height} = useDimensions().window;
  const portrait = width < height;
  const {children, screen, tab, hide} = props;
  const navigation = useNavigation();

  const cam_On = uS(cS);
  const rec_On = uS(rS);

  const style = StyleSheet.create({
    mainContainer: {
      flex: 1,
      // backgroundColor: '#1B1F22',
      // backgroundColor: 'purple',
    },
    headerContainer: {
      flex: 2.3,
      justifyContent: 'space-between',
      width: width,
    },
    headerChild: {
      backgroundColor: '#1B1F22',
      flexDirection: 'row',
      flex: 2,
      justifyContent: 'space-around',
      alignItems: 'center',
    },
    tabsText: {fontSize: 18, fontFamily: 'LexendDeca-Regular'},
    headingText: {fontSize: 22, fontWeight: 'bold', marginLeft: 20},
    tabsContainer: {
      // flex: 1.5,
      backgroundColor: '#1C212D',
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
    },

    footerContainer: {
      padding: portrait ? height * 0.01 : width * 0.01,
      backgroundColor: '#1C212D',
      justifyContent: 'center',
      width: width * 1,
      height: portrait ? height * 0.09 : width * 0.06,
    },
    footerSubContainer: {
      width: portrait ? width * 0.9 : height * 0.9,
      height: portrait ? height * 0.09 : width * 0.09,
      flexDirection: 'row',
      justifyContent: portrait ? 'space-around' : 'space-between',
      alignSelf: 'center',
    },
    headerHeading: {fontSize: portrait ? width * 0.04 : height * 0.04},
    bodyContainer: {flex: 1},
    footerScreenNameInactive: {
      fontSize: portrait ? height * 0.018 : width * 0.018,
      color: 'grey',
      textAlign: 'center',
      fontFamily: Fonts.Lato,
    },
    footerScreenNameActive: {
      fontSize: portrait ? height * 0.018 : width * 0.018,
      color: '#5432D3',
      textAlign: 'center',
      fontFamily: Fonts.Lato,
    },
    addButtonContainer: {
      width: portrait ? height * 0.06 : width * 0.06,
      backgroundColor: 'white',
      borderRadius: portrait ? height * 0.1 : width * 0.1,
      bottom: portrait ? height * 0.025 : width * 0.025,
      justifyContent: 'center',
      alignItems: 'center',
    },
    centerAlign: {alignItems: 'center'},
    centerJustify: {justifyContent: 'center'},
  });

  return (
    <View style={style.mainContainer}>
      <View style={style.bodyContainer}>{children}</View>
      {hide ? null : (
        <View style={style.footerContainer}>
          <View style={style.footerSubContainer}>
            <TouchableOpacity
              activeOpacity={0.1}
              onPress={() => navigation.navigate('Home')}
              style={style.centerJustify}>
              {screen != 'home' ? (
                <View style={style.centerAlign}>
                  <Icon
                    name="md-videocam"
                    size={portrait ? height * 0.035 : width * 0.035}
                    color={'gray'}
                  />
                </View>
              ) : (
                <View style={style.centerAlign}>
                  <Icon
                    name="md-videocam"
                    size={portrait ? height * 0.035 : width * 0.035}
                    color={'white'}
                  />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.1}
              style={style.centerJustify}
              onPress={() => {
                rec_On.get()
                  ? alert('Please turn off Recording to View')
                  : navigation.navigate('Video');
              }}>
              {screen != 'video' ? (
                <View style={style.centerAlign}>
                  <Icon
                    name="md-albums-outline"
                    size={portrait ? height * 0.045 : width * 0.045}
                    color={'gray'}
                  />
                  <Icon
                    name="ios-logo-youtube"
                    size={portrait ? height * 0.02 : width * 0.02}
                    color={'gray'}
                    style={{
                      position: 'absolute',
                      left: portrait ? width * 0.02 : height * 0.02,
                      top: portrait ? height * 0.017 : width * 0.017,
                    }}
                  />
                </View>
              ) : (
                <View style={style.centerAlign}>
                  <Icon
                    name="md-albums-outline"
                    size={portrait ? height * 0.045 : width * 0.045}
                    color={'white'}
                  />
                  <Icon
                    name="ios-logo-youtube"
                    size={portrait ? height * 0.02 : width * 0.02}
                    color={'white'}
                    style={{
                      position: 'absolute',
                      left: portrait ? width * 0.02 : height * 0.02,
                      top: portrait ? height * 0.017 : width * 0.017,
                    }}
                  />
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={style.centerJustify}
              activeOpacity={0.1}
              onPress={() => navigation.navigate('Settings')}>
              {screen != 'Settings' ? (
                <View style={style.centerAlign}>
                  <Icon
                    name="settings-sharp"
                    size={portrait ? height * 0.035 : width * 0.035}
                    color={'gray'}
                  />
                </View>
              ) : (
                <View style={style.centerAlign}>
                  <Icon
                    name="settings-sharp"
                    size={portrait ? height * 0.035 : width * 0.035}
                    color={'white'}
                  />
                </View>
              )}
            </TouchableOpacity>
            {/* <TouchableOpacity
          activeOpacity={0.1}
          style={style.centerJustify}
          onPress={() => navigation.navigate('More')}>
          {screen != 'More' ? (
            <View style={style.centerAlign}>
              <Icon
                name="md-ellipsis-horizontal"
                size={height * 0.035}
                color={'gray'}
              />
            </View>
          ) : (
            <View style={style.centerAlign}>
              <Icon
                name="md-ellipsis-horizontal"
                size={height * 0.035}
                color={'white'}
              />
            </View>
          )}
        </TouchableOpacity> */}
          </View>
        </View>
      )}
    </View>
  );
}

export default Footer;
