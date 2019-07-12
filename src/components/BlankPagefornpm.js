import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  Alert,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';
import Sidebar from 'react-native-sidebar';
import { Actions } from 'react-native-router-flux';
import ChangePasswordService from '../services/ChangePasswordService';
import styles from '../assets/css/mainStyle';
export default class ChangePassword extends Component {
  

  renderContent() {
    <View>
        <Text>anand</Text>
        <Text>anand</Text>
        <Text>anand</Text>
        <Text>anand</Text>
    </View>    
  }

  TeacherProfile(){
    <View>
        <Text>as</Text>
        <Text>as</Text>
        <Text>as</Text>
        <Text>as</Text>
    </View>    
  
  }
  login(){
    <View>
        <Text>ashish</Text>
        <Text>ashish</Text>
        <Text>ashish</Text>
        <Text>ashish</Text>
    </View>   
  
  }

  render() {
    return (
      <View >
    
    <Sidebar
                 leftSidebar={ this.login() }
                 rightSidebar={ this.TeacherProfile() }
                style={{ flex: 1, backgroundColor: 'black' }}>
            { this.renderContent() }
        </Sidebar>

      </View>
      
    );
  }
}
