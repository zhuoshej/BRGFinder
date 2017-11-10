import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import {
  FETCH_OFFICIAL_HOTELS_LIST,
  FETCH_OFFICIAL_HOTELS_LIST_SUCCESS,
  FETCH_OFFICIAL_HOTELS_LIST_FAIL,
  FETCH_COMPETE_SUCCESS,
  FETCH_COMPETE_FAIL
} from './types';

import { BRGBlackList, vatSPGInclusiveList } from './lists.json';

const DomParser = require('react-native-html-parser').DOMParser;

const format = 'MM/DD/YYYY';

let stop = false;

export const deconstructDestination = (destination) => {
  const temp = destination.split(',');
  if (temp.length === 3) {
    return ({
      originalCity: temp[0].trim(),
      city: temp[0].trim().toLowerCase().replace(' ', '+'),
      state: temp[1].trim().toLowerCase().replace(' ', '+'),
      country: temp[2].trim().toLowerCase().replace(' ', '+')
    });
  } else if (temp.length === 1) {
    return ({
      originalCity: temp[0].trim(),
      city: temp[0].trim().toLowerCase().replace(' ', '+'),
    });
  }
  return ({
    originalCity: temp[0].trim(),
    city: temp[0].trim().toLowerCase().replace(' ', '+'),
    country: temp[1].trim().toLowerCase().replace(' ', '+')
  });
};

export const fetchOfficialHotelsList = ({ destination, startDate, endDate }) => {
  stop = false;
  return (dispatch) => {
    if (!destination || !startDate || !endDate) {
      dispatch({
        type: FETCH_OFFICIAL_HOTELS_LIST_FAIL,
        payload: 'Incompleted Information Provided'
      });
    } else {
      dispatch({
        type: FETCH_OFFICIAL_HOTELS_LIST
      });

      const startDateFormat = startDate.format(format);
      const endDateFormat = endDate.format(format);
      const { originalCity, city, state, country } = deconstructDestination(destination);

      let path = '';
      if (country) {
        path = `/preferredguest/search/results/grid.html?localeCode=en_US&city=${city}&stateCode=${state}&countryCode=${country}&searchType=location&hotelName=&currencyCode=USD&arrivalDate=${startDateFormat}&departureDate=${endDateFormat}&numberOfRooms=1&numberOfAdults=1&numberOfChildren=0&iataNumber=`;
      } else {
        path = `/preferredguest/search/results/grid.html?departureDate=${endDateFormat}&searchType=&complexSearchField=${city}&propertyIds=&arrivalDate=${startDateFormat}&localeCode=en_US&numberOfRooms=1&numberOfAdults=1&skinCode=SPG&iATANumber=&numberOfChildren=0&currencyCode=USD`;
      }
      path = encodeURIComponent(path);

      const url = `https://brgfinder.herokuapp.com/spg/${path}?checkin=${startDateFormat}&checkout=${endDateFormat}`;
      axios.get(url)
      .then(response => {
        dispatch({
          type: FETCH_OFFICIAL_HOTELS_LIST_SUCCESS,
          payload: response.data
        });
        Actions.SearchResult({ destination: originalCity, startDate, endDate });
      })
      .catch(error => {
        if (!error.response.data.error) {
          return dispatch({
            type: FETCH_OFFICIAL_HOTELS_LIST_FAIL,
            payload: 'Network Error'
          });
        }
        dispatch({
          type: FETCH_OFFICIAL_HOTELS_LIST_FAIL,
          payload: error.response.data.error
        });
      });
    }
  };
};

const fetchCompeteFail = (dispatch, hotelName, errorMessage) => {
  dispatch({
    type: FETCH_COMPETE_FAIL,
    payload: {
      hotel: hotelName,
      error: errorMessage
    }
  });
};

const fetchUntilComplete = (competeURL, hotelName) => {
  return new Promise((resolve, reject) => {
    axios
    .get(competeURL)
    .then(response => {
      const html = response.data;
      const doc = new DomParser().parseFromString(html, 'text/html');
      const candidates = doc.getElementById('ratesSearchResultsHolder');
      if (html.indexOf('TrafficInspection') >= 0) {
        reject({
          message: 'Traffic Inspection'
        });
      } else if (!candidates) {
        reject({
          message: 'Unknown Error'
        });
      } else if (candidates && candidates.getAttribute('data-isComplete') === 'false') {
        setTimeout(() => {
          resolve(fetchUntilComplete(competeURL, hotelName));
        }, 3000);
      } else if (candidates) {
        resolve({ candidates, doc });
      }
    })
    .catch(() => {
      reject({
        message: 'Mapping Error'
      });
    });
  });
};

