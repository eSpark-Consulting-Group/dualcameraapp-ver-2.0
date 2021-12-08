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
    <View style={styles.container}>
      <MyStatusBar backgroundColor="#202427" barStyle="light-content" />
    </View>
  );
};
const STATUSBAR_HEIGHT = StatusBar.currentHeight / 2;
const APPBAR_HEIGHT =
  Platform.OS === 'ios' ? StatusBar.currentHeight : StatusBar.currentHeight / 2;

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },
  statusBar: {
    height: APPBAR_HEIGHT,
  },
  appBar: {
    backgroundColor: '#79B45D',
    height: APPBAR_HEIGHT,
  },
  content: {
    flex: 1,
    backgroundColor: '#33373B',
  },
});
export default CustumStatusBar;
