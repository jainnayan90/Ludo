import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, AsyncStorage, Text } from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
//import * as xmppActions from '../store/actions/xmpp';
import * as authActions from '../store/actions/auth';
import * as gameActions from '../store/actions/gameactions';
import Colors from '../constants/Colors';
import * as nameSpaces from '../constants/NameSpaces';
import Device from '../constants/Device';

let userData = null;

class MyXmpp{
    userId = null;
    authToken = null;
    XMPP = require('@xmpp/client');
    xmppClientListeners = [];
    xmppClientNotifiers = [];
    domain = 'ludo.havrock.com';
    resource = 'ludo';
    XMPPServerOptions = {uri: 'ws://35.154.231.118:5280/ws',//'ws://192.168.2.58:5280/ws',
                           domain: this.domain};
    xmppClient = null;
    dispatch = null;
    props=null;
    // resultStanzaQueue = [];
    // receivedStanzaQueue = [];
    // xmpp:{
    //     waitingResponse: false,
    //     namespace:null,
    //     id:null,
    //     resultType:null,
    //     errorMsg: null
    // },
    sentStanzas = {}

    fullJID = () => {
        return `${this.userId}@${this.domain}/${this.resource}`;
    };

    get_random_id = (NS) => {
        const id = parseInt(Math.random() * 1000000000000000); 
        return `${this.fullJID()}:${NS}:${id}` 
    }

    createXmppClient = (userId, authToken, dispatch, props) => {
        this.userId = userId;
        this.authToken = authToken;
        this.dispatch = dispatch;
        this.props = props;
        this.xmppClient = this.XMPP.client({
            service: this.XMPPServerOptions.uri,
            domain: this.domain,
            resource: this.resource,
            username: this.userId,//this.fullJID(),
            password: this.authToken
        });

        //debug(this.xmppClient, true);
    };


    connect = () => {
        this.xmppClient.start();
        this.xmppClient.timeout = 5000;
        
    };

    
    
    removeListener = (name, callback) => {
        this.xmppClient.removeListener(name, callback)
    }

    removeAllListeners = () => {
        this.xmppClientListeners.forEach(function(listener){
          this.xmppClient.removeListener(listener.name);
        });
        this.xmppClientListeners = [];
    }

    addListener = (event, callbackFn) => {
        this.xmppClient.removeListener(event, callbackFn);
        this.xmppClient.on(event, callbackFn);
        this.xmppClientListeners.push({name: event, callback: callbackFn});
    };

    sendStanza = (stanza) =>{
        //console.log("in send stanza............");
        this.xmppClient.send(stanza);
        this.sentStanzas[stanza.attrs.id] = setTimeout(() => {
            Object.keys(this.sentStanzas).forEach((key) => {
                clearTimeout(this.sentStanzas[key]);
            })
            this.dispatch({type: 'RESET_MAIN_SCREEN'});
            this.dispatch({type:gameActions.RESET_GAME_SCREEN});
            this.props.navigation.navigate('MainScreen');
        }, 15000)
        
    };

    log(text){
        //console.log(text);
    };
    disconnect(){
        //console.log('in removing listeners......', )
        //this.removeAllListeners();
        try{
            this.xmppClient.stop();
        }catch(err){

        }
        // this.xmppClient.disconnect()
        //this.removeAllListeners();

        
    }

};
export let XMPP = new MyXmpp();

