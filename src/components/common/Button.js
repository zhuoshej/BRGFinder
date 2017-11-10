import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { Spinner } from './Spinner';

const renderSpinner = (disabled) => {
  if (disabled) {
    return (
      <Spinner size={'small'} ratio={0.7} />
    );
  }
};

const Button = ({ onPress, children, disabled }) => {
  const { buttonStyle, textStyle } = styles;
  return (
    <TouchableOpacity onPress={onPress} style={buttonStyle} disabled={disabled}>
      <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
        <Text style={textStyle}>{children}</Text>
        {renderSpinner(disabled)}
      </View>
    </TouchableOpacity>
  );
};

const styles = {
  buttonStyle: {
    flex: 1,
    alignSelf: 'stretch',
    borderWidth: 1,
    borderRadius: 5,
    marginLeft: 5,
    marginRight: 5
  },
  textStyle: {
    alignSelf: 'center',
    fontSize: 16,
    fontWeight: '600',
    paddingTop: 10,
    paddingBottom: 10
  }
};

export { Button };
