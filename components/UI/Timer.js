import React, {Component, Fragment} from 'react';
import {StyleSheet, View} from 'react-native';

import Animated from 'react-native-reanimated';
import Svg, { Circle, ClipPath, Text, Image} from 'react-native-svg';
import Device from '../../constants/Device';


const { Value } = Animated;
const AnimatedCircle = Animated.createAnimatedComponent(Circle);


class CircularTimer extends Component{

    timerDuration = this.props.timerDuration ? this.props.timerDuration : 100;
    radius = this.props.radius ? this.props.radius : 100;
    circumference = 2 * Math.PI * this.radius;

    stroke = this.props.borderColor ? this.props.borderColor : '#2162cc';
    strokeWidth = this.props.borderWidth ? this.props.borderWidth : 10;
    strokeBackground = this.props.strokeBackground ? this.props.strokeBackground : 'grey';

    fill = this.props.circleColor ? this.props.circleColor : '#FFFFFF';
    seconds = this.props.seconds ? (this.props.seconds > 1 ? this.props.seconds : 10) : 10;
    secondsSize = this.props.secondsSize ? this.props.secondsSize  : 30;

    circleImage = this.props.circleImage ? this.props.circleImage : false;

    totalStrokes = (this.seconds * 1000) / this.timerDuration;
    oneStrokeDist =  (2 * Math.PI * this.radius) / this.totalStrokes;

    state = {
        strokeDashoffset: this.oneStrokeDist * this.totalStrokes,
        remTime: this.seconds
    }


    

    timer = null;

    setTimer = () =>{
        if (this.props.activateTimer && this.timer == null){
            this.timer == true;
            //console.log('in component didi update addind timer ........', this.props.activateTimer, this.stroke, '   ', this.timer);
            let clockSeconds = 0;
            this.setState({strokeDashoffset: 0});
            this.timer = setInterval(() => {
                    clockSeconds += this.timerDuration;
                    let newOffest = (clockSeconds/this.timerDuration) * this.oneStrokeDist;
                    const newTime = this.seconds - Math.floor(clockSeconds/1000);

                    this.setState({strokeDashoffset: newOffest, remTime: newTime})
                    
                    
                    if (clockSeconds == (this.seconds * 1000)){
                        clearInterval(this.timer);
                        this.setState({strokeDashoffset: 2 * Math.PI * this.radius});
                    }
                    //console.log('timerrrrrrrrrrrrrrrrr ......', stroke, '   ', Date.now());
                }, this.timerDuration);
        }else if (!this.props.activateTimer && this.timer != null){
            //console.log('clearing timer after component deactivation........', this.stroke, '\n\n\n');
            if (this.timer != null){
                clearInterval(this.timer);
                this.timer = null;
                this.setState({strokeDashoffset: 2 * Math.PI * this.radius});
            }
        }
    }

    componentDidMount = ()=>{
            this.setTimer();
    }


    componentDidUpdate = () =>{
            this.setTimer();
    }

    render (){
        return (
            <View style={styles.screen}>
                <Svg style={styles.svg} >
                    
                    
                    {!this.circleImage ?
                        <Fragment>
                            <Circle
                                stroke={this.strokeBackground}
                                strokeWidth={this.strokeWidth}
                                fill={"none"}
                                cx={'50%'}
                                cy={'50%'}
                                r={this.radius}
                            />

                            
                            <AnimatedCircle
                                stroke={this.stroke}
                                strokeWidth={this.strokeWidth}
                                fill={this.fill}
                                cx={'50%'}
                                cy={'50%'}
                                r={this.radius}
                                strokeDasharray={`${this.circumference} ${this.circumference}`}
                                strokeDashoffset={-1 * this.state.strokeDashoffset}
                                />
                            <Text
                                x={"50%"}
                                y={"50%"}
                                textAnchor="middle"
                                fontWeight="bold"
                                fontSize={this.secondsSize}
                                fill="black"
                            >
                                {this.state.remTime}
                            </Text> 
                        </Fragment>
                    :
                        <Fragment>
                            <Circle
                                stroke={this.strokeBackground}
                                strokeWidth={this.strokeWidth}
                                fill={"none"}
                                cx={'50%'}
                                cy={'50%'}
                                r={this.radius}
                            />
                            <AnimatedCircle
                                stroke={this.stroke}
                                strokeWidth={this.strokeWidth}
                                fill={'transparent'}
                                //fill={"none"}
                                cx={'50%'}
                                cy={'50%'}
                                r={this.radius}
                                strokeDasharray={`${this.circumference} ${this.circumference}`}
                                strokeDashoffset={-1 * this.state.strokeDashoffset}
                            />
                            
                        
                            <ClipPath id="clip">
                                <Circle 
                                    cx={'50%'}
                                    cy={'50%'}
                                    r={this.radius - this.strokeWidth/2}
                                />

                            
                            </ClipPath>
                            
                            <Image
                                width="100%"
                                height="100%"
                                    href={this.circleImage ? this.circleImage : ''}
                                    preserveAspectRatio="xMidYMid meet"  x="0"   y="0"
                                    
                                    clipPath="url(#clip)"
                            />
                        </Fragment>
                        }   
                </Svg>
            </View>
        )
    }


};


const styles = StyleSheet.create({
    screen: {
        flex:1,
        width: Device.screenWidth,
        height: Device.screenHeight,
        justifyContent: 'center',
        alignItems:'center'
        
    },
    svg: {
        width: '100%',
        height: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems:'center'
    },
    timer: {
        width: '100%',
        height: '100%'
    }
});


export default CircularTimer;