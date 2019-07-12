import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, Switch, TextInput, Alert, ToastAndroid, ImageBackground, TouchableHighlight, Image, TouchableOpacity, AsyncStorage } from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from '../assets/css/mainStyle';
import SignupServices from '../services/signupServices';
import DismissKeyboard from 'dismissKeyboard';

export default class Notifications extends Component {
  constructor() {
    super()
    this.state = {
      value: false,
      deviceid: '',
      token: ''
    }
  }

  async componentDidMount() {
    /* Close keypad */
    DismissKeyboard();
    /* Get local storage values */
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    );

    await AsyncStorage.getItem('das_device_id').then((value) =>
      this.setState({ "deviceid": value })
    );

    await AsyncStorage.getItem('app_token').then((value) => 
      this.setState({ "token": value })
    );
    /* load notification on the time of page load */
    await this.loadNotification();
  }

  /* Get notification */
  loadNotification() {
    SignupServices.loadNotification(this.state.loggedInUser.member_no, this.state.deviceid, this.state.token).then((response) => {
      if (response.data.status == 'Success') {
        this.state.value = result.data['device_list'][0]['status'] == '1' ? true : false;
      } else {
        ToastAndroid.showWithGravity(
          'Device is not Found',
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      }
    })
  }

  /* Save device id */
  saveDevice() {
    var status = '';
    if (this.state.value == true) {
      this.status = 1;
    } else {
      this.status = 0;
    }
    SignupServices.notification_save(this.state.loggedInUser.member_no, this.status, this.state.token).then((response) => {
      console.log(response);
      if (response.data.status == 'Success') {
        ToastAndroid.showWithGravity(
          'Notification is Enable',
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      } else {
        ToastAndroid.showWithGravity(
          'Notification is not Enable',
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      }
    })
  }


  render() {
    return (
      <View style={styles.dashstucontainer}>
        <View style={{ flexDirection: 'row', alignSelf: 'flex-end' }}>
          <View style={{ margin: 20, width: '70%' }}>
            <Text style={styles.textcenter} >Notification </Text>
          </View>
          <View style={{ margin: 20, alignSelf: 'flex-end', width: '30%' }}>
            <Switch style={{ alignSelf: 'flex-end', textAlign: 'right' }}
              value={this.state.value}
              onValueChange={(value) => this.setState({ value })}
              onPress={() => this.saveDevice()}
            />
          </View>
        </View>
      </View>
      );
  }
}

