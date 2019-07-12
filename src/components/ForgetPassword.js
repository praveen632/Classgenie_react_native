import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert,ToastAndroid,Dimensions, ImageBackground, TouchableHighlight, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import ForgetPasswordService from '../services/ForgetPasswordService';
import styles from '../assets/css/mainStyle';
import DismissKeyboard from 'dismissKeyboard';

export default class ForgetPassword extends Component {
  constructor() {
    super();
    this.state = {
      email_auth: ''
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.closeModal = this.closeModal.bind(this);
  }

  async componentDidMount() {
    /* Close keypad */
    DismissKeyboard();
  }

  /* Form submit to forgot password */
  handleSubmit() {
    var obj = this;   
    if(obj.state.email_auth == ''){
      Alert.alert(
        '',
        "Please Enter Your Valid Email!!!!",
        [
          { text: 'OK', style: 'cancel' },
        ],
      )
    }else{
    ForgetPasswordService.resetPass(obj.state.email_auth).then(function (response) {      
      if (response.data.status == 'Success') {
        ToastAndroid.showWithGravity(
          'Password Reset Link Has been sent On your Suggested Email_id',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      } 
      else if (response.data.status == 'Failure') {
        ToastAndroid.showWithGravity(
          'Data not match please Check it',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      }
    });
  }
  }

/* Close modal */
  closeModal() {
    Actions.login();
  }

  render() {
    return (
      <ImageBackground source={require('../assets/images/body-back.jpg')} style={styles.backgroundImage}>
        <View style={styles.logo}>
          <Image source={require('../assets/images/logon.png')} style={styles.logoImage} />          
        </View>       
        <View style={styles.logincontainer}>
          <Text style={styles.textcolor}>
            If you've forgotten your password, please ask your teacher.
          </Text>
          <TextInput style={styles.inpustyle}
            placeholder="Please Enter Your Valid Email" placeholderTextColor="white" onChangeText={(text) => this.setState({ email_auth: text })}
          />
          <TouchableHighlight
            style={styles.submitbtn}
            title="Reset Password"
            onPress={this.handleSubmit} >
            <Text style={styles.buttonText}>
              RESET PASSWORD
          </Text>
          </TouchableHighlight>
        </View>
      </ImageBackground>
    );
  }
}