import React from 'react'
import { GiftedChat } from 'react-native-gifted-chat'
import * as firebase from 'firebase/app';
import 'firebase/firebase-firestore';
import 'firebase/auth';
import firebaseConfig from '../../Config/firebase'

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
      currentUser ,
      targetChatRef,
      originChatRef,
      unsubscribeTargetChat: targetChatRef.onSnapshot(this.chatListener),
      unsubscribeOriginChat: originChatRef.onSnapshot(this.chatListener),
    }
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
    console.warn(messages)
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
    this.props.navigation.navigate('Profile', {userID:friendUID})
  }

  render() {
    return (
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
    )
  }
}