import React, {Component, Fragment} from 'react';
import {StyleSheet, View} from 'react-native';

import Animated from 'react-native-reanimated';
import Svg, { Rect, ClipPath, Text, Image} from 'react-native-svg';
import Device from '../../constants/Device';


const { Value } = Animated;
const AnimatedRect = Animated.createAnimatedComponent(Rect);


class SquareTimer extends Component{

    timerDuration = this.props.timerDuration ? this.props.timerDuration : 100;
    // radius = this.props.radius ? this.props.radius : 100;
    // circumference = 2 * Math.PI * this.radius;
    x = this.props.x;
    y = this.props.y;
    width = this.props.width;
    height = this.props.height;
    perimeter = this.props.perimeter;
    
    stroke = this.props.stroke ? this.props.stroke : '#2162cc';
    strokeWidth = this.props.strokeWidth ? this.props.strokeWidth : 10;
    strokeBackground = this.props.strokeBackground ? this.props.strokeBackground : '#989898';

    
    seconds = this.props.seconds ? this.props.seconds : 10;
    remTurnTime = this.props.remTurnTime ? this.props.remTurnTime : 10;

    oneStrokeDist =  this.props.oneStrokeDist

    state = {
        strokeDashoffset: 0,
    }
    timer = null;

    setTimer = () =>{
        if (this.props.activateTimer && this.timer == null){
            this.timer == true;
            //let initialOffest = ((this.seconds - this.remTurnTime) * 1000/this.timerDuration) * this.oneStrokeDist;
            //this.setState({strokeDashoffset: 0});
            let clockSeconds = 0;
            this.timer = setInterval(() => {
                    clockSeconds += this.timerDuration;
                    let newOffest = (clockSeconds/this.timerDuration) * this.oneStrokeDist;
                    //const newTime = this.seconds - Math.floor(clockSeconds/1000);

                    this.setState({strokeDashoffset: newOffest})
                    
                    
                    if (clockSeconds == (this.seconds * 1000)){
                        clearInterval(this.timer);
                        this.setState({strokeDashoffset: -1 * this.perimeter});
                    }
                    //console.log('timerrrrrrrrrrrrrrrrr ......', stroke, '   ', Date.now());
                }, this.timerDuration);
        }else if (!this.props.activateTimer && this.timer != null){
            //console.log('clearing timer after component deactivation........', this.stroke, '\n\n\n');
            if (this.timer != null){
                clearInterval(this.timer);
                this.timer = null;
                this.setState({strokeDashoffset: -1 * this.perimeter});
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
        //console.log('####################  ', this.props.activateTimer, this.props);
        return (
            
                <Svg style={styles.svg} >
                        <Fragment>
                            <Rect
                                stroke={this.strokeBackground}
                                strokeWidth={this.strokeWidth}
                                fill={"none"}
                                x={this.x}
                                y={this.y}
                                width={this.width}
                                height={this.height}
                            />

                            
                            <AnimatedRect
                                stroke={this.stroke}
                                strokeWidth={this.strokeWidth}
                                fill={"none"}
                                x={this.x}
                                y={this.y}
                                width={this.width}
                                height={this.height}
                                strokeDasharray={`${this.perimeter} ${this.perimeter}`}
                                strokeDashoffset={-1 * this.state.strokeDashoffset}
                                />
                        </Fragment>
                   
                   
                </Svg>
            
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


export default SquareTimer;