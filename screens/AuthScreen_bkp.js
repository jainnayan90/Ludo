import React, {useReducer, useCallback, useState, useEffect} from 'react';
import {
    StyleSheet, 
    ScrollView,
    View,
    KeyboardAvoidingView,
    Button,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
    ImageBackground,
    Text
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import Input from '../components/UI/Input'; 
import Colors from '../constants/Colors';
import * as authActions from '../store/actions/auth';
import Device from '../constants/Device';
//import CustomAlert from '../components/UI/CustomAlert';


const backgroundIMG = require('../assets/images/background.jpeg');
const authContainerIMG = require('../assets/images/back_box_vertical.png');




const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const formReducer = (state, action) => {
    switch(action.type){
        case FORM_INPUT_UPDATE:
            const updatedValues = {
                ...state.inputValues,
                [action.inputId]: action.value
            };
            const updatedValidities = {
                ...state.inputValidities,
                [action.inputId]: action.isValid
            }; 
            let updatedFormIsValid = true;
            for (const key in updatedValidities){
                if(updatedValidities[key] === false){
                    updatedFormIsValid = false;
                    break;
                }
            }
            return {
                ...state,
                inputValues: updatedValues,
                inputValidities: updatedValidities , 
                formIsValid: updatedFormIsValid
            };
            
    }
    return state;

};

const AuthScreen = (props) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(false);
    const isAuth = useSelector(state => state.auth.authToken);
    const [formState, dispatchFormState]= useReducer(formReducer, {
        inputValues: {
            mobile: '',
            password: ''
        }, 
        inputValidities: {
            mobile: false,
            password: false

        }, 
        formIsValid: false
    });

    const loginHandler = async () => {
        setError(null);
        setIsLoading(true);
        try{
            await dispatch(authActions.login(formState.inputValues.mobile, formState.inputValues.password));
            props.navigation.navigate('MainScreen');
        }catch(err){
            setError(err.message);
            setIsLoading(false);
        };
        
    }

    const inputChangedHandler = useCallback((value, isValid, inputId) => {
        dispatchFormState({type: FORM_INPUT_UPDATE, value: value, isValid: isValid, inputId: inputId})
    }, [dispatchFormState])

    // useEffect(() => {
    //     if (error){

    //         Alert.alert('Some error occured!', error, [
    //             {text:'Okay', style:'default'}
    //         ]);
    //     }
    // }, [error] );

    useEffect(() => {
        if (isAuth){
            props.navigation.navigate('MainScreen');
        }
    }, [dispatch] );


    return (
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
            
            <View style={styles.screen}>
                <View style = {styles.backgroundContainer}>
                    <ImageBackground 
                        source = {backgroundIMG} 
                        resizeMode = 'cover' 
                        style = {styles.backdrop} />
                </View>
                <View style = {styles.overlay}>
                    <View style={styles.authContainer}>
                        <Text style={styles.title}>
                            {Device.gameTitle}
                        </Text>
                        <ImageBackground
                            source = {authContainerIMG}
                            style={styles.backIMG}
                            resizeMode='contain'
                        >
                            {/* {!!error && <CustomAlert 
                                alertTitle='Some error occured!'
                                alertMessage={error}
                                okayText="OK"
                                cancelText="Cancel"
                                okayButton={true}
                                cancelButton={false}
                                okayFunction={() => {setError(null)}}
                            />} */}
                            
                            <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={50} style={styles.screen}>
                                <View style={styles.inputContainer}>
                                    <ScrollView>
                                        <Input 
                                            id='mobile' 
                                            label='Mobile' 
                                            keyboardType='number-pad' 
                                            required 
                                            exactLength={10}
                                            autoCapitalize='none'
                                            errorText='Please enter a valid mobile number.' 
                                            onInputChanged ={inputChangedHandler}
                                            initialValue=''
                                            />
                                        <Input 
                                            id='password' 
                                            label='Password' 
                                            keyboardType='default' 
                                            secureTextEntry
                                            required 
                                            minLength={5} 
                                            autoCapitalize='none'
                                            errorText='Please enter a valid password.  ' 
                                            onInputChanged={inputChangedHandler}
                                            initialValue=''
                                            />
                                        <View style={styles.buttonContainer}>
                                            {isLoading ? 
                                                (<ActivityIndicator size='large' color={Colors.primary} />
                                                ) : (
                                                <Button  
                                                    title='Log In' 
                                                    color={Colors.primary} 
                                                    onPress={loginHandler} />
                                            )}
                                        </View>
                                    </ScrollView>
                                </View>
                            </KeyboardAvoidingView>
                            
                        </ImageBackground>
                    </View>
                </View>
            </View>
        
        </TouchableWithoutFeedback>
    );

};

// AuthScreen.navigationOptions = (navData) => {
//     return {
//         header: () => null,
//     }
// };


const styles = StyleSheet.create({
    screen: {
        flex:1,
        width: Device.screenWidth,
        height:Device.screenHeight,
        justifyContent:'center',
        alignItems:'center'
    },
    keyAvoid:{
        flex:1,
        width: Device.screenWidth,
        height:Device.screenHeight,
        justifyContent:'center',
        alignItems:'center'
    },
    backdrop: {
        flex:1,
        flexDirection: 'column'
    },
    backgroundContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
      },
    overlay: {
        justifyContent:'center', 
        alignItems:'center', 
        width: '100%',
        height:'100%',
    },
    authContainer: {
        width: '100%',
        //maxWidth: 400,
        height: '80%',
        //maxHeight: 400,
        //height: '60%',
        justifyContent: 'center',
        alignItems: 'center'
         
    },
    backIMG: {
        width: '100%',
        height: '100%',
        flexDirection:'column',
        justifyContent:'center',
        alignItems:'center'
    },
    title: {
        fontFamily: 'comicate',
        fontSize: 30
    },
    inputContainer: {
        width: (Device.screenWidth > 380) ? '65%' : '55%',
        padding:5,//Device.screenHeight * 0.005,
    },
    buttonContainer: {
        marginTop: 10
    }
});

export default AuthScreen;