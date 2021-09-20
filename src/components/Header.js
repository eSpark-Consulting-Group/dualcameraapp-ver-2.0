import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Fonts} from '../utils/fonts';
import Icon from 'react-native-vector-icons/Ionicons';
import IconMat from 'react-native-vector-icons/MaterialCommunityIcons';
import {useDimensions} from '@react-native-community/hooks';

export default function Header({
  colors,
  title,
  extraContent,
  iconName,
  iconColor,
  iconSize,
  iconMaterial,
}) {
  const {width, height} = useDimensions().window;
  const portrait = width < height;

  const styles = StyleSheet.create({
    container: {
      height: portrait ? height * 0.08 : width * 0.06,
      width: width,
      backgroundColor: '#1C212D',
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: portrait ? width * 0.03 : height * 0.03,
      elevation: portrait ? width * 0.01 : height * 0.01,
    },
    textStyle: {
      fontSize: portrait ? height * 0.03 : width * 0.03,
      marginLeft: portrait ? width * 0.02 : height * 0.02,
    },
    recordButton: {
      borderRadius: height * 0.05,
      height: height * 0.05,
      width: height * 0.05,
      borderWidth: height * 0.028,
    },
  });

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        {iconMaterial ? (
          <IconMat name={iconName} color={iconColor} size={iconSize} />
        ) : (
          <Icon name={iconName} color={iconColor} size={iconSize} />
        )}
        <Text
          style={[
            styles.textStyle,
            {color: colors.text, fontFamily: Fonts.Lato},
          ]}>
          {title}
        </Text>
      </View>
      {extraContent}
    </View>
  );
}
