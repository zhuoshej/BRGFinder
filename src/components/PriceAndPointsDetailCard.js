import React from 'react';
import { View, Text } from 'react-native';


const PriceAndPointsDetailCard = ({ price, pointUsage, unitPointsValue }) => {
  const { containerStyle } = styles;
  return (
    <View style={containerStyle}>
      <Text>
        Price/Night: { price ? `$${price}` : 'No Avliable Room' }
      </Text>
      <Text>
        {pointUsage}
      </Text>
      {unitPointsValue ? <Text>Points Value: ${unitPointsValue.toFixed(3)}/Point</Text> : null}
    </View>
  );
};

const styles = {
  containerStyle: {
    flexDirection: 'column',
    justifyContent: 'space-around'
  }
};

export default PriceAndPointsDetailCard;
