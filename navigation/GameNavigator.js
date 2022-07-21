import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
//import {createDrawerNavigator, DrawerNavigatorItems} from 'react-navigation-drawer';
import AuthScreen from '../screens/AuthScreen';
import {StartupScreen} from '../screens/StartupScreen';
import MainScreen from '../screens/MainScreen';
import GameScreen from '../screens/GameScreen';
import WinnerScreen from '../screens/WinnerScreen';
import ConnectionScreen from '../screens/ConnectionScreen';


// createSwitchNavigator shows exactly one screen at a time. going back is not allowed

const MainScreenRouteConfigs = {
    MainScreen: {
        screen: MainScreen,
        navigationOptions: {
            header: null,
        }
    },    
};


const defaultNavigationOptions = {

};


const MainScreenNavigator = createStackNavigator(
    MainScreenRouteConfigs, 
    {
        defaultNavigationOptions: defaultNavigationOptions,
    });

const GameScreenRouteConfigs = {
    GameScreen:{
        screen: GameScreen,
        navigationOptions: {
            header: null,
        }
    }    
};

const GameScreenNavigator = createStackNavigator(
    GameScreenRouteConfigs, 
    {
        defaultNavigationOptions: defaultNavigationOptions,
    });


const WinnerScreenRouteConfigs = {
    WinnerScreen:{
        screen: WinnerScreen,
        navigationOptions: {
            header: null,
        }
    }    
};

const WinnerScreenNavigator = createStackNavigator(
    WinnerScreenRouteConfigs, 
    {
        defaultNavigationOptions: defaultNavigationOptions,
    });
    

    


const AuthRouteConfigs = {
    Auth: {
        screen: AuthScreen,
        navigationOptions: {
            header: null,
        }
    }

};
const AuthNavigator = createStackNavigator(
        AuthRouteConfigs,
        {
           
        }
    );



const ConnectionRouteConfigs = {
    ConnectionScreen: {
        screen: ConnectionScreen,
        navigationOptions: {
            header: null,
        }
    }

};
const ConnectionNavigator = createStackNavigator(
        ConnectionRouteConfigs,
        {
            
        }
    );
       

const MainNavigator = createSwitchNavigator({
    Startup: StartupScreen,
    ConnectionScreen:ConnectionNavigator,
    Auth: AuthNavigator,
    MainScreen: MainScreenNavigator,
    GameScreen: GameScreenNavigator,
    WinnerScreen: WinnerScreenNavigator
},
{unmountInactiveRoutes: true}); 

export default createAppContainer(MainNavigator);
