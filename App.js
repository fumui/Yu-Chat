import { createAppContainer, createSwitchNavigator } from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import React from 'react';
import {Root, Button} from 'native-base';

import Login from './src/Screens/Auth/Login';
import Register from './src/Screens/Auth/Register';
import Home from './src/Screens/App/Home';
import ChatRoom from './src/Screens/App/ChatRoom';
import Profile from './src/Screens/App/Profile';
import Chat from "./src/Screens/App/Chat";

const AuthStack = createStackNavigator({
  Login:Login,
  Register:Register
},{
  headerMode:"none",
})


const AppTabNavigation = createMaterialTopTabNavigator({
  Home:Home,
  ChatRoom:ChatRoom,
  Profile:Profile,
},{
  tabBarOptions: {
    indicatorStyle:{
      color : 'lightblue'
    }
  },
})

const AppStack = createStackNavigator({
  AppTabNavigation:AppTabNavigation,
  Chat:Chat,
  FriendProfile:Profile,
},{
  headerMode:"none",
})

const AppNavigator = createSwitchNavigator({
  Auth:AuthStack,
  App:AppStack,
},{
  initialRouteName:'Auth',
});

const AppContainer = createAppContainer(AppNavigator)
const App = ()=>{
  return(
      <Root>
        <AppContainer />
      </Root>
  )
}
export default App;