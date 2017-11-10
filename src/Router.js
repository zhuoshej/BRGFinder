import React from 'react';
import { Scene, Router } from 'react-native-router-flux';
import SearchForm from './components/SearchForm';
import SearchResultListPage from './components/SearchResultListPage';
import SearchFormInit from './components/SearchFormInit';
import BackGroundImage from './components/BackGroundImage';

const getSceneStyle = () => {
  return styles.sceneStyle;
};

const RouterComponent = () => {
  return (
    <BackGroundImage key="BackGroundImage">
      <Router sceneStyle={{ paddingTop: 65 }}>
        <Scene key="BRGSearchAndList">
          <Scene key="SearchFormInit" component={SearchFormInit} getSceneStyle={getSceneStyle} hideNavBar />
          <Scene key="SearchForm" component={SearchForm} title='Find Your BRG Now!' hideNavBar />
          <Scene key="SearchResult" component={SearchResultListPage} title='Hotels' hideNavBar={false} />
        </Scene>
      </Router>
    </BackGroundImage>
  );
};


const styles = {
  sceneStyle: {
    backgroundColor: 'transparent',
    shadowColor: null,
    shadowOffset: null,
    shadowOpacity: null,
    shadowRadius: null,
  }
};

export default RouterComponent;
