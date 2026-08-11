import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {useDimensions} from '@react-native-community/hooks';

export default function SubTitle({text, fontF}) {
  const {width, height} = useDimensions().window;
  const portrait = width < height;

  const styles = StyleSheet.create({
    textStyle: {
      color: '#fff',
      opacity: 0.85,
      fontSize: portrait ? width * 0.055 : height * 0.055,
      bottom: portrait ? height * 0.02 : height * 0.01,
    },
  });
  return (
    <View
      style={{
        paddingHorizontal: portrait ? width * 0.1 : height * 0.1,
        paddingVertical: portrait ? width * 0.04 : height * 0.04,
      }}>
      <Text
        style={[
          styles.textStyle,
          {
            color: '#575757',
            fontFamily: fontF,
            textAlign: 'center',
          },
        ]}>
        {text}
      </Text>
    </View>
  );
}
