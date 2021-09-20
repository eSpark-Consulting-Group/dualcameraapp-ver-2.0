import React from 'react';
import {ActivityIndicator, Dimensions} from 'react-native';
import Modal from 'react-native-modal';

function Loader() {
  const {width, height} = Dimensions.get('window');
  return (
    <Modal isVisible={true}>
      <ActivityIndicator size="large" color="#4f55bd" />
    </Modal>
  );
}

export default Loader;
