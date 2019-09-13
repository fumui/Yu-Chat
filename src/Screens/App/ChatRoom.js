import React from 'react'
import { Text, View, StyleSheet, Image } from 'react-native';
import { FlatList, TouchableNativeFeedback } from 'react-native-gesture-handler'
import * as firebase from 'firebase/app';
import 'firebase/firebase-firestore';
import firebaseConfig from '../../Config/firebase'
export default class ChatRoom extends React.Component{

  constructor() {
    super()
    this.state = {
      currentUser: firebase.auth().currentUser,
      users:[],
    }
  }
  unsubscribe = firebase
    .firestore()
    .collection('Users')
    .onSnapshot(snapshot => {
      let users = snapshot.docs.map(doc => doc.get('uid') !== this.state.currentUser.uid ? doc.data():null)
      this.setState({users})
    })

  render(){
    return (
      <FlatList
        renderItem={({ item, separators }) => (
          item !== null && item !== undefined ?
          <TouchableNativeFeedback 
            style={styles.rowBgColor}
            >
              <Image
                source={{uri:item.photoURL}}
                style={styles.avatarImageStyle}
                onPress={()=>{this.props.navigation.navigate('FriendProfile', {userID:item.uid, userData:item})}} 
              />
              <View style={styles.contentColor}>
                <Text onPress={()=>{this.props.navigation.navigate('Chat', {targetUID:item.uid, userData:item})}}  style={styles.rowText}>{item.username}</Text>
              </View>
          </TouchableNativeFeedback>
          :<View></View>
        )}
        data={this.state.users}
        keyExtractor={(item)=> item !== null && item !== undefined ? item.uid:item}
        style={styles.list}
      />
    )
  }
  componentWillUnmount(){
    this.unsubscribe()
  }
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#FFF",
    paddingTop: 8
  },
  list: {
    flex: 1,
    backgroundColor: "#FFF"
  },
  rowBgColor: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 16
  },
  avatarImageStyle: {
    height:40,
    width:40,
    borderRadius: 20,
  },
  contentColor: {
    left: 72,
    height: 56,
    position: "absolute",
    right: 0,
    justifyContent: "center",
    paddingRight: 16
  },
  rowText: {
    color: "#212121",
    fontSize: 16
  },
  iconStyle: {
    fontSize: 24,
    color: "#CCCCCC",
    position: "absolute",
    right: 16
  }
});
