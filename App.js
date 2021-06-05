import { StatusBar } from 'expo-status-bar';
import React , { useRef, useState, useEffect } from 'react';
import { AppState, StyleSheet, Text, View, TouchableHighlight, SafeAreaView } from 'react-native';
import StateList from './StateList';
import Constants from "expo-constants";

export default function App() {

  const ON_CREATE = "onCreate";
  const ON_START = "onStart";
  const ON_RESUME = "onResume";
  const ON_PAUSE = "onPause";
  const ON_STOP = "onStop";
  const ON_RESTART = "onRestart";
  const ON_DESTROY = "onDestroy";
  const ON_SAVE_INSTANCE_STATE = "onSaveInstanceState";

  const appState = useRef(AppState.currentState);
  
  const [appStateVisible, setAppStateVisible] = useState([]);
  useEffect(() => {
    /*When you app is first launched, it quickly moves through the three states for native android apps. 
    It only comes back here when your app is killed by Android  */
    console.log(`${ON_CREATE}, ${ON_START}, ${ON_RESUME}`)
    AppState.addEventListener('change', _handleAppStateChange);

    return () => {
      AppState.removeEventListener('change', _handleAppStateChange);
    };
  }, []);

  const _handleAppStateChange = (nextAppState) => {

    if (
      appState.current.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
       /** Here is when your app is back to the mainScreen. The user is using your application! */
      setAppStateVisible([...appStateVisible, nextAppState]);
      console.log(`App has become the active foreground app!: ${ON_RESTART}, ${ON_START}, ${ON_RESUME}\n`);
    }
    
    if (
      appState.current.match(/active/) &&
      nextAppState.match(/inactive|background/)
    ){
        /** Here could be where you want to save some data not just to redux but to asyncStorage so that when your app is back to active, you can use them
       * Remember, when your app is in the background, it might be killed by android at anytime which you dont have control over and a good
       * user experience might be to save the data to asycStotarage for the data to persist even after your app is destroyed
       */
      setAppStateVisible([...appStateVisible, nextAppState]);
      console.log(`App has gone to the background and is no longer visible. Your app is been replaced by another app or homeScreen!: ${ON_PAUSE}, ${ON_SAVE_INSTANCE_STATE}, ${ON_STOP}\n`);
    }

    /*
    NOTICE that we never called onDestroy is really not an event you can listen to on React Native
    OnDestroy for Native Android app is called when your app is killed due to low prority.
    Android can destroy your application at anytime.
    Maybe one way you can listen for onDestroy is to write native code in your "android/app/src/main/MainActivity.java" and pass that down here

    When you rotate the device for native android apps, the app gets destroyed and created again but for
    React-Native apps, you dont need to worry about that :) They did a good job at just maintaining the whole 
    state of your application!
    */

    appState.current = nextAppState;
  };

  const resetLifecycleDisplay = () => {
    setAppStateVisible([]);
  }

  return (
    <SafeAreaView style={styles.container}>
      <UdaciStatusBar backgroundColor="#303F9F" barStyle="light-content" />
      <View style={{backgroundColor:"#3F51B5", marginBottom: 10, paddingLeft: 20, height: 50, alignItems:"flex-start", justifyContent:"center"}}>
        <Text style={{color: '#fff', fontWeight:"bold", fontSize:17}}>Lifecycle</Text>
      </View>
      <TouchableHighlight style={styles.btn} 
      onPress={resetLifecycleDisplay}
      underlayColor="#FF4081">
        <Text style={styles.btntext}>Reset Log</Text>
      </TouchableHighlight>
      <StateList appStateVisible={appStateVisible}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'stretch',
    justifyContent: 'center',
  },
  btn: {
    backgroundColor: "#E53224",
    padding:10,
    paddingLeft:10,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  }, 
  btntext: {
    color: '#fff',
  },
});

function UdaciStatusBar ({backgroundColor, ...props}) {
  return (
    <View style={{backgroundColor, height: Constants.statusBarHeight}}>
      <StatusBar translucent={true} backgroundColor={backgroundColor} {...props} />
    </View>
  )
}