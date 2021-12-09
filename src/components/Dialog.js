import React from 'react';
import {StyleSheet, Text, View, Dimensions} from 'react-native';
import {Dialog} from 'react-native-simple-dialogs';

const {width, height} = Dimensions.get('window');

export default function App({
  dialogVisible,
  dialogStyle,
  onTouchOut,
  content,
  animate,
}) {
  return (
    <View style={styles.container}>
      <Dialog
        visible={dialogVisible}
        contentStyle={styles.contentStyle}
        overlayStyle={styles.overlayStyle}
        dialogStyle={dialogStyle}
        onTouchOutside={onTouchOut}
        animationType={animate}>
        {content}
      </Dialog>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
  contentStyle: {justifyContent: 'center', alignItems: 'center'},
  overlayStyle: {paddingHorizontal: width * 0.2},
});
