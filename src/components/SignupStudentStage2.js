import axios from 'axios';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, ImageBackground,ToastAndroid, Image, TouchableHighlight, AsyncStorage, Picker, TextInput, Alert, ScrollView } from 'react-native';
import Loader from './Loader';
import DashboardTeacher from './DashboardTeacher';
import { Router, Scene, Actions } from 'react-native-router-flux';
import styles from '../assets/css/mainStyle';
import config from '../assets/json/config.json';
import SignupServices from '../services/signupServices';
import DismissKeyboard from 'dismissKeyboard';

export default class SignupStudentStage2 extends Component {
  constructor() {
    super()
    this.state = {
      showLoader: 0,
      loggedInUser: {},
      student_data: {},
      username: '',
      password: '',
      age: 0,
      ageList: [],
      app_token: '',
      das_device_id:''
    }
  }

  async componentWillMount() {
    /* Close keypad */
    DismissKeyboard();
    /* Get local storage values */
    await AsyncStorage.getItem('app_token').then((value) =>
      this.setState({ "app_token": value })
    );
    await AsyncStorage.getItem('student_data').then((value) =>
      this.setState({ "student_data": JSON.parse(value) })
    )
    await AsyncStorage.getItem('das_device_id').then((value) =>
      this.setState({ "das_device_id": value })
    );
  }
 
  /* Form submit for student signup */
  handleSubmit = () => {
    /* Form validation */
    if (!this.state.username) {
      ToastAndroid.showWithGravity(
        'Please Enter the username with alphabatic or alphanumeric character .This has to be unique for all students',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER    
      );    
      return false;
    } 
    if (!this.state.age) {
      ToastAndroid.showWithGravity(
        'Please select Age',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER    
      );
      return false;
    } 
    if (!this.state.password) {
      ToastAndroid.showWithGravity(
        'Please Enter The Password',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER    
      );
      return false;
    }

    var param = {
      username: this.state.username,
      age: this.state.age,
      password: this.state.password,
      id: this.state.student_data.id,
      student_no: this.state.student_data.student_no,
      token: this.state.app_token
    }
    var objThis = this;
    this.setState({ "showLoader": 0 });
    /* Call function in signup searvice to student signup */
    SignupServices.SignupStudentStage2(param).then(function (response) {
      objThis.setState({ "showLoader": 0 }); 
      if (response.data.status == 'Failure') {
        Alert.alert(
          '',
          response.data['comments'],
          [
            { text: 'OK', style: 'cancel' },
          ],
        )
      }
      else if (response.data.error_code == 1) {
        Alert.alert(
          '',
          response.data['error_msg'],
          [
            { text: 'OK', style: 'cancel' },
          ],
        )
      } else if (response.data.status == 'Success') {
        AsyncStorage.setItem('loggedInUser', JSON.stringify(response['data']['user_list'][0]));
        objThis.save_device_id(response['data']['user_list'][0]['member_no']);
      }
    });
  }

  /* Save device id for send notification */
  save_device_id(member_no)
  { 
     SignupServices.save_device_id(this.state.app_token,this.state.das_device_id,member_no).then((response) => {
  })
     /* redirect it to DASHBOARD */
     Actions.DashboardStudent();
  }

  render() {
    var ageList = [
      { label: 'Please select age', value: 0 },
      { label: '3 Years', value: '3 Years' },
      { label: '4 Years', value: '4 Years' },
      { label: '5 Years', value: '5 Years' },
      { label: '6 Years', value: '6 Years' },
      { label: '7 Years', value: '7 Years' },
      { label: '8 Years', value: '8 Years' },
      { label: '9 Years', value: '9 Years' },
      { label: '10 Years', value: '10 Years' },
      { label: '12 Years', value: '12 Years' },
      { label: '13 Years', value: '13 Years' },
      { label: '14 Years', value: '14 Years' },
      { label: '15 Years', value: '15 Years' },
      { label: '16 Years', value: '16 Years' },
      { label: '17 Years', value: '17 Years' },
      { label: '18 Years', value: '18 Years' },
      { label: '18 Years above', value: '19 Years' },
    ];
    var server_path = config.server_path;
    return (
      // <View>
      // {/* Show the loader when data is loading else show the page */}

      // {
      //   this.state.showLoader == 1 ?

      //     <View style={styles.loaderContainer}>
      //       <Loader />
      //     </View>

      //     :
        <ImageBackground source={{ uri: server_path + 'assets/images/body-back.jpg' }}  style={styles.backgroundImage}>
        <ScrollView style={styles.signupscrollstyle} contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }} keyboardShouldPersistTaps="handled">
          <View style={styles.logo}>
            <Image source={{ uri: server_path + 'assets/images/logon.png' }}  style={styles.logoImage} />
            <Text>
              <Text style={styles.textcolor}>Get ready for your best classroom yet :)</Text>
            </Text>
          </View>
          <View style={styles.logincontainer}>

            <TextInput style={styles.inpustyle} placeholderTextColor="white" onChangeText={(username) => this.setState({ 'username': username })} value={this.state.username} placeholder="username" />
            <View style={styles.PickerViewBorder}>
            {/* Dropdown for age select */}
              <Picker style={[styles.inpustylePicker]} selectedValue={this.state.age} onValueChange={(itemValue, itemIndex) => this.setState({ age: itemValue })}>
                {
                  ageList.map(function (item, key) {
                    return (
                      <Picker.Item label={item.label} value={item.value} key={key} />
                    )
                  })
                }
              </Picker>
            </View>            
            <View>
              <TextInput style={styles.inpustyle} placeholderTextColor="white" onChangeText={(password) => this.setState({ 'password': password })} value={this.state.password} secureTextEntry={true} placeholder="password" />
            </View>

            <TouchableHighlight style={styles.submitbtn} title="Submit" onPress={this.handleSubmit} >
              <View>
                <Text style={styles.buttonText}>
                  Submit
             </Text>
              </View>
            </TouchableHighlight>

          </View>
        </ScrollView>
        </ImageBackground>
      //  }
      //   </View>
    );
  }
}
