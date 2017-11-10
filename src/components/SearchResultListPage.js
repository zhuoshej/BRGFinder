import React, { Component } from 'react';
import { ListView } from 'react-native';
import { connect } from 'react-redux';
import SearchResultListItem from './SearchResultListItem';
import { fetchAllCompeteInformation, deconstructDestination } from '../actions';
import NavigationBar from './NavigationBar';

class SearchResultPage extends Component {
  static renderNavigationBar = (props) => {
    return (
      <NavigationBar props={props} />
    );
  }
  componentWillMount() {
    this.createDataSource(this.props);
    this.startFetchingCompeteInformation(this.props);
  }

  createDataSource({ hotelsList }) {
    const ds = new ListView.DataSource({
      rowHasChanged: (r1, r2) => r1 !== r2
    });
    this.dataSource = ds.cloneWithRows(hotelsList);
  }

  startFetchingCompeteInformation({ hotelsList, duration }) {
    const { country } = deconstructDestination(this.props.destination);
    this.props.fetchAllCompeteInformation({ hotelsList, duration, country });
  }

  renderRow(hotel) {
    return (
      <SearchResultListItem hotel={hotel} />
    );
  }

  render() {
    return (
      <ListView
        enableEmptySections
        dataSource={this.dataSource}
        renderRow={this.renderRow}
        initialListSize={this.props.hotelsList.length}
        removeClippedSubviews={false}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const { hotelsList } = state.searchResultInformation;
  const { destination, endDate, startDate } = state.searchFormInfomation;
  const duration = endDate.diff(startDate, 'days');
  return { hotelsList, destination, duration };
};

export default connect(mapStateToProps, { fetchAllCompeteInformation })(SearchResultPage);
