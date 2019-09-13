import React from 'react'
import { Text, StyleSheet, View, Image } from 'react-native';
import firebase from 'firebase';
import firebaseConfig from '../../Config/firebase';
import { Button, Form, Item, Input, Label, Spinner } from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'react-native-fetch-blob'

export default class ChatRoom extends React.Component{
  
  constructor(){
    super()
    this.state = {
      user : {},
      formData:{
        username:'',
        fullname:'',
      },
      editingProfile:false
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

  editProfileImage = () => {
    const Blob = RNFetchBlob.polyfill.Blob
    const fs = RNFetchBlob.fs
    window.Blob = Blob
    window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest

    ImagePicker.openPicker({
      mediaType:'image',
      cropping:true,
      width:512,
      height:512,
      cropperCircleOverlay:true,
      includeBase64:true,
    }).then(
      image => {
        let imageRef = firebase.storage().ref('Images').child('profileImages/'+this.state.user.uid)
        let uploadBlob = null
        fs.readFile(image.path,'base64')
          .then((data) => {
            return Blob.build(data,{type:`${image.mime};BASE64`})
          })
          .then((blob) => {
            uploadBlob = blob
            return imageRef.put(blob, {contentType:image.mime})
          })
          .then(data =>{
            uploadBlob.close()
            return imageRef.getDownloadURL()
          })
          .then(downloadURL => {
            console.warn('File available at', downloadURL);
            let currentUser = firebase.auth().currentUser
            return Promise.all([
              currentUser.updateProfile({photoURL:downloadURL}), 
              firebase.firestore().collection('Users').doc(currentUser.uid).update({photoURL:downloadURL})
            ])
          })
          .then(()=>{
            console.warn('profile image updated');
          })
      }
    )
  }

  displayProfile = () => {
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
              <Button block onPress={this.editProfileImage}><Text>Edit Profile Image</Text></Button>
              <Button block onPress={() => this.setState({editingProfile:true})}><Text>Edit Profile</Text></Button>
              <Button block onPress={this.handleLogout}><Text>Logout</Text></Button>
            </View>
            :
            <View></View>
        }
      </View>
    )
  }

  editProfile = () => {
    return (
      <View style={{height:'100%'}}>
        <View style={styles.profileHeader}/>
        <Form>
          <Item floatingLabel>
            <Label>Full Name</Label>
            <Input  onChangeText={(text)=>this.handleChange('fullname',text)}  textContentType="name"/>
          </Item>
          <Item floatingLabel>
            <Label>Username</Label>
            <Input  onChangeText={(text)=>this.handleChange('username',text)}  textContentType="username"/>
          </Item>
          <Button 
            style={styles.formButton} 
            onPress={this.handleSubmit}
            disabled={this.state.isLoading}
            full 
            dark
          >
            <Text style={styles.formButtonsText}>{this.state.isLoading ? 'Loading':'Save'}</Text>
          </Button>
        </Form>
      </View>
    )
  }

  handleChange= (name,value) => {
    let newFormData = {...this.state.formData}
    newFormData[name] = value
    this.setState({
      formData: newFormData
    })
  }
  handleSubmit = () => {
    this.setState({isLoading:true})
    firebase.auth()
      .currentUser
      .updateProfile({displayName:this.state.formData.username})
      .then(()=>{
        firebase.firestore()
          .collection('Users')
          .doc(this.state.user.uid)
          .update(this.state.formData)
          .then(()=>{
            this.setState({editingProfile:false, isLoading:false})
          })
      })
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
    return this.state.editingProfile ? this.editProfile() : this.displayProfile() 
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
    borderRadius:150,
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

  },
  formButton:{
    color:"white",
    marginTop:10,
    marginLeft:10,
    fontWeight:'bold',
    maxWidth:80,
  },
  formButtonsText:{
    color:"white",
    fontSize:17,
  },
})