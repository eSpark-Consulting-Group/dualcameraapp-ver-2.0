import React from 'react';
import {
  StyleSheet,
  View,
  StatusBar,
  Platform,
  SafeAreaView,
} from 'react-native';

const MyStatusBar = ({backgroundColor, ...props}) => (
  <View style={[styles.statusBar, {backgroundColor}]}>
    <SafeAreaView>
      <StatusBar backgroundColor={backgroundColor} {...props} />
    </SafeAreaView>
  </View>
);
const CustumStatusBar = () => {
  return (
    <View>
      <MyStatusBar backgroundColor="#202427" barStyle="light-content" />
    </View>
  );
};
const APPBAR_HEIGHT =
  Platform.OS === 'ios' ? StatusBar.currentHeight : StatusBar.currentHeight / 2;

const styles = StyleSheet.create({
  statusBar: {
    height: APPBAR_HEIGHT,
  },
});
export default CustumStatusBar;
