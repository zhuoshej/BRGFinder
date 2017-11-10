import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

const calculateSize = ({ ratio = 1, borderWidth = 1, backgroundColor }) => {
  return [
    styles.buttonStyle,
    {
      height: 50 * ratio,
      width: 50 * ratio,
      borderRadius: (50 * ratio) / 2,
      borderWidth,
      backgroundColor
    }
  ];
};

const CircleButton = ({ onPress, ratio, borderWidth, backgroundColor, children }) => {
  const { textStyle } = styles;
  return (
    <TouchableOpacity onPress={onPress} style={calculateSize({ ratio, borderWidth, backgroundColor })}>
    <Text style={textStyle}>
      {children}
    </Text>
    </TouchableOpacity>
  );
};

const styles = {
  buttonStyle: {
    height: 50,
    width: 50,
    borderRadius: 50 / 2,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: 'black',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 1,
  },
  textStyle: {
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  }
};

export { CircleButton };
