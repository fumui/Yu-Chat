import React from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import { Text,Image } from 'react-native'
import * as firebase from 'firebase/app';
import 'firebase/firebase-firestore';
import 'firebase/auth';
import firebaseConfig from '../../Config/firebase'
import { Header, View, Left, Body, Spinner, Right  } from 'native-base';

export default class Chat extends React.Component {
  constructor(props){
    super(props)
    let currentUser = firebase.auth().currentUser
    let targetUID = props.navigation.getParam('targetUID')
    
    let originChatRef = firebase.firestore()
                                .collection('Messages')
                                .doc('Chats')
                                .collection(currentUser.uid + targetUID)
    let targetChatRef = firebase.firestore()
                                .collection('Messages')
                                .doc('Chats')
                                .collection(targetUID + currentUser.uid)

    this.state = {
      messages: [],
      targetUser:{},
      currentUser ,
      targetChatRef,
      originChatRef,
      unsubscribeTargetChat: targetChatRef.onSnapshot(this.chatListener),
      unsubscribeOriginChat: originChatRef.onSnapshot(this.chatListener),
    }

    firebase.firestore()
      .collection('Users')
      .doc(targetUID)
      .get()
      .then(doc => this.setState({targetUser:doc.data()}))
  }

  chatListener = (snapshot) => {
    let messages = snapshot.docChanges().map(changes => {
      let data = changes.doc.data()
      data.createdAt = new Date(data.createdAt.seconds * 1000)
      return data
    })
    let appendedMessage =  GiftedChat.append(this.state.messages, messages)
    appendedMessage.sort((a, b)=>b.createdAt.getTime() - a.createdAt.getTime())
    this.setState({messages:appendedMessage})
  }

  componentWillUnmount(){
    this.state.unsubscribeOriginChat()
    this.state.unsubscribeTargetChat()
  }

  onSend(messages = []) {
    this.state.targetChatRef.doc(messages[0]._id).set(messages[0])
  }
  
  openFriendProfile = () => {
    const friendUID = this.props.navigation.getParam('targetUID')
    this.props.navigation.navigate('FriendProfile', {userID:friendUID})
  }

  render() {
    console.log(this.state)
    return (
      <View style={{flex: 1}}>
        <Header style={{backgroundColor:'#2196f3'}}>
        {
          Object.keys(this.state.targetUser).length !== 0 ? 
            <React.Fragment>
              <Left>
                <Image 
                  source={{uri:this.state.targetUser.photoURL}} 
                  style={{width:40, height:40}} 
                  />
              </Left>
              <Body>
                <Text 
                  style={{fontSize:20, color:'white'}} 
                  onPress={this.openFriendProfile} 
                >
                  {this.state.targetUser.username}
                </Text>
              </Body>
              <Right/>
            </React.Fragment>
          :
          <React.Fragment><Spinner color='black' /></React.Fragment>
        }
        </Header>
        <GiftedChat
          messages={this.state.messages}
          onSend={messages => this.onSend(messages)}
          onPressAvatar={this.openFriendProfile}
          user={{
            _id: this.state.currentUser.uid,
            name: this.state.currentUser.displayName,
            avatar: this.state.currentUser.photoURL
          }}
        />
      </View>
    )
  }
}