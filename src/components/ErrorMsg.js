import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {useDimensions} from '@react-native-community/hooks';

import {Fonts} from '../utils/fonts';

export default function ErrorMsg({errorMsg, fontF}) {
  const {width, height} = useDimensions().window;
  const portrait = width < height;
  const styles = StyleSheet.create({
    errStyle: {
      alignItems: 'flex-start',
      width: portrait ? width * 0.8 : height * 0.8,
      height: portrait ? width * 0.03 : height * 0.03,
      fontFamily: Fonts.Lato,
      justifyContent: 'center',
    },
  });
  return (
    <View style={styles.errStyle}>
      <Text
        style={{
          color: 'red',
          fontSize: width * 0.03 ,
          fontFamily: fontF,
        }}>
        {errorMsg}
      </Text>
    </View>
  );
}
