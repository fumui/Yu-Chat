import React from 'react';
import firebase from 'firebase';
import {Text} from 'react-native';
import { View } from 'native-base';
import firebaseConfig from '../Config/firebase';

export default class Home extends React.Component {
  componentDidMount(){
    if(firebase.auth().currentUser)
      this.props.navigation.navigate('Home')
    else
      this.props.navigation.navigate('Login')
  }
  render(){
    return(
      <View>
        <Text>Welcome</Text>
      </View>
    )
  }
}