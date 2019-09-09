import { createAppContainer, createSwitchNavigator } from "react-navigation";
import {createStackNavigator} from "react-navigation-stack";
import React from 'react';
import {Root} from 'native-base';

import Login from './src/Screens/Auth/Login';
import Register from './src/Screens/Auth/Register';

const AuthStack = createStackNavigator({
  Login:Login,
  Register:Register
},{
  headerMode:"none",
})

const AppStack = createStackNavigator({
  Home:Home,
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
        <AppContainer/>
      </Root>
  )
}
export default App;