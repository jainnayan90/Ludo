import React from 'react';
import { Animated} from 'react-native';
import {Image} from 'react-native-svg';
import { Easing } from 'react-native-reanimated';



const AnimatedImage = Animated.createAnimatedComponent(Image);
class DiceIm extends React.Component {
  state = {
    animation: new Animated.Value(0),
    
  }
  showDiceFace = true;

  animate = () => {
    Animated.timing(this.state.animation,
        {
            toValue: 1,
            duration: 500,
            Easing:Easing.circle
        }
    ).start(() => {
        if (this.props.diceRolled){
            this.animate();
        }else{
            this.setState({animation:new Animated.Value(0)});
        }
    })
  }

  componentDidMount(){
      this.animate()
  }

  componentDidUpdate(){
      if (this.props.diceRolled){
        this.animate();
      }
  }

  render() {
    const animationStyles = {
      transform: [
        // {translateX: this.props.x},
        {translateY:this.props.y },
        {
          rotateX: this.state.animation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg']
          })
        },
        
      ],
      
    };
    // const AnimCube = Animated.createAnimatedComponent(Rect);
    return (
            <AnimatedImage
                // originX={this.props.originX}
                originY={this.props.originY}
                x={this.props.x}
                // y={this.props.y}
                href={this.props.href}
                width={this.props.width}
                height={this.props.height}
                style={animationStyles}
                onPressIn = {this.props.onClick}
            />
            
            // <AnimCube
            //     onPress={() => this.setState({animation:new Animated.Value(0)})}
            //     x={this.props.x}
            //     // y={this.props.y}
            //     width={this.props.width}
            //     height={this.props.height}
            //     fill="green"
            //     style={animationStyles}
            // />
            
    );
  }
}

const styles = {
svg: {
    width: '100%',
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems:'center'
},
  object: {
    backgroundColor: 'orange',
    width: 100,
    height: 100
  },
  text: {
    fontSize: 20,
    fontWeight: '500',
    color: 'white',
    padding: 5
  }
}

export default DiceIm ;