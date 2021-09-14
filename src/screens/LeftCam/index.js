import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import {useTheme} from '@react-navigation/native';
import Batt from 'react-native-vector-icons/FontAwesome';
import Back from 'react-native-vector-icons/FontAwesome';

import styles from './style';

const {width, height} = Dimensions.get('window');

const level = {
  empty: 'battery-empty',
  batt1: 'battery-1',
  batt2: 'battery-2',
  batt3: 'battery-3',
  full: 'battery-full',
};

const index = ({navigation}) => {
  const {colors, font} = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.headers}>
        <Back
          name="chevron-left"
          size={height * 0.05}
          color={colors.text}
          onPress={() => navigation.goBack()}
        />
        <Batt name={level.batt2} size={height * 0.05} color={colors.text} />
      </View>
      <View style={styles.content}>
        <Text style={[styles.text, {fontFamily: font, color: colors.text}]}>
          Left Cam
        </Text>
      </View>
    </View>
  );
};

export default index;
