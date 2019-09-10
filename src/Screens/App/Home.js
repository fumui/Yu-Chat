import React from 'react';
import {Text, StyleSheet} from 'react-native';
import { Button, View } from 'native-base';
import firebase from 'firebase';
import firebaseConfig from '../../Config/firebase';
import MapView, {PROVIDER_GOOGLE} from 'react-native-maps';

export default class Home extends React.Component {
  

  render(){
    return(
      <View>
        <View style={{
          ...StyleSheet.absoluteFillObject,
          height:700,
          width:400,
          justifyContent: 'flex-end',
          alignItems: 'center',}}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{...StyleSheet.absoluteFillObject,}}
            initialRegion={{
              latitude: 37.78825,
              longitude: -122.4324,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
          />
        </View>
      </View>
    )
  }
}