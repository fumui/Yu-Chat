import React, { Component } from 'react';
import {Text, StyleSheet} from 'react-native';
import { Form, Item, Input, Label, Content, Button,  Toast } from 'native-base';
import * as firebase from 'firebase/app';
import 'firebase/firebase-firestore';
import firebaseConfig from '../../Config/firebase'

class Auth extends Component {
  constructor(props){
    super(props)
    this.state = {
      formData:{
        username:'',
        fullname:'',
        email:'',
        password:'',
      },
      isLoading:false,
      showToast:false
    }
  }
  unsub = firebase.auth().onAuthStateChanged(user => {
    if (user) {
      user.updateProfile({
        displayName: this.state.formData.username,
        photoURL: "https://firebasestorage.googleapis.com/v0/b/yu-chat.appspot.com/o/User.png?alt=media&token=79e7b969-046c-4657-9558-b65a1812e388"
      })
      .then(() =>{
        let userData = {
          uid:user.uid,
          username:this.state.formData.username,
          fullname:this.state.formData.fullname,
          photoURL:"https://firebasestorage.googleapis.com/v0/b/yu-chat.appspot.com/o/User.png?alt=media&token=79e7b969-046c-4657-9558-b65a1812e388",
        }
        firebase.firestore().collection('Users')
                .doc(user.uid)
                .set(userData)
                .then(()=>{
                  this.setState({isLoading:false})
                  Toast.show({
                    text:`Welcome ${this.state.formData.username}`,
                    buttonText: "Okay",
                    type: "success",
                    position:'top',
                    duration:4000,
                    style:styles.toast
                  })
                  this.props.navigation.navigate('Home')
                  this.unsub()
                })
      })
      .catch(err => {
        this.setState({isLoading:false})
        Toast.show({
          text: errorMessage,
          buttonText: "Okay",
          type: "danger",
          position:'top',
          duration:4000,
          style:styles.toast
        })
        console.log(err)
        this.unsub()
      });
    }
  });

  handleChange= (name,value) => {
    let newFormData = {...this.state.formData}
    newFormData[name] = value
    this.setState({
      formData: newFormData
    })
  }

  handleSubmit = () => {
    this.setState({isLoading:true})
    firebase.firestore()
      .collection('Users')
      .where("username","==",this.state.formData.username)
      .get()
      .then(value => {
        if(value.empty){
          this.signUp(this.state.formData.email, this.state.formData.password)
        }else{
          console.warn('Username already existed')
          this.setState({isLoading:false})
          Toast.show({
            text: 'Username already existed',
            buttonText: "Okay",
            type: "danger",
            position:'top',
            duration:4000,
            style:styles.toast
          })
        }
      })
    
  }

  signUp = (email, password) => {
    firebase.auth()
      .createUserWithEmailAndPassword(email, password)
      .catch(err => {
        let errorMessage = err.code == 'auth/weak-password' ? 'The password is too weak.': err.message;
        Toast.show({
          text: errorMessage,
          buttonText: "Okay",
          type: "danger",
          position:'top',
          duration:4000,
          style:styles.toast
        })
        console.log(err)
      })
  }
  render() {
    return (
      <Content contentContainerStyle={styles.root}>
        <Text style={styles.welcomeText}>Welcome to Yu Chat</Text>
        <Form style={styles.form}>
          <Item floatingLabel>
            <Label>Full Name</Label>
            <Input  onChangeText={(text)=>this.handleChange('fullname',text)}  textContentType="name"/>
          </Item>
          <Item floatingLabel>
            <Label>Username</Label>
            <Input  onChangeText={(text)=>this.handleChange('username',text)}  textContentType="username"/>
          </Item>
          <Item floatingLabel>
            <Label>Email</Label>
            <Input onChangeText={(text)=>this.handleChange('email',text)}  autoCompleteType='email' stextContentType="emailAddress"/>
          </Item>
          <Item floatingLabel>
            <Label>Password</Label>
            <Input onChangeText={(text)=>this.handleChange('password',text)}  secureTextEntry={true} textContentType="password"/>
          </Item>
          <Button 
            style={styles.formButton} 
            onPress={this.handleSubmit}
            disabled={this.state.isLoading}
            full 
            dark
          >
            <Text style={styles.formButtonsText}>{this.state.isLoading ? 'Loading':'Sign Up'}</Text>
          </Button>
        </Form>
        <Button 
          style={styles.buttons}
          onPress={()=>this.props.navigation.navigate('Login')}
          transparent light
        >
          <Text style={styles.buttonsText}>Sign In</Text>
        </Button>
      </Content>
    );
  }
}
const styles = StyleSheet.create({
  root:{
    marginLeft:30,
    justifyContent:"space-around"
  },
  welcomeText:{
    fontFamily:"Airbnb Cereal App",
    marginTop:20,
    fontSize:34,
    flex:1,
  },
  form:{
    marginTop:10,
    marginBottom:40,
    flex:1,
  },
  formButton:{
    color:"white",
    marginTop:10,
    marginLeft:10,
    fontWeight:'bold',
    maxWidth:80,
  },
  buttons:{
    marginTop:10,
    marginLeft:10,
    fontWeight:'bold',
    maxWidth:80,
  },
  formButtonsText:{
    color:"white",
    fontSize:17,
  },
  buttonsText:{
    fontSize:17,
    fontWeight:'bold',
  },
  toast:{
    marginTop:10,
  },
})
export default Auth