import React, {useReducer, useEffect} from 'react';
import {View, Text, TextInput,  StyleSheet} from 'react-native';
import Device from '../../constants/Device';

const INPUT_CHANGED = 'INPUT_CHANGED';
const FOCUS_LOST = 'FOCUS_LOST';

const inputReducer = (state, action) => {
    switch(action.type){
        case INPUT_CHANGED:
            return {
                ...state,
                value: action.value,
                isValid: action.isValid
            };
        case FOCUS_LOST:
            return {
                ...state,
                touched: true
            }
    }
    return state;
}

const Input = (props) => {
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: props.initialValue ? props.initialValue : '',
        isValid: props.initiallyValid,
        touched: false
    }); 

    const { onInputChanged, id } = props; //destructuring so that on every props change it is not fired

    useEffect(() => {
        if(inputState.touched){
            onInputChanged(inputState.value, inputState.isValid, id);
        }
    }, [inputState]); 

    const textChangedHandler = (text) => {
        const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let isValid = true;
        if (props.required && text.trim().length === 0) {
        isValid = false;
        }
        if (props.email && !emailRegex.test(text.toLowerCase())) {
        isValid = false;
        }
        if (props.min != null && +text < props.min) {
        isValid = false;
        }
        if (props.max != null && +text > props.max) {
        isValid = false;
        }
        if (props.minLength != null && text.length < props.minLength) {
        isValid = false;
        }
        if (props.maxLength != null && text.length > props.maxLength) {
        isValid = false;
        }
        if (props.exactLength != null && text.length != props.exactLength) {
        isValid = false;
        }
        dispatch({type: INPUT_CHANGED, value: text, isValid:isValid})
    };

    const lostFocusHandler = () => {
        dispatch({type: FOCUS_LOST})
    }

    return (
        <View style={styles.formControl}>
            <Text style={styles.label}> {props.label} </Text>
            <TextInput 
                {...props}
                style={styles.input} 
                value={inputState.value} 
                onChangeText={textChangedHandler} 
                onBlur={lostFocusHandler}
                />
            {inputState.touched && !inputState.isValid && (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{props.errorText}</Text>
                </View> 
            )}
        </View>
    )
};

const styles = StyleSheet.create({
    formControl: {
        width: "100%"
    },
    label: {
        fontFamily: 'open-sans-bold',
        fontSize: Math.max(12, parseInt(Device.screenHeight * 0.02)),
        marginVertical: parseInt(Device.screenHeight * 0.01),
    },
    input: {
        paddingHorizontal: parseInt(Device.screenWidth * 0.005),
        paddingVertical: parseInt(Device.screenHeight * 0.008),
        borderBottomColor: 'black',
        borderBottomWidth: 1
    },
    errorContainer: {
        marginVertical: parseInt(Device.screenHeight * 0.008),
    },
    errorText: {
        fontFamily: 'open-sans',
        fontSize: Math.max(10, parseInt(Device.screenHeight * 0.02)),
        color: 'red'
    }
});

export default Input;