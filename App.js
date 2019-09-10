import { createAppContainer, createSwitchNavigator } from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";
import { createMaterialTopTabNavigator } from 'react-navigation-tabs'
import React from 'react';
import {Root} from 'native-base';

import Login from './src/Screens/Auth/Login';
import Register from './src/Screens/Auth/Register';
import Home from './src/Screens/App/Home';
import ChatRoom from './src/Screens/App/ChatRoom';
import Splash from './src/Screens/Splash';

const AuthStack = createStackNavigator({
  Login:Login,
  Register:Register
},{
  headerMode:"none",
})

const AppTabNavigation = createMaterialTopTabNavigator({
  Home:Home,
  ChatRoom:ChatRoom
})

const AppNavigator = createSwitchNavigator({
  Auth:AuthStack,
  App:AppTabNavigation,
  SplashScreen:Splash
},{
  initialRouteName:'SplashScreen',
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