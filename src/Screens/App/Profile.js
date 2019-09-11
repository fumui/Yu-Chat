import React from 'react'
import { Text, StyleSheet, View, Image } from 'react-native';
import firebase from 'firebase';
import firebaseConfig from '../../Config/firebase';
import { Button, Icon, Input, Spinner } from 'native-base';
import StackedLabelTextbox from '../../Components/StackedLabelTextbox';

export default class ChatRoom extends React.Component{
  
  constructor(){
    super()
    this.state = {
      user : {}
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

  editProfile = () => {
    
  }

  componentDidMount(){
    const userId = this.props.navigation.getParam('userID') || firebase.auth().currentUser.uid
    firebase 
     .firestore()
     .collection('Users')
     .doc(userId)
     .get()
     .then(doc => this.setState({user:doc.data()}))
  }
  render(){
    return (
      <View style={{height:'100%'}}>
        <View style={styles.profileHeader}/>
        {
          Object.keys(this.state.user).length !== 0 ? 
          <View style={{marginTop:-75, marginBottom:50}}>
            <Image source={{uri:this.state.user.photoURL}} style={styles.profileImage} />
            <Text style={styles.profileTitle}>Name</Text>
            <View style={styles.profileValue}>
              <Text style={styles.profileValueText}>{this.state.user.fullname}</Text>
            </View>
            <Text style={styles.profileTitle}>Username</Text>
            <View style={styles.profileValue}>
              <Text style={styles.profileValueText}>{this.state.user.username}</Text>
            </View>
            <Text style={styles.profileTitle}>Email</Text>
            <View style={styles.profileValue}>
              <Text style={styles.profileValueText}>{this.state.user.email}</Text>
            </View>
          </View>
          :
          <View style={{marginTop:-75, marginBottom:50}}><Spinner color="black" /></View>
        }
        {
          this.state.user.uid == firebase.auth().currentUser.uid?
            <View>
              <Button block onPress={this.editProfile}>Edit Profile</Button>
              <Button block onPress={this.handleLogout}><Text>Logout</Text></Button>
            </View>
            :
            <View></View>
        }
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