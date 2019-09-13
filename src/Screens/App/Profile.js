import React from 'react'
import { Text, StyleSheet, View, Image } from 'react-native';
import firebase from 'firebase';
import firebaseConfig from '../../Config/firebase';
import { Button, Form, Item, Input, Label, Spinner, Icon, Toast } from 'native-base';
import ImagePicker from 'react-native-image-crop-picker';
import RNFetchBlob from 'react-native-fetch-blob'

export default class ChatRoom extends React.Component{
  
  constructor(props){
    super(props)
    this.state = {
      user : props.navigation.getParam('userData') || {},
      formData:{
        username:'',
        fullname:'',
      },
      editingProfile:false,
      uploadingImage:false,
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
        this.setState({uploadingImage:true})
        let imageRef = firebase.storage().ref('Images').child('profileImages/'+this.state.user.uid)
        let uploadBlob = null
        let photoURL = null
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
            photoURL = downloadURL
            return Promise.all([
              currentUser.updateProfile({photoURL:downloadURL}), 
              firebase.firestore().collection('Users').doc(currentUser.uid).update({photoURL:downloadURL})
            ])
          })
          .then(()=>{
            console.warn('profile image updated');
            this.setState({
              user:{
                ...this.state.user,
                photoURL:photoURL
              },
              uploadingImage:false,
            })
          })
          .catch(err=>{
            Toast.show({
              text:'failed to upload image '+ err.message,
              position:'bottom',
              type:'danger',
              duration:3000,
            })
          })
      }
    )
  }

  displayProfile = () => {
    let ownProfile = this.state.user.uid == firebase.auth().currentUser.uid
    return (
      <View style={{height:'100%'}}>
        <View style={styles.profileHeader}/>
        {
          Object.keys(this.state.user).length !== 0 ? 
          <View style={{marginTop:-75, marginBottom:50}}>
            <View style={styles.profileImageContainer}>
              {
                this.state.uploadingImage ? 
                <View style={styles.profileImage}><Spinner color="black" /></View>
                :
                <Image source={{uri:this.state.user.photoURL}} style={styles.profileImage} />
              }
              {
                ownProfile?
                <Button light style={styles.editImageButton} onPress={this.editProfileImage}><Icon type="FontAwesome5" name="edit" style={styles.editImageIcon} /></Button>
                :
                <View></View>
              }
            </View>
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
          ownProfile?
            <View>
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
        <View style={{marginTop:-75, marginBottom:50}}>
          <Image source={{uri:this.state.user.photoURL}} style={styles.profileImage} />
          <Form>
            <Item stackedLabel>
              <Label>Full Name</Label>
              <Input placeholder={this.state.user.fullname} onChangeText={(text)=>this.handleChange('fullname',text)}  textContentType="name"/>
            </Item>
            <Item stackedLabel>
              <Label>Username</Label>
              <Input placeholder={this.state.user.username} onChangeText={(text)=>this.handleChange('username',text)}  textContentType="username"/>
            </Item>
            <View style={styles.formButtons}>
              <Button 
                style={styles.formButton} 
                onPress={this.handleSubmit}
                disabled={this.state.isLoading}
                full 
                dark
              >
                <Text style={styles.formButtonsText}>{this.state.isLoading ? 'Loading':'Save'}</Text>
              </Button>
              <Button 
                style={styles.formButton} 
                onPress={this.handleCancel}
                full 
                dark
              >
                <Text style={styles.formButtonsText}>Cancel</Text>
              </Button>
            </View>
          </Form>
        </View>
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
    const {formData} = this.state
    let updatedData = {
      username:formData.username === ''? this.state.user.username:formData.username,
      fullname:formData.fullname === ''? this.state.user.fullname:formData.fullname,
    }
    firebase.auth()
      .currentUser
      .updateProfile({displayName:updatedData.username})
      .then(()=>{
        firebase.firestore()
          .collection('Users')
          .doc(this.state.user.uid)
          .update(this.state.updatedData)
          .then(()=>{
            this.setState({
              editingProfile:false, 
              isLoading:false,
              user:{
                ...this.state.user,
                ...this.state.updatedData
              }
            })
          })
      })
  }
  handleCancel = () => {
    this.setState({
      editingProfile:false, 
    })
  }
  componentDidMount(){
    if(Object.keys(this.state.user).length === 0){
      const userId = this.props.navigation.getParam('userID') || firebase.auth().currentUser.uid
      firebase.firestore()
        .collection('Users')
        .doc(userId)
        .get()
        .then(doc => this.setState({user:doc.data()}))
    }
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
  profileImageContainer:{
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
  formButtons:{
    flexDirection:'row-reverse',
    justifyContent:'space-around'
  },
  formButton:{
    minWidth:100,
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
  editImageButton:{
    alignSelf:'flex-end',
    marginTop:-40,
    marginRight:-10,
    borderRadius:55,
    height:55,
    width:55,
    overflow:'visible'
  },
  editImageIcon:{
    color:'black'
  }
})