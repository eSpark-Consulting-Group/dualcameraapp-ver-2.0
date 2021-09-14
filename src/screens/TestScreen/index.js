import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {Loader} from '../../components';

export default function index({navigation}) {
  useEffect(() => {
    setTimeout(() => {
      navigation.navigate('Home');
    }, 4000);
    return () => {};
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#181a1d'}}>
      <Loader />
    </View>
  );
}
