import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {useDimensions} from '@react-native-community/hooks';

// const {width, height} = Dimensions.get('window');

export default function Title({colors, text, fontF}) {
  const {width, height} = useDimensions().window;
  const portrait = width < height;
  const styles = StyleSheet.create({
    textStyle: {
      color: '#fff',
      opacity: 0.85,
      fontSize: portrait ? width * 0.09 : height * 0.06,
      bottom:portrait ? height * 0.02 : height * -0.01,
    },
  });
  return (
    <View style={{paddingHorizontal:portrait ?  width * 0.1 : height * 0.1}}>
      <Text
        style={[
          styles.textStyle,
          {
            color: colors.text,
            fontFamily: fontF,
            textAlign: 'center',
          },
        ]}>
        {text}
      </Text>
    </View>
  );
}
