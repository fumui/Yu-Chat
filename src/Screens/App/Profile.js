import React from 'react'
import { Text } from 'react-native';
import firebase from 'firebase';
import firebaseConfig from '../../Config/firebase';
import { Button } from 'native-base';

export default class ChatRoom extends React.Component{
  
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
    return <Button onPress={this.handleLogout}><Text>Sign Out</Text></Button>
  }
}