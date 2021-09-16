import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createStackNavigator();

function BillModal({navigation}) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Bill Modal</Text>
      <Text style={styles.text} onPress={() => navigation.goBack()}>
        Go Back
      </Text>
    </View>
  );
}

export default function BillStack() {
  return (
    <Stack.Navigator mode="modal" headerMode="none">
      <Stack.Screen name="Bill" component={BillModal} />
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
