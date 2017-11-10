import React from 'react';
import { View } from 'react-native';
import Calendar from 'react-native-calendar-datepicker';
import Moment from 'moment';

const CalendarModal = ({ onChange, selectedStart, selectedEnd }) => {
  const { containerStyle } = styles;
  return (
    <View style={containerStyle}>
      <Calendar
        onChange={onChange}
        selected={selectedStart ? Moment(selectedStart).startOf('day') : undefined}
        selectedEnd={selectedEnd ? Moment(selectedEnd).startOf('day') : undefined}
        minDate={Moment().add(1, 'days').startOf('day')}
        maxDate={Moment().add(1, 'years').startOf('day')}
      />
    </View>
  );
};

const styles = {
  containerStyle: {
    backgroundColor: 'rgba(0, 0, 0, 0)',
    position: 'relative',
    flex: 1,
    justifyContent: 'center',
    paddingTop: 40
  }
};

export default CalendarModal;
