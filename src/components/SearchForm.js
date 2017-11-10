import React, { Component } from 'react';
import { ListView, TextInput, Text, View, LayoutAnimation, TouchableWithoutFeedback } from 'react-native';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { searchFormUpdate, fetchOfficialHotelsList, fetchStop } from '../actions';
import CalendarModal from './CalendarModal';
import { CircleButton, Spinner, CardSection } from './common';

class SearchForm extends Component {
  state = {
    shouldShowDatePicker: false,
    shouldShowDestinationPicker: false
  };

  componentDidMount() {
    const { tap } = this.props;
    switch (tap) {
      case 'destination':
      this.refs.destinationInput.focus();
      break;
      case 'date':
      this.refs.dateInput.touchableHandlePress();
      break;
      default:
      return;
    }
  }
  componentWillReceiveProps(nextProps) {
    const { autoCompleteCandidates } = this.props;
    const nextAutoCompleteCandidates = nextProps.autoCompleteCandidates;
    const { tap } = nextProps;

    if (autoCompleteCandidates !== nextAutoCompleteCandidates) {
      this.createDataSource(nextAutoCompleteCandidates);
    }
    switch (tap) {
      case 'destination':
      this.refs.destinationInput.focus();
      fetchStop();
      break;
      case 'date':
      this.refs.dateInput.touchableHandlePress();
      fetchStop();
      break;
      default:
      return;
    }
  }

  componentWillUpdate() {
    LayoutAnimation.spring();
  }

  onDatePress() {
    Actions.refresh({ tap: undefined });
    this.setState({
      shouldShowDatePicker: true,
      shouldShowDestinationPicker: false
    });
    this.refs.destinationInput.blur();
  }

  onDestinationFocus() {
    Actions.refresh({ tap: undefined });
    this.setState({
      shouldShowDatePicker: false,
      shouldShowDestinationPicker: true
    });
    this.props.searchFormUpdate({ prop: 'destination', value: '' });
  }

  onDateSelect(date) {
    const { startDate, endDate } = this.props;
    if (startDate && endDate) {
      this.props.searchFormUpdate({ prop: 'startDate', value: date });
      this.props.searchFormUpdate({ prop: 'endDate', value: undefined });
    } else if (!startDate || startDate.isAfter(date)) {
      this.props.searchFormUpdate({ prop: 'startDate', value: date });
    } else if (startDate && !endDate && !startDate.isSame(date)) {
      this.props.searchFormUpdate({ prop: 'endDate', value: date });
    }
  }

  onSearchPress() {
    const { destination, startDate, endDate } = this.props;
    this.props.fetchOfficialHotelsList({ destination, startDate, endDate });
  }

  onAutoCompletePress(candidate) {
    this.props.searchFormUpdate({ prop: 'destination', value: candidate });
    this.refs.destinationInput.blur();
    this.refs.dateInput.touchableHandlePress();
  }

