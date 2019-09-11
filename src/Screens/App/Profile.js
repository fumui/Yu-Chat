import React from 'react'
import { Text, StyleSheet, View, Image } from 'react-native';
import firebase from 'firebase';
import firebaseConfig from '../../Config/firebase';
import { Button, Icon, Input } from 'native-base';
import StackedLabelTextbox from '../../Components/StackedLabelTextbox';

export default class ChatRoom extends React.Component{
  
  constructor(){
    super()
    this.state = {
      user : firebase.auth().currentUser
    }
  }

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
    return (
      <View style={{height:'100%'}}>
        <View style={styles.profileHeader}/>
        <View style={{marginTop:-75, marginBottom:50}}>
          <Image source={{uri:this.state.user.photoURL}} style={styles.profileImage} />
          <Text style={styles.profileTitle}>Username</Text>
          <View style={styles.profileValue}>
            <Text style={styles.profileValueText}>{this.state.user.displayName}</Text><Icon onPress={()=>{this.setState({editingUsername:true})}} type="MaterialIcons" name="edit" />
          </View>
          <Text style={styles.profileTitle}>Email</Text>
          <View style={styles.profileValue}>
            <Text style={styles.profileValueText}>{this.state.user.email}</Text>
          </View>
        </View>
        <Button block onPress={this.handleLogout}><Text>Logout</Text></Button>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  profileHeader:{
    height:150, 
    backgroundColor:'#2196f3'
  },
  profileImage:{
    width:150, 
    height:150, 
    resizeMode:'contain', 
    alignSelf:'center',
  },
  profileTitle:{
    fontSize:25, 
    marginLeft:20
  },
  profileValue:{
    paddingHorizontal:40,
    width:'100%',
    flexDirection:'row',
    justifyContent:'space-between'
  },
  profileValueText:{
    fontSize:20, 

  }
})