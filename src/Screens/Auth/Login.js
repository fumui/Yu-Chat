import React, { Component } from 'react';
import {Text, StyleSheet} from 'react-native';
import { Form, Item, Input, Label, Content, Button, Toast, Icon } from 'native-base';
import firebase from 'firebase';
import firebaseConfig from '../../Config/firebase'
import StackedLabelTextbox from '../../Components/StackedLabelTextbox';
class Auth extends Component {
  constructor(props){
    super(props)
    this.state = {
      formData:{
        email:'',
        password:'',
      },
      isLoading:false,
      showToast:false
    }

    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        Toast.show({
          text:`Welcome ${user.displayName}`,
          buttonText: "Okay",
          type: "success",
          position:'top',
          duration:4000,
          style:styles.toast
        })
        this.props.navigation.navigate('Home')
      }
    });
  }
  
  handleChange= (name,value) => {
    let newFormData = {...this.state.formData}
    newFormData[name] = value
    this.setState({
      formData: newFormData
    })
  }

  handleSubmit = () => {
    firebase.auth().signInWithEmailAndPassword(this.state.formData.email, this.state.formData.password)
    .catch(err=>{
      let errMessage = err.code == 'auth/wrong-password' || err.code == 'auth/invalid-email' ? 'email or password is wrong':'oops! Something went wrong!'
      Toast.show({
        text: errMessage,
        buttonText: "Okay",
        type: "danger",
        position:'top',
        duration:4000,
        style:styles.toast
      })
    })
  }

  loginWithGoogle = () =>{

  }

  render() {
    return (
      <Content style={styles.root}>
        <Text style={styles.welcomeText}>Here To Get Welcomed !</Text>
        <Form style={styles.form} >
          <Item floatingLabel>
            <Label>Email</Label>
            <Input onChangeText={(text)=>this.handleChange('email',text)}  autoCompleteType='email'  keyboardType='email-address' textContentType="emailAddress"/>
          </Item>
          <Item floatingLabel>
            <Label>Password</Label>
            <Input onChangeText={(text)=>this.handleChange('password',text)} secureTextEntry={true} textContentType="password"/>
          </Item>
          <Button 
            disabled={this.state.isLoading}
            style={styles.buttons}
            onPress={this.handleSubmit}
            block dark><Text style={styles.formButtonsText}>{this.state.isLoading ? 'Loading':'Sign In'}</Text></Button>
        </Form>
        {/* <StackedLabelTextbox onChangeText={(text)=>this.handleChange('email',text)} label='Email' placeholder='Email...'/> */}
        {/* <Button>
          <Icon type='FontAwesome5' name='home' />
          <Text>Login With Google</Text>
        </Button> */}
        <Button 
          style={styles.buttons} 
          onPress={()=>this.props.navigation.navigate('Register')}
          transparent light><Text style={styles.buttonsText}>Sign Up</Text></Button>
      </Content>
    );
  }
}
const styles = StyleSheet.create({
  root:{
    marginLeft:30,
  },
  welcomeText:{
    marginTop:70,
    fontSize:34,
    flex:1,
  },
  form:{
    marginTop:30,
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
    marginTop:20,
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
    marginTop:20,
  },
})
export default Auth