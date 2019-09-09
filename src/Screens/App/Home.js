import React from 'react';
import {Text} from 'react-native';
import { Button, View } from 'native-base';
import firebase from 'firebase';
import firebaseConfig from '../../Config/firebase';

export default class Home extends React.Component {
  handleLogout = () => {
    firebase.auth().signOut()
      .then(()=>{
        this.props.navigation.navigate('Login')
      })
      .catch(err =>{
        console.error(err)
      })
  }

  render(){
    return(
      <View>
        <Text>Home</Text>
        <Button onPress={this.handleLogout}><Text>Logout</Text></Button>
      </View>
    )
  }
}