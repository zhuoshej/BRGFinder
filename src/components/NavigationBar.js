import React from 'react';
import { Actions } from 'react-native-router-flux';
import { View, Text, TouchableOpacity } from 'react-native';

const NavigationBar = ({ props }) => {
  const {
    navigationBarStyle,
    sectionStyle,
    queryTextStyle,
    textLabelStyle
  } = styles;
  const { startDate, endDate, destination } = props;

  if (destination && startDate && endDate) {
    return (
      <View style={navigationBarStyle}>
        <View style={[sectionStyle, { borderBottomWidth: 3, borderColor: 'rgb(199,199,205)' }]}>
          <Text style={textLabelStyle}>
            Location
          </Text>
          <TouchableOpacity
            onPress={Actions.pop.bind(null, { refresh: { tap: 'destination' } })}
          >
            <Text style={queryTextStyle}>
              {destination}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={[sectionStyle, { borderBottomWidth: 3, borderColor: 'rgb(199,199,205)' }]}>
          <Text style={textLabelStyle}>
            Dates
          </Text>
          <TouchableOpacity
            onPress={Actions.pop.bind(null, { refresh: { tap: 'date' } })}
          >
            <Text style={queryTextStyle}>
              {startDate.format('MM/DD')} - {endDate.format('MM/DD')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
  return (
    <View />
  );
};

const styles = {
  navigationBarStyle: {
    position: 'absolute',
    paddingTop: 5,
    top: 0,
    height: 64,
    right: 0,
    left: 0,
    borderBottomColor: 'black',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  sectionStyle: {
    flexDirection: 'column',
    paddingTop: 10,
    marginLeft: 10,
    marginRight: 10,
    flex: 1
  },
  queryTextStyle: {
    fontFamily: 'HelveticaNeue-Medium',
    fontSize: 16,
    marginBottom: 3,
    textAlign: 'center'
  },
  textLabelStyle: {
    alignSelf: 'flex-start',
    fontSize: 13,
    fontFamily: 'HelveticaNeue-Medium',
    color: 'rgb(199,199,205)'
  }
};

export default NavigationBar;
