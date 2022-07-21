import React, { Component } from 'react';
import { View, Image } from 'react-native';
import {
  ForeignObject,
} from 'react-native-svg';

class MyImage extends Component {
  render() {
    return (
            <ForeignObject x={this.props.x} y={this.props.y} width={this.props.width} height={this.props.height}>
              <View style={{ width: this.props.width, height: this.props.height }}>
                <Image
                  style={{ width: this.props.width, height: this.props.height, 
                      borderRadius: this.props.borderRadius, borderWidth:2}}
                  source={this.props.image}
                  resizeMode='contain'
                />
              </View>
            </ForeignObject>
    );
  }
}

export default MyImage;