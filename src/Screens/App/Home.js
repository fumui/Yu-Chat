import React from 'react';
import {Text, StyleSheet,Image, PermissionsAndroid, Dimensions} from 'react-native';
import { Button, View  } from 'native-base';
import MapView, {PROVIDER_GOOGLE, Circle, Marker} from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import firebase from 'firebase';
import firebaseConfig from '../../Config/firebase';

export default class Home extends React.Component {
  constructor(){
    super()
    this.state = {
      users:[],
      region : {
        latitude: -7.78825,
        longitude: 110.4324,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      },
      dims:Dimensions.get('window'),
      currentUser: firebase.auth().currentUser
    }
  }
  unsubscribeFriendLocation = firebase
    .firestore()
    .collection('Users')
    .onSnapshot((snapshot) => {
    let users = []
    snapshot.forEach(doc => {
      users.push( doc.data() )
    })
    this.setState({users})
  })
  componentWillUnmount() {
    this.unsubscribeFriendLocation()
    Geolocation.stopObserving();
  }
  componentDidMount = async () => {
    let hasLocationPermission = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION)
    if(!hasLocationPermission){
      hasLocationPermission = await this.requestLocationPermission()
    }
    if(hasLocationPermission){
      Geolocation.watchPosition(
        (position) => {
          let LatLng = {
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
          }
          firebase.firestore()
            .collection('Users')
            .doc(this.state.currentUser.uid)
            .update({LatLng})
        },
        (error) => {
            console.warn(error.code, error.message);
        },
        { showLocationDialog: true ,enableHighAccuracy: true,distanceFilter:1, fastestInterval:5000, timeout: 15000, maximumAge: 10000 }
      );
    }
  }

  requestLocationPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Yu Chat Location Permission',
          message:
            `Yu Chat needs permission to get your location
            so you can enjoy this app to its fullest`,
          buttonNeutral: 'Ask Me Later',
          buttonNegative: 'Cancel',
          buttonPositive: 'OK',
        },
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED
    } catch (err) {
      console.warn(err);
      return false
    }
  }

  render(){
    return(
      <View>
        <View style={{
          height:'100%',
          width:'100%',
          justifyContent: 'flex-end',
          alignItems: 'flex-end',}}>
          <MapView
            provider={PROVIDER_GOOGLE}
            style={{
              height:'100%',
              width:'100%'
            }}
            initialRegion={this.state.region}
            showsUserLocation={true}
            followsUserLocation={true}
          >
            {this.state.users.map(user => {
              if(user.LatLng.latitude !== null){
                return (
                  <Marker 
                    key={''+user.LatLng.latitude+user.LatLng.longitude }
                    title={user.username}
                    description={user.fullname}
                    coordinate={user.LatLng}
                    onCalloutPress={()=>{this.props.navigation.navigate('Chat', {targetUID:user.uid})}}
                  >
                    <View>
                      <Image source={{uri:user.photoURL}} style={{width:40,height:40, borderRadius:40}} />
                    </View>
                  </Marker>
                )
              }else {
                return <View/>
              }
            })}
          </MapView>
        </View>
      </View>
    )
  }
}