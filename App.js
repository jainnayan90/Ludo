import React, {useState} from 'react';
import {createStore, combineReducers, applyMiddleware, compose} from 'redux';
import authReducer from './store/reducers/auth';
import mainScreenReducer from './store/reducers/namespaces/mainscreenReducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import {AppLoading} from 'expo';
import * as Font from 'expo-font';
import {Provider} from 'react-redux';
import ReduxThunk from 'redux-thunk';
import GameNavigator from './navigation/GameNavigator';
import startupReducer from './store/reducers/namespaces/startupReducer';
import gameReducer from './store/reducers/namespaces/gameReducer';


const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const rootReducer = combineReducers({
  auth: authReducer,
  startup: startupReducer,
  mainscreen: mainScreenReducer,
  gameInfo: gameReducer
});

const store = createStore(rootReducer, composeEnhancer(applyMiddleware(ReduxThunk)));
//const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const fetchFonts = () => {
  return Font.loadAsync({
    'open-sans': require('./assets/fonts/OpenSans-Regular.ttf'),
    'open-sans-bold': require('./assets/fonts/OpenSans-Bold.ttf'),
    'comicate': require('./assets/fonts/COMICATE.ttf')
  });
};

export default function App() {
  const [fontLoaded, setFontLoaded] = useState(false);
  if (!fontLoaded) {
    return <AppLoading startAsync={fetchFonts} onFinish={() => {
      setFontLoaded(true); 
    }} />
  }

  return (
    <Provider store={store}>
        <GameNavigator />
    </Provider>
  );
}