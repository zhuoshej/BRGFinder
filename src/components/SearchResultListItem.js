import React, { Component } from 'react';
import { View, Image, Text, LayoutAnimation, Linking } from 'react-native';
import { connect } from 'react-redux';
import { Card, CardSection, Spinner, CircleButton, Button } from './common';
import PriceAndPointsDetailCard from './PriceAndPointsDetailCard';
import { resolveCompeteURL } from '../actions';

const NOOPTION = 'No Points Option';

class SearchResultListItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detailsOn: false,
      loadingCompeteURL: false,
      buttonMessage: 'Grab Your BRG Now!'
    };
  }
  componentWillUpdate() {
    LayoutAnimation.spring();
  }
  onBRGCheckMarkPress() {
    this.setState({ detailsOn: !this.state.detailsOn });
  }

  onRedirectButtonPress(url) {
    this.setState({ loadingCompeteURL: false, buttonMessage: 'Grab Your BRG Now!' });
    Linking.openURL(url);
  }

  renderPriceAndPointsDetail({ CP, FN, BAR }) {
    if (!BAR) {
      if (!FN) {
        return (<PriceAndPointsDetailCard price={BAR} pointUsage={NOOPTION} />);
      }
      return (<PriceAndPointsDetailCard price={BAR} pointUsage={`${FN} STARPOINTS`} />);
    }
    let unitPointsValue = 0;
    if (CP && FN) {
      unitPointsValue = (BAR - CP.c) / CP.p;
      if (unitPointsValue > (BAR / FN)) {
        return (<PriceAndPointsDetailCard price={BAR} pointUsage={`${CP.p} STARPOINTS + $${CP.c}`} unitPointsValue={unitPointsValue} />);
      }
      unitPointsValue = BAR / FN;
      return (<PriceAndPointsDetailCard price={BAR} pointUsage={`${FN} STARPOINTS`} unitPointsValue={unitPointsValue} />);
    } else if (CP) {
      unitPointsValue = (BAR - CP.c) / CP.p;
      return (<PriceAndPointsDetailCard price={BAR} pointUsage={`${CP.p} STARPOINTS + $${CP.c}`} unitPointsValue={unitPointsValue} />);
    } else if (FN) {
      unitPointsValue = BAR / FN;
      return (<PriceAndPointsDetailCard price={BAR} pointUsage={`${FN} STARPOINTS`} unitPointsValue={unitPointsValue} />);
    }

    return (<PriceAndPointsDetailCard price={BAR} pointUsage={NOOPTION} />);
  }

  renderBRGStatus(BRGStatus) {
    if (!BRGStatus) {
      return (
        <View>
          <Spinner />
        </View>
      );
    } else if (!BRGStatus.error) {
      return (
        <View>
          <CircleButton ratio={0.9} borderWidth={0} onPress={this.onBRGCheckMarkPress.bind(this)}>
            {this.state.detailsOn ? '—' : '✓'}
          </CircleButton>
        </View>
      );
    }
  }

  renderErrorMessage(hotel) {
    const { errorMessageStyle, errorMessageContainerStyle } = styles;
    if (hotel && hotel.error) {
      return (
        <View style={errorMessageContainerStyle}>
          <Text style={errorMessageStyle}>
            {hotel.error}
          </Text>
        </View>
      );
    }
  }

  renderBRGDetailButton(competeURL) {
    const { loadingCompeteURL, buttonMessage } = this.state;
    return (
      <Button
        onPress={
          () => {
            this.setState({ loadingCompeteURL: true, buttonMessage: 'Fetching Your BRG URL' });
            resolveCompeteURL(competeURL, this.onRedirectButtonPress.bind(this));
          }
        }
        disabled={loadingCompeteURL}
      >
        {buttonMessage}
      </Button>
    );
  }

  renderBRGDetail(hotel, officialRate, duration) {
    const { brgDetailContainerStyle } = styles;
    if (hotel && !hotel.error && this.state.detailsOn) {
      const { competeRate, competeProvider } = hotel;
      const competeURL = `https://www.hotelscombined.com${hotel.competeURL}`;
      let option = '2000 STARPOINTS';
      let saved = `$${(officialRate - competeRate) * duration} + 2000 STARPOINTS ≈ $${(officialRate - competeRate) + 40}`;
      if ((officialRate - (competeRate * 0.8)) * duration > 40) {
        option = '20% off';
        saved = `$${((officialRate - (competeRate * 0.8)) * duration).toFixed(0)}`;
      }

      if (!officialRate) {
        if ((competeRate * 0.2) * duration > 40) {
          option = '20% off';
          saved = `$${(competeRate * 0.2 * duration).toFixed(0)}`;
        } else {
          option = '2000 STARPOINTS';
          saved = '2000 STARPOINTS ≈ $40';
        }
      }

      return (
        <View style={brgDetailContainerStyle}>
          <CardSection style={{ flexDirection: 'column' }}>
            <Text>
              BRG Price: ${competeRate}
            </Text>
            <Text>
              BRG Option: {option}
            </Text>
            <Text>
              BRG Provider: {competeProvider}
            </Text>
            <Text>
              Total save for your {duration} night(s) stay: {saved}
            </Text>
          </CardSection>
          <CardSection>
            {this.renderBRGDetailButton(competeURL)}
          </CardSection>
        </View>
      );
    }
  }

  render() {
    const { hotel, searchResultInformation, duration } = this.props;
    const {
      CP,
      FN,
      hotel_name,
      img,
    } = hotel;

    const BAR = parseInt(hotel.BAR, 10);
    const {
      leftStyle,
      rightStyle,
      imageStyle,
      detailContainerStyle,
      titleTextStyle
    } = styles;
    const smallImgUrl = img ? img.replace('tt', 'ss') : undefined
    const imgUri = `https://www.starwoodhotels.com${smallImgUrl}`;
    return (
      <View>
        <Card>
          {this.renderErrorMessage(searchResultInformation[hotel_name])}
          <View style={{ flexDirection: 'row' }}>
            <View style={leftStyle}>
              <Image
                style={imageStyle}
                source={{ uri: imgUri }}
                />
            </View>
            <View style={rightStyle}>
              <View>
                <Text style={titleTextStyle}>
                  {hotel_name}
                </Text>
              </View>
              <View style={detailContainerStyle}>
                {this.renderPriceAndPointsDetail({ CP, FN, BAR })}
                {this.renderBRGStatus(searchResultInformation[hotel_name])}
              </View>
            </View>
          </View>
          {this.renderBRGDetail(searchResultInformation[hotel_name], BAR, duration)}
        </Card>
      </View>
    );
  }
}

const mapStateToProps = (state) => {
  const { searchResultInformation } = state;
  const { startDate, endDate } = state.searchFormInfomation;
  const duration = endDate.diff(startDate, 'days');
  return { searchResultInformation, duration };
};

const styles = {
  leftStyle: {
    flex: 1,
    position: 'relative',
  },
  rightStyle: {
    flex: 2,
    flexDirection: 'column',
    justifyContent: 'space-around',
    position: 'relative'
  },
  imageStyle: {
    width: 100,
    height: 130,
    margin: 5
  },
  detailContainerStyle: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  titleTextStyle: {
    fontSize: 17,
    fontFamily: 'HelveticaNeue-Medium',
  },
  errorMessageStyle: {
    textAlign: 'center',
    fontSize: 13,
    fontFamily: 'HelveticaNeue-Medium'
  },
  errorMessageContainerStyle: {
    backgroundColor: 'red'
  },
  brgDetailContainerStyle: {
    borderTopWidth: 1,
    borderColor: 'rgb(211,211,211)',
    marginLeft: 5,
    marginRight: 5,
    paddingTop: 10,
    paddingBottom: 10,
    flexDirection: 'column',
    justifyContent: 'space-around'
  }
};

export default connect(mapStateToProps)(SearchResultListItem);
