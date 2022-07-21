import React, {useReducer, useCallback, useState, useEffect} from 'react';
import {
    StyleSheet, 
    View,
    ActivityIndicator,
    Text,
    Net
} from 'react-native';
import Colors from '../constants/Colors';

const ConnectionScreen = (props) => {
    // const [makeConnection, setmakeConnection] = useState(false);

    useState(() => {
        setTimeout(() => {
            props.navigation.navigate('Startup');
        }, 3000)
    }, [])

    return(
        <View style={styles.screen }>
            <ActivityIndicator size='large' color={Colors.primary} />
            <Text>Connecting...</Text>
        </View>
    )
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#39b4ce'
    }
});

export default ConnectionScreen;

