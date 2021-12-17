import React from 'react';
import {ActivityIndicator} from 'react-native';
import Modal from 'react-native-modal';

function Loader({color}) {
  return (
    <Modal isVisible={true}>
      <ActivityIndicator size="large" color={color ?? '#4f55bd'} />
    </Modal>
  );
}

export default Loader;
