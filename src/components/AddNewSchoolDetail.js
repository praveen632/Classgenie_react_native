import React, { Component } from 'react';
import { StyleSheet, Text, AsyncStorage, View, FlatList, TouchableOpacity, TouchableWithoutFeedback, Button, TextInput, Alert, ImageBackground, ToastAndroid, TouchableHighlight, Image } from 'react-native';
import { Actions, Tabs } from 'react-native-router-flux';
import AddNewSchoolService from '../services/AddNewSchoolService';
import styles from '../assets/css/mainStyle';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import DismissKeyboard from 'dismissKeyboard';
export default class AddNewSchoolDetail extends Component {
  constructor() {
    super();
    this.state = {
      teacher_list: {},
      loggedInUser: {}
    }
  }
  async componentWillMount() {
    DismissKeyboard();
    await AsyncStorage.getItem('school').then((value) =>
      this.setState({ 'teacher_list': JSON.parse(value) })
    );

    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    )

    var loggedInUser = this.state.loggedInUser;
    loggedInUser.school_id = this.state.teacher_list.school_id;
    AsyncStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
  }

  /* Check school teacher available or not */
  handleSubmit() {
    ToastAndroid.showWithGravity(
      'You are the first teacher',
      ToastAndroid.LONG,
      ToastAndroid.CENTER
    );
  }

  /* Header back button */
  _renderLeftHeader() {
    return (
      <View style={styles.Leftheaderstyle}>
        <TouchableWithoutFeedback onPress={() => Actions.pop()}>
          <View><FontAwesome style={styles.LeftheaderIconStyle}>{Icons.arrowLeft}</FontAwesome></View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  /* Move to other page Dashboard teacher */
  _renderRightHeader() {
    return (
      <View style={styles.Rightheaderstyle}>
        <TouchableWithoutFeedback onPress={() => Actions.DashboardTeacher()}>
          <View><Text style={styles.textcolor}>Skip</Text></View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  render() {
    return (
      <View >
        <View style={[styles.customHeaderContainer]}>
          {this._renderLeftHeader()}
          {this._renderRightHeader()}
        </View>
        <View style={styles.dashcontainer}>
          <Text style={styles.textcenter}>{this.state.teacher_list.school_name}</Text>
          <Text style={styles.textcenter}>You Are The First Teacher </Text>
          <View style={styles.classbtn}>
            <TouchableWithoutFeedback onPress={() => this.handleSubmit} title="Invite Other Teacher">
              <View>
                <Text style={styles.buttonText}>
                  Invite Other Teacher
               </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>
      </View>
    );
  }
}





