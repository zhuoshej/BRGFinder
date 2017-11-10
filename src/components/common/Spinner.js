import React from 'react';
import { View, ActivityIndicator } from 'react-native';

const calculateSize = (ratio = 1) => {
  const { spinnerStyle } = styles;
  return [
    spinnerStyle,
    { height: 50 * ratio, width: 50 * ratio, borderRadius: (50 * ratio) / 2 }
  ];
};

const Spinner = ({ ratio, size }) => {
  return (
    <View style={calculateSize(ratio)}>
      <ActivityIndicator size={size || 'large'} />
    </View>
  );
};


const styles = {
  spinnerStyle: {
    alignItems: 'center',
    justifyContent: 'center'
  }
};

export { Spinner };
