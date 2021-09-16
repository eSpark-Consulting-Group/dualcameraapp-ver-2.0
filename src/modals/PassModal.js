import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

function PassModal() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pass Modal</Text>
    </View>
  );
}

export default function PassStack() {
  return (
    <Stack.Navigator mode="modal" headerMode="none">
      <Stack.Screen name="Pass" component={PassModal} />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 50,
  },
});