export const StartupScreen = (props) => {
    // XMPP = new MyXmpp();
    // console.log("in startup screen ..............")
    const dispatch = useDispatch();


    // useEffect(() =>  {
    //     dispatch({'type': 'RESET_STARTUP_SCREEN'})
    // },[dispatch])

    const xml = require('@xmpp/xml');
    const playerInfoReceived = useSelector(state => state.startup.playerInfoReceived);
    const fetchedActiveGame = useSelector(state => state.startup.fetchedActiveGame);
    const activeGameId = useSelector(state => state.startup.activeGameId);
    const gameInfoReceived = useSelector(state => state.gameInfo.gameInfoReceived);

    const [reconnectionCount, setReconnectionCount] = useState(0);
    
    

    const callbackConnect = () => {
        console.log('Connected fjdsfhhjdsfdsh');

    };
    
    const callbackOnline = (jid) => {

        //console.log('ONLINE', nameSpaces.NS_ACTIVEGAME);
        const id = XMPP.get_random_id(nameSpaces.NS_ACTIVEGAME);
        const packet = xml(
            "iq",
            {id: id, to: nameSpaces.GAMESERVER, type: "get"},
            xml("query", {xmlns: nameSpaces.NS_ACTIVEGAME})
        )
        //console.log(packet);
        XMPP.sendStanza(packet);
        //props.navigation.navigate('MainScreen');
    };

    const callbackStatus = (status, value) => {
        // self.log('status: ' + status);
    };

    // this.xmppClientReconnect.on('reconnecting', function() {
    //     Utils.DLog('[Chat]', 'RECONNECTING');
    // });
    //
    // this.xmppClientReconnect.on('reconnected', function() {
    //     Utils.DLog('[Chat]', 'RECONNECTED');
    // });

    const callbackStanza = async (stanza) => {
        // console.log('stanza', stanza.toString())
        // after 'input' and 'element' (only if stanza, not nonza)
        
        // console.log('ERROR: stanza stanza ############# ', stanza, Device.platform);
        if(stanza.attrs && stanza.attrs.type == "error" && stanza.children[0] && 
            stanza.children[0].name == "error_connection_replaced"){
            
            XMPP.disconnect();
            await dispatch(authActions.forceLogout());
            // dispatch({type:'RESET_MAIN_SCREEN'});
            XMPP.userId=null;
            XMPP.authToken=null;
            //console.log('ERROR: stanza stanza ############# ', XMPP.userId, XMPP.authToken, Device.platform);
            props.navigation.navigate('Startup');
            
        }else{
            if (stanza.is('presence')) {
                console.log("On PRESENCE: " + stanza);
            } else if (stanza.is('iq')) {
                const stanzaStr = stanza.toString();
                
                const parseString = require('react-native-xml2js').parseString;

                parseString(stanzaStr, (err, result) => {
                    //console.log(result);
                    if (err){
                        console.log("error in parsing packet :", stanzaStr);
                    }else {
                        const stanzaNS = result.iq.query && result.iq.query[0]["$"]["xmlns"];
                        if (stanzaNS){
                            if(result.iq["$"]["type"] == "result" || result.iq["$"]["type"] == "error"){
                                if(XMPP.sentStanzas[result.iq["$"]["id"]]){
                                    // console.log("logging clear timeout key............ ", result.iq["$"]["id"], XMPP.sentStanzas[result.iq["$"]["id"]]);
                                    clearTimeout(XMPP.sentStanzas[result.iq["$"]["id"]]);
                                }
                            }
                            
                            // if(result.iq["$"]["type"] !== "result"){
                                dispatch({type: stanzaNS, stanza: result});
                            // }
                            
                        }
                    }
                });

            } else if(stanza.is('message')) {
                //console.log("On MESSAGE: " + stanza);
            }
        }
    };

    const callbackConnectError = (err) => {
        //console.log('ERROR: error stanza ############# ', err);
    };

    const callbackDisconnected = (err) => {
        XMPP.disconnect();
        //console.log('\n\n\n\n\n in callback disconnected...............', err);
    };
    


    const callbackError = async (err) => {
        Object.keys(err).map((key) => console.log('@@@', err[key]));
        if (err.condition == "not-authorized" || err.condition == "policy-violation"){
            //console.log('@@@@@@@@@@@@@@@@@@@@@@@');
            await dispatch(authActions.logout());
            props.navigation.navigate("Auth");
        }else if(err.code == "ECONNERROR"){
        
            dispatch({'type': 'RESET_STARTUP_SCREEN'});
            dispatch({type:gameActions.RESET_GAME_SCREEN});
            //XMPP.disconnect();
            // XMPP = null;
            props.navigation.navigate('ConnectionScreen');
            // XMPP.xmppClient.reconnect();
            // XMPP = new MyXmpp();
            // setTimeout(() => {
            
            // }, 3000);
        }
        
        
        
    };

    
    // const callbackReplaced = (err) => {
    //     console.log('\n\n\n\n\n in callback replaced...............', err);
    // }

    


    // this.xmppClient.on('element', function(element) {
    //     // console.log('element', element.toString())
    //     // after 'input'
    // });

    // this.xmppClient.on('send', function(element) {
    //     // console.log('send', element.toString())
    //     // after write to socket
    // });

    // this.xmppClient.on('outgoing', function(element) {
    //     // before send
    //     // console.log('outgoing', element.toString())
    // });

    // const callbackOutput = (str) => {
    //     // self.log('SENT:', str);
    // };
    // this.xmppClient.on('output', callbackOutput);
    // this.xmppClientListeners.push({name: 'output', callback: callbackOutput});

    // const callbackInput = function(str) {
    //     // self.log('RECV:', str);
    // };
    // this.xmppClient.on('input', callbackInput);
    // this.xmppClientListeners.push({name: 'input', callback: callbackInput});

    // const callbackAuthenticate = (authenticate) => {
    //   this.log('AUTHENTICATING');

    //   return authenticate(this.userId, this.authToken)
    // };
    // this.xmppClient.handle('authenticate', callbackAuthenticate);
    // this.xmppClientListeners.push({name: 'authenticate', callback: callbackAuthenticate});
  // };

    

    useEffect(() => {
        const tryLogin = async () => {
            //AsyncStorage.removeItem('authData');
            userData = await AsyncStorage.getItem('authData');
            // console.log('printing auth data in startup screen ....   ', userData, Device.platform);
            if(!userData){
            //if(userData){
                props.navigation.navigate('Auth');
                return;
            }else{
                //console.log('in xmpp connect...........');
                const transformedData = JSON.parse(userData);
                dispatch(authActions.authenticate(
                    transformedData.userId, 
                    transformedData.authToken, 
                    transformedData.avatar,
                    transformedData.userType
                ));

                //XMPP.removeAllListeners();
                XMPP.createXmppClient(transformedData.userId, transformedData.authToken, dispatch, props);
                XMPP.addListener('connect', callbackConnect);
                XMPP.addListener('online', callbackOnline);
                XMPP.addListener('status', callbackStatus);
                XMPP.addListener('stanza', callbackStanza);
                XMPP.addListener('disconnect', callbackDisconnected);
                // XMPP.addListener('loginError', () => {console.log('!!!!!!!!!!!!!!!!!!!!!!!!!!')});
                
                //XMPP.Socket.addEventListener('close', callbackClose);
                
                //XMPP.addListener('replaced', callbackReplaced);
                XMPP.connect('error', callbackConnectError);
                XMPP.addListener('error', callbackError);
                
            }

        };
        tryLogin();
    }, [dispatch]);

    useEffect(() => {
        if (fetchedActiveGame === true && playerInfoReceived === true){
            if (activeGameId == "null") {
                props.navigation.navigate('MainScreen');
            }else{
                dispatch({type: nameSpaces.NS_JOIN_ACTIVE_GAME, iq_type: "get"});
                const id = XMPP.get_random_id(nameSpaces.NS_JOIN_ACTIVE_GAME);
                const packet = xml(
                "iq",
                {id: id, to: activeGameId, type: "get"},
                xml("query", {xmlns: nameSpaces.NS_JOIN_ACTIVE_GAME}))
                XMPP.sendStanza(packet); 
            }
        }
    }, [fetchedActiveGame, playerInfoReceived]);

    useEffect(() => {
        if(gameInfoReceived){
            props.navigation.navigate('GameScreen');
        }
        //props.navigation.navigate('WinnerScreen');
    }, [gameInfoReceived])

    return (
        <View style={styles.screen }>
            <ActivityIndicator size='large' color={Colors.primary} />
            <Text>Connecting...</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#39b4ce'
    }
});
