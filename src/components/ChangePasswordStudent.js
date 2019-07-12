import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  ToastAndroid,
  TouchableHighlight,
  AsyncStorage
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ChangePasswordService from '../services/ChangePasswordService';
import styles from '../assets/css/mainStyle';
import Loader from './Loader';
import config from '../assets/json/config.json';
import DismissKeyboard from 'dismissKeyboard';
export default class ChangePassword extends Component {
  constructor() {
    super();
    this.state = {
      showLoader: 0,
      loggedInUser: {},
      current_pass: {},
      new_pass: {},
      confirm_new_pass: {}

    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  async componentWillMount() {
    /* Close keypad */ 
    DismissKeyboard();
    /* Get local storage values */ 
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    )

    await AsyncStorage.getItem('app_token').then((value)=> 
      this.setState({"app_token": value})
    );
  }

  handleSubmit() {
    const curr_password = this.state.current_pass;
    const new_password = this.state.new_pass;
    const cnf_password = this.state.confirm_new_pass;
    var member_no = this.state.loggedInUser.member_no;
    var password = this.state.new_pass.value;
    if(new_password != cnf_password) {
           ToastAndroid.showWithGravity(
        'Data is mismatched please Checked It',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER      
      );
    }else if(this.state.new_pass.length < 6) {
      ToastAndroid.showWithGravity(
        'Password must be at least 6 characters long.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }else{
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    ChangePasswordService.changePass(this.state.app_token, member_no, curr_password, new_password, cnf_password).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      if (response.data.status == 'Failure') {
        ToastAndroid.showWithGravity(
          'Data is mismatched please Checked It',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER        
        );
      }else if (response.data.status == 'Success') {
        ToastAndroid.showWithGravity(
          'Your password is Successfully Changed',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER        
        );
        /* Move to Student profile page */ 
        Actions.StudentProfile();      
      }
    });
  }
}
  render() {
    return (
      <View>
      {/* Show the loader when data is loading else show the page */}
      {
        this.state.showLoader == 1 ?
          <View style={styles.loaderContainer}>
            <Loader />
          </View>
          :
          <View style={{ margin: 20 }}>
            <View style={styles.changestyle}>
              <TextInput secureTextEntry={true} style={[styles.styleinput, styles.profileinput]} ref={input => { this.textInput = input }}
                placeholder="Current Password" onChangeText={(text) => this.setState({ current_pass: text })}
              />
              <TextInput secureTextEntry={true} style={[styles.styleinput, styles.profileinput]} ref={input => { this.textInput = input }}
                placeholder="New Password" onChangeText={(text) => this.setState({ new_pass: text })}
              />
              <TextInput secureTextEntry={true} style={[styles.styleinput, styles.profileinput]} ref={input => { this.textInput = input }}
                placeholder="Confirm New Password" onChangeText={(text) => this.setState({ confirm_new_pass: text })}
              />
              <TouchableHighlight
                style={styles.classbtn}
                title="Change Pasword" onPress={this.handleSubmit}  >
                <Text style={styles.buttonText}>Change Pasword</Text>
              </TouchableHighlight>
            </View>
          </View>
        }
      </View>
    );
  }
}
