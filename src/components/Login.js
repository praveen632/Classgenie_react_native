import React, { Component } from 'react';
import { View, StyleSheet, Button, Text, AsyncStorage, ActivityIndicator, TextInput, ImageBackground, ToastAndroid, Alert, TouchableHighlight, Image, TouchableWithoutFeedback, ScrollView } from 'react-native';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import config from '../assets/json/config.json';
import styles from '../assets/css/mainStyle';
import SignupServices from '../services/signupServices';
import DismissKeyboard from 'dismissKeyboard';

export default class Login extends Component {
  constructor() {
    super()
    this.state = {
      Showme: true,
      loggedInUser: {},
      username: '',
      password: '',
      skipManual: null,
      das_device_id: ''
    }
  }

  async componentWillMount() {
   /* Close keypad */
    DismissKeyboard();
    /* Get local storage values */
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    )

    await AsyncStorage.getItem('skipManual').then((value) =>
      this.setState({ "skipManual": value })
    )

    await AsyncStorage.getItem('app_token').then((value) =>
      this.setState({ "app_token": value })
    );

    await AsyncStorage.getItem('das_device_id').then((value) =>
      this.setState({ "das_device_id": value })
    );
   /* Check already login or not on the time to page load */
    this.checkAlreadyLoggedIn();
  }

  checkAlreadyLoggedIn() {
    /* check if user is already login then redirect to respective dashboard */
    if (this.state.loggedInUser) {
      var userType = this.state.loggedInUser.type;
      if (userType == 1 || userType == 2 || userType == 5) {
        if (this.state.skipManual == "" || this.state.skipManual == null) {
          Actions.ManualSlide();
        }
        else {
          /* load Principal, vice principal and teacher dashboard */              
          Actions.DashboardTeacher();
        }
      }
      else if (userType == 3) {
        if (this.state.skipManual == "" || this.state.skipManual == null) {
          Actions.ManualSlide();
        }
        else {
          /* load parent dashboard */
          Actions.ClassStoryParent();
        }

      }
      else if (userType == 4) {
        if (this.state.skipManual == "" || this.state.skipManual == null) {
          Actions.ManualSlide();
        }
        else {
          /* if user has not skipped tutorial then show it */
          Actions.DashboardStudent();
          if (response['data']['user_list'][0].status == '0') {
            ToastAndroid.showWithGravity(
              'Account not verified',
              ToastAndroid.LONG,
              ToastAndroid.CENTER
            );
          }
        }
      }
    }
  }

  /* Login form submit */
  handleSubmit = () => {
    if (this.state.username == '' || this.state.password == '') {
      ToastAndroid.showWithGravity(
        'Please check username or password',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER

      );
    }
    else {
      axios.get(config.api_url + ':' + config.port + '/login?email=' + this.state.username + '&password=' + this.state.password + '&token=' + this.state.app_token)
        .then(function (response) {
          if (response.data.status == 'Failure') {
            ToastAndroid.showWithGravity(
              'Please check username or password',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
            );
          }
          else if (response.data.status == 'Success') {
            AsyncStorage.setItem('loggedInUser', JSON.stringify(response['data']['user_list'][0]));
            this.save_device_id(JSON.parse(response['data']['user_list'][0]['member_no']));
            /* set school data in storage */
            if (response['data'].hasOwnProperty("school") == true) {
              var school = response['data']['school'][0];
            }
            else {
              var school = [];
            }
            AsyncStorage.setItem('school', JSON.stringify(school));
            /* For Principal, vice principal and teacher */
            if (response['data']['user_list'][0].type == '2' || response['data']['user_list'][0].type == '1' || response['data']['user_list'][0].type == '5') {
              if (this.state.skipManual == "" || this.state.skipManual == null) {
                Actions.ManualSlide();
              }
              else {
                /* load Principal, vice principal and teacher dashboard */               
                Actions.DashboardTeacher();
              }
            } else if (response['data']['user_list'][0].type == '3') { /* For parent */
              if (this.state.skipManual == "" || this.state.skipManual == null) {
                Actions.ManualSlide();
              }
              else {
                /* load parent dashboard */
                Actions.ClassStoryParent();
              }
            } else if (response['data']['user_list'][0].type == '4') { /* for student */
              if (this.state.skipManual == "" || this.state.skipManual == null) {
                Actions.ManualSlide();
              } else {
                /* if user has not skipped tutorial then show it */
                Actions.DashboardStudent();
                if (response['data']['user_list'][0].status == '0') {
                  ToastAndroid.showWithGravity(
                    'Account not verified',
                    ToastAndroid.LONG,
                    ToastAndroid.CENTER
                  );
                }
              }
            }
          }
        }.bind(this))
        .catch(function (error) {         
        }.bind(this));
    }
  }

  /* Save device id for notification */
  save_device_id(member_no) {
    SignupServices.save_device_id(this.state.app_token, this.state.das_device_id, member_no).then((response) => {
      if (response.data.status == 'Success') {

      }
    })
  }

  render() {
    var server_path = config.server_path;
    return (
       <ImageBackground source={{ uri: server_path + "/assets/images/body-back.jpg" }} style={styles.backgroundImage}>
        <ScrollView style={styles.signupscrollstyle} contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }} keyboardShouldPersistTaps="handled" >
          <View style={styles.logo}>
            <Image source={{ uri: server_path + "/assets/images/logon.png" }} style={styles.logoImage} />
          </View>
          <View style={styles.logincontainer}>
            <View style={styles.logininputtext}>
              <TextInput style={styles.inpustyle} placeholder="Username" placeholderTextColor="white" onChangeText={(text) => this.setState({ username: text })} />
              <TextInput secureTextEntry={true} style={styles.inpustyle} placeholder="Password" placeholderTextColor="white" onChangeText={(text) => this.setState({ password: text })} />
            </View>
            <TouchableHighlight
              style={styles.submitbtn}
              title="Submit"
              onPress={this.handleSubmit} >
              <Text style={styles.buttonText}>
                LOG IN
            </Text>
            </TouchableHighlight>
            {/* Forgot password */}
            <View>
              <Text onPress={() => Actions.forgetPassword()} style={styles.forgotp} >Forgot Password ?</Text>
            </View>
            {/* For signup */}
            <View style={styles.loginscreen}>
              <View style={styles.signupstyle}>
                <Text style={styles.textcolor}>Don’t have any account ? </Text>
              </View>
              <TouchableWithoutFeedback>
                <View >
                  <Text style={styles.signupclassstyle} onPress={() => Actions.signup()} >Signup</Text>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    );
  }
}




