import axios from 'axios';
import React, { Component } from 'react';
import {StyleSheet, Text, View, Button,ImageBackground, Image,ToastAndroid, AsyncStorage, Alert,TextInput,TouchableHighlight } from 'react-native';
import DashboardTeacher from './DashboardTeacher';
import { Router, Scene,Actions } from 'react-native-router-flux';
import styles from '../assets/css/mainStyle';
import config from '../assets/json/config.json';
import SignupServices from '../services/signupServices';
import Loader from './Loader';
import DismissKeyboard from 'dismissKeyboard';
const options = {
  fields: {
     parent_no: {
      error: 'Enter Your Parent Code',
      label: 'Parent Code'
    },   
  }, 
};

export default class CheckParentCode extends Component {
  constructor()
  {
    super();
    this.state ={
      showLoader: 0,
      loggedInUser: {}
    }
  }

  async componentWillMount()
  {
    await AsyncStorage.getItem('loggedInUser').then((value)=>
      this.setState({"loggedInUser": JSON.parse(value)})
    )
    await AsyncStorage.getItem('app_token').then((value)=> 
      this.setState({"app_token": value})
    );
  }

  /* Add parent by parent code */
  handleSubmit = () => {  
    DismissKeyboard();
    var param = {
      parent_no: this.state.parent_code,
      parent_ac_no: this.state.loggedInUser.member_no,
      token:this.state.app_token    
    }  
    var objThis = this;
    objThis.setState({ "showLoader": 0 }); 
    /* Call function for add parent */
    SignupServices.checkParentCode(param).then(function(response){
      objThis.setState({ "showLoader": 0 }); 
      if(response.data.status == 'Failure')
      { 
        ToastAndroid.showWithGravity(
          'Data not Matched Please Checks It',
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      }
      else if(response.data.status == 'Success')
      {                  
        Actions.YourkidsParent();          
      }
    });
 
  }

  render() {
    return (        
          <ImageBackground source={require('../assets/images/body-back.jpg')} style={styles.backgroundImage}>
          <View style={styles.logo}>
            <Image source={require('../assets/images/logon.png')} style={styles.logoImage} />
          </View>
          <View style={styles.logincontainer}>
            <TextInput style={styles.inpustyle} placeholder="ex.P123456" placeholderTextColor="white"  onChangeText={(text) => this.setState({ parent_code: text })}/>
            <TouchableHighlight
              style={styles.submitbtn}
              title="Check Student Code"
              onPress={this.handleSubmit} >
              <Text style={styles.buttonText}>
                Check Parent code
            </Text>
            </TouchableHighlight>  
          </View>
          </ImageBackground>      
     );    
  }
}