  createDataSource(autoCompleteCandidates) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.dataSource = ds.cloneWithRows(autoCompleteCandidates);
  }

  renderAutoComplete() {
    if (this.dataSource) {
      return (
        <ListView
          keyboardShouldPersistTaps={'always'}
          enableEmptySections
          dataSource={this.dataSource}
          renderRow={this.renderRow.bind(this)}
        />
      );
    }
  }

  renderRow(candidate) {
    const { autoCompleteTextStyle } = styles;

    return (
      <TouchableWithoutFeedback onPress={this.onAutoCompletePress.bind(this, candidate)}>
        <View>
          <CardSection style={{ borderBottomWidth: 1 }}>
            <Text style={autoCompleteTextStyle}>
              {candidate}
            </Text>
          </CardSection>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  renderBottomHalf() {
    const { shouldShowDatePicker, shouldShowDestinationPicker } = this.state;
    const { startDate, endDate } = this.props;

    if (shouldShowDatePicker) {
      return (
        <View style={{ alignSelf: 'center', alignItems: 'center' }}>
          <CalendarModal
            selectedStart={startDate}
            selectedEnd={endDate}
            onChange={this.onDateSelect.bind(this)}
          />
        </View>
      );
    } else if (shouldShowDestinationPicker) {
      return (
        <View style={{ alignSelf: 'center', alignItems: 'center' }}>
          {this.renderAutoComplete()}
        </View>
      );
    }
  }

  renderDateText() {
    const { placeHoldertextStyle, searchFormTextStyle } = styles;
    const { startDate, endDate } = this.props;
    if (!startDate) {
      return (
        <Text style={placeHoldertextStyle}>
          Dates
        </Text>
      );
    } else if (!endDate) {
      return (
        <Text style={placeHoldertextStyle}>
          {startDate.format('MM/DD/YYYY')} - Checkout Date
        </Text>
      );
    }

    return (
      <Text style={searchFormTextStyle.Date}>
        {startDate.format('MM/DD/YYYY')} - {endDate.format('MM/DD/YYYY')}
      </Text>
    );
  }

  renderButtonAndSpinner() {
    const { isFetchingHotelsList } = this.props;
    if (isFetchingHotelsList) {
      return (
        <Spinner />
      );
    }

    return (
      <CircleButton onPress={this.onSearchPress.bind(this)}>
        GO
      </CircleButton>
    );
  }

  renderError() {
    const {
      sectionStyle,
      errorStyle
    } = styles;
    const { fetchOfficialHotelsListError } = this.props;

    if (fetchOfficialHotelsListError) {
      return (
        <View style={sectionStyle}>
          <Text style={errorStyle}>
            {fetchOfficialHotelsListError}
          </Text>
        </View>
      );
    }
  }

  render() {
    const {
      containerStyle,
      upperContainerStyle,
      lowerContainerStyle,
      sectionStyle,
      searchFormTextStyle
    } = styles;

    return (
      <View style={containerStyle}>
        <View style={upperContainerStyle}>
          <View style={[sectionStyle, { borderBottomWidth: 1 }]}>
            <TextInput
              ref='destinationInput'
              placeholder='Location'
              value={this.props.destination}
              onChangeText={(value) => this.props.searchFormUpdate({ prop: 'destination', value })}
              onFocus={this.onDestinationFocus.bind(this)}
              autoCorrect={false}
              style={searchFormTextStyle.Destination}
            />
          </View>
          <TouchableWithoutFeedback
            ref='dateInput'
            onPress={this.onDatePress.bind(this)}
          >
            <View style={[sectionStyle, { borderBottomWidth: 1 }]}>
              {this.renderDateText()}
            </View>
          </TouchableWithoutFeedback>
          {this.renderError()}
          <View style={sectionStyle}>
            {this.renderButtonAndSpinner()}
          </View>
        </View>
        <View style={lowerContainerStyle}>
          {this.renderBottomHalf()}
        </View>
      </View>
    );
  }
}


const mapStateToProps = (state) => {
  const { destination, startDate, endDate, autoCompleteCandidates } = state.searchFormInfomation;
  const { isFetchingHotelsList, fetchOfficialHotelsListError } = state.searchResultInformation;
  return { destination, startDate, endDate, isFetchingHotelsList, fetchOfficialHotelsListError, autoCompleteCandidates };
};

const styles = {
  containerStyle: {
    flexDirection: 'column',
    flex: 1,
    borderBottomWidth: 0,
    elevation: 1
  },
  upperContainerStyle: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  lowerContainerStyle: {
    flex: 3,
    flexDirection: 'column',
    justifyContent: 'space-around',
  },
  sectionStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    marginLeft: 25,
    marginRight: 25
  },
  placeHoldertextStyle: {
    color: 'rgb(199,199,205)',
    fontFamily: 'HelveticaNeue-Medium',
    fontSize: 16,
    paddingBottom: 10
  },
  searchFormTextStyle: {
    Date: {
      fontFamily: 'HelveticaNeue-Medium',
      fontSize: 16,
      paddingBottom: 10
    },
    Destination: {
      fontFamily: 'HelveticaNeue-Medium',
      fontSize: 16,
      height: 40,
      textAlign: 'center'
    }
  },
  errorStyle: {
    fontSize: 20,
    alignSelf: 'center',
    color: 'red'
  },
  autoCompleteTextStyle: {
    fontSize: 18,
    paddingLeft: 15
  },
  fullBackgroundImage: {
    flex: 1,
    width: null,
    height: null,
  },
};

export default connect(mapStateToProps, { searchFormUpdate, fetchOfficialHotelsList })(SearchForm);
