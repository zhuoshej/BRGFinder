import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';

const SearchFormInit = () => {
  const {
    upperContainerStyle,
    lowerContainerStyle,
    sectionStyle,
    textLabelStyle,
    queryTextStyle,
    titleStyle,
    wrapperStyle
  } = styles;

  return (
    <View style={{ flex: 1, flexDirection: 'column' }}>
      <View style={upperContainerStyle}>
        <Text style={titleStyle}>
          Your Next BRG is Here!
        </Text>
        <View style={wrapperStyle}>
          <View style={[sectionStyle, { borderBottomWidth: 3, borderColor: 'rgb(199,199,205)' }]}>
            <Text style={textLabelStyle}>
              Location
            </Text>
            <TouchableOpacity
              onPress={
                Actions.SearchForm.bind(null, { tap: 'destination' })
              }
            >
              <Text style={queryTextStyle}>
                Your Destination
              </Text>
            </TouchableOpacity>
          </View>

          <View style={[sectionStyle, { borderBottomWidth: 3, borderColor: 'rgb(199,199,205)' }]}>
            <Text style={textLabelStyle}>
              Dates
            </Text>
            <TouchableOpacity
              onPress={
                Actions.SearchForm.bind(null, { tap: 'date' })
              }
            >
              <Text style={queryTextStyle}>
                Your Dates
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
      <View style={lowerContainerStyle} />
    </View>
  );
};

const styles = {
  upperContainerStyle: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sectionStyle: {
    flexDirection: 'column',
    paddingTop: 10,
    marginBottom: 10,
    marginLeft: 10,
    marginRight: 10,
    flex: 1
  },
  lowerContainerStyle: {
    flex: 2,
    flexDirection: 'column'
  },
  textLabelStyle: {
    alignSelf: 'flex-start',
    fontSize: 13,
    fontFamily: 'HelveticaNeue-Medium',
    color: 'rgb(199,199,205)'
  },
  queryTextStyle: {
    fontFamily: 'HelveticaNeue-Medium',
    fontSize: 16,
    marginBottom: 3,
    textAlign: 'center'
  },
  titleStyle: {
    fontSize: 19,
    textAlign: 'center',
    fontWeight: 'bold'
  },
  textSentencesStyle: {
    fontSize: 16,
    marginLeft: 10,
    marginRight: 10,
  },
  wrapperStyle: {
    flexDirection: 'row',
    borderRadius: 5,
    backgroundColor: 'white',
    margin: 10
  }
};

export default SearchFormInit;
