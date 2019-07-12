import axios from 'axios';
import React, { Component } from 'react';
import config from '../assets/json/config.json';
import { StyleSheet, Text, View, Button, ImageBackground, ToastAndroid, ScrollView, AsyncStorage, Image, Alert, TouchableHighlight, TextInput } from 'react-native';
import styles from '../assets/css/mainStyle';
import CheckBox from 'react-native-checkbox';
import DismissKeyboard from 'dismissKeyboard';
import DashboardTeacher from './DashboardTeacher';
import { Router, Scene, Actions } from 'react-native-router-flux';
import SignupServices from '../services/signupServices';
export default class SignupStudent extends Component {

  constructor() {
    super();
    this.state = {
      loggedInUser: {},
      student_code: '',
      app_token: '',
      das_device_id: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  async componentWillMount() {
    /* Close keypad */
    DismissKeyboard();
    /* Get local storage values */
    await AsyncStorage.getItem('app_token').then((value) =>
      this.setState({ "app_token": value })
    );
    await AsyncStorage.getItem('das_device_id').then((value) =>
      this.setState({ "das_device_id": value })
    );
  }

  /* Form submit for student signup */
  handleSubmit = () => {
    var objThis = this;
    this.setState({ "showLoader": 0 });
    /*Call function in signup searvice to check student code valid or not */
    SignupServices.checkStudentCode(this.state.app_token, this.state.student_code).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      if (response.data.status == 'Failure') {
        ToastAndroid.showWithGravity(
          'Data Not Matched Please Checks It',
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      }
      else if (response.data.status == 'Success') {
        AsyncStorage.setItem('student_data', JSON.stringify(response['data']['user_list'][0]));
        /* redirect it to second step of student signup */
        Actions.SignupStudentStage2();
      }
    });
  }

  /* Save device id for send notification */
  save_device_id(member_no) {
    SignupServices.save_device_id(this.state.app_token, this.state.das_device_id, member_no).then((response) => {
      /* redirect it to second step of student signup */
      Actions.SignupStudentStage2();
    })
  }

  render() {
    var server_path = config.server_path;
    return (
      <ImageBackground source={{ uri: server_path + 'assets/images/body-back.jpg' }} style={styles.backgroundImage}>
        <ScrollView style={styles.signupscrollstyle} contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }} keyboardShouldPersistTaps="handled">
          {/* Company logo */}
          <View style={styles.logo}>
            <Image source={{ uri: server_path + 'assets/images/logon.png' }} style={styles.logoImage} />
          </View>

          <View style={styles.logincontainer}>
            <TextInput style={styles.inpustyle} placeholder="ex.S123456" placeholderTextColor="white" onChangeText={(text) => this.setState({ student_code: text })} />
           {/* Submit Button */}
            <TouchableHighlight
              style={styles.submitbtn}
              title="Check Student Code"
              onPress={this.handleSubmit} >
              <Text style={styles.buttonText}>
                Check student code
           </Text>
            </TouchableHighlight>

            <View style={styles.loginscreen}>
              <View style={styles.signupstyle}>
                <Text style={styles.textcolor}>Already have any account</Text>
              </View>
              <View>
                <Text style={styles.signupclassstyle} onPress={() => Actions.login()} >Login</Text>
              </View>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
      );
  }
}
