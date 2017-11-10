import React, { Component } from 'react';
import { Image } from 'react-native';

export default class BackGroundImage extends Component {
  static propTypes = {
    children: React.PropTypes.element,
    route: React.PropTypes.object,
  };

  renderChildren = () => {
    return React.Children.map(this.props.children, c => {
      return React.cloneElement(c, { route: this.props.route });
    });
  };

  render() {
    return (
      <Image
        source={require('../../images/backgroundcandidate2.jpg')}
        style={styles.fullBackgroundImage}
        resizeMode="cover"
      >
        {this.props.children}
      </Image>
    );
  }
}

const styles = {
  fullBackgroundImage: {
    flex: 1,
    width: null,
    height: null,
  },
};