export const fetchStop = () => {
  stop = true;
};

export const fetchAllCompeteInformation = ({ hotelsList, duration, country }) => {
  return (dispatch) => {
    axios
    .get('https://www.hotelscombined.com', {
      Host: 'www.hotelscombined.com',
      'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
    })
    .then(() => {
      fetchOneCompeteInformation({ hotelsList, index: 0, country, duration, dispatch });
    })
    .catch(() => {
      hotelsList.forEach(hotel => {
        fetchCompeteFail(dispatch, hotel.hotel_name, 'Network Error');
      });
    });
  };
};

const fetchOneCompeteInformation = ({ hotelsList, index, country, duration, dispatch }) => {
  const hotel = hotelsList[index];
  if (!hotel || stop) {
    return;
  }
  const competeURL = `${hotel.targetURL}&currencyCode=USD`;
  const hotelName = hotel.hotel_name;
  let officialRate = !hotel.BAR ? 9999 : parseInt(hotel.BAR, 10);
  const nextIndex = index + 1;

  if (officialRate !== 9999 && country && vatSPGInclusiveList[country.toLowerCase()]) {
    officialRate /= (1 + vatSPGInclusiveList[country.toLowerCase()]);
    officialRate = officialRate.toFixed(0);
  }

  if (!competeURL) {
    fetchOneCompeteInformation({ hotelsList, index: nextIndex, country, duration, dispatch });
    return fetchCompeteFail(dispatch, hotelName, 'Mapping Error');
  }
  fetchUntilComplete(competeURL, hotelName)
  .then(({ doc }) => {
    const json = {
      competeRate: (officialRate * 0.99),
      competeProvider: 'NOPROVIDER',
      competeURL: 'NOURL'
    };
    const rates = doc.getElementsByClassName('hc_evt_priceMatrixRow');

    for (const rate in rates) {
      const temp = rates[rate];
      if (typeof temp.getAttribute === 'function') {
        const provider = temp.getAttribute('data-providername');
        const tempProvider = provider.toLowerCase();
        let flag = true;
        for (const blackList in BRGBlackList) {
          if (tempProvider.indexOf(BRGBlackList[blackList]) > 0) {
            flag = false;
            break;
          }
        }

        if (flag) {
          const tempURL = temp.getElementsByTagName('a')[0].getAttribute('href');
          let tempPrice = temp.textContent;
          tempPrice = tempPrice.substring(tempPrice.indexOf('$')).replace(/[^0-9]/g, '');
          tempPrice = parseInt(tempPrice, 10) / duration;
          if (tempPrice < json.competeRate) {
            json.competeRate = tempPrice;
            json.competeURL = tempURL;
            json.competeProvider = provider;
          }
        }
      }
    }

    if (json.competeURL === 'NOURL') {
      fetchCompeteFail(dispatch, hotelName, 'No Aviliable BRG');
    } else {
      dispatch({
        type: FETCH_COMPETE_SUCCESS,
        payload: {
          hotel: hotelName,
          result: json
        }
      });
    }

    fetchOneCompeteInformation({ hotelsList, index: nextIndex, country, duration, dispatch });
  })
  .catch((error) => {
    if (error && error.message) {
      fetchCompeteFail(dispatch, hotelName, error.message);
    } else {
      fetchCompeteFail(dispatch, hotelName, 'Mapping Error');
    }

    fetchOneCompeteInformation({ hotelsList, index: nextIndex, country, duration, dispatch });
  });
};

export const resolveCompeteURL = (url, callback) => {
  axios
  .get(url)
  .then(response => {
    const html = response.data;
    const doc = new DomParser().parseFromString(html, 'text/html');
    const urlExist = doc.getElementById('btn_go');
    if (!urlExist) {
      callback(url);
    } else {
      let targetURL = html.substring(html.indexOf('url'));
      targetURL = targetURL.substring(targetURL.indexOf('redirection=') + 'redirection='.length);
      targetURL = targetURL.substring(0, targetURL.indexOf('\''));
      callback(decodeURIComponent(targetURL));
    }
  });
};
