import React, { Component } from 'react';
import { TouchableWithoutFeedback, TouchableHighlight, StyleSheet, Text, View, Image, Button, AsyncStorage, ScrollView, FlatList, TextInput, ToastAndroid, Alert, Picker, Modal } from 'react-native';
import { Actions } from 'react-native-router-flux';
import config from '../assets/json/config.json';
import styles from '../assets/css/mainStyle';
import Swiper from 'react-native-swiper';
import DismissKeyboard from 'dismissKeyboard';

export default class ManualSlide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: {},
      skipManual: null
    }
  }

  async componentWillMount() {
    /* Close keypad */
    DismissKeyboard();
   /* Get local storage values */
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    )
  }

  /* Skip in click event */
  skipManual() {
    AsyncStorage.setItem('skipManual', "1");
    if (this.state.loggedInUser) {
      var userType = this.state.loggedInUser.type;
      var status = this.state.loggedInUser.status;
      if (userType == 1 || userType == 2 || userType == 5) {
        Actions.DashboardTeacher();
      }
      else if (userType == 3) {
        Actions.ClassStoryParent();
      }
      else if (userType == 4) {
        Actions.DashboardStudent();
        if (status == '0') {
          ToastAndroid.showWithGravity(
            'Account not verified',
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
        }
      }
    }

  }

  render() {
    var imagePath = config.image_url;
    var objThis = this;
    var server_path = config.server_path;
    return (
      <Swiper>
        <View style={styles.slide1}>
          <Image source={{ uri: server_path + 'assets/images/first_slider.png' }} />
          <Text style={styles.manaultext}>Manage your classroom</Text>
          <Text style={styles.manualwhite}> Join your school to manage entire classroom.  Add students to maintain performance and attendance records.</Text>
          <TouchableWithoutFeedback onPress={() => this.skipManual()}>
            <View style={styles.classbtn}>
              <Text style={styles.buttonText}>SKIP TUTORIAL</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.slide2}>
          <Image source={{ uri: server_path + 'assets/images/second_slider.png' }}  />
          <Text style={styles.manaultext}>Share the Stories</Text>
          <Text style={styles.manualwhite}>Share the special moment of your classroom or school level activities as images or videos with parents and students.</Text>
          <TouchableWithoutFeedback onPress={() => this.skipManual()}>
            <View style={styles.classbtn}>
              <Text style={styles.buttonText}>SKIP TUTORIAL</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.slide3}>
          <Image  source={{ uri: server_path + 'assets/images/third_slider.png' }}  />
          <Text style={styles.manaultext}>Make Communication Easier</Text>
          <Text style={styles.manualwhite}> No need to wait for parent-teacher meetings,always keep in touch with the parents through message.</Text>
          <TouchableWithoutFeedback onPress={() => this.skipManual()}>
            <View style={styles.classbtn}>
              <Text style={styles.buttonText}>SKIP TUTORIAL</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.slide4}>
          <Image source={{ uri: server_path + 'assets/images/four_slider.png' }}  />
          <Text style={styles.manaultext}>Keep Track of your Task</Text>
          <Text style={styles.manualwhite}> Never miss any assignment, Stay up-to-date about the assigned task, get notified & view the scored grades as well.</Text>
          <TouchableWithoutFeedback onPress={() => this.skipManual()}>
            <View style={styles.classbtn}>
              <Text style={styles.buttonText}>SKIP TUTORIAL</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <View style={styles.slide5}>
          <Image source={{ uri: server_path + 'assets/images/five_slider.png' }}  />
          <Text style={styles.manaultext}>Keep in touch with all events</Text>
          <Text style={styles.manualwhite}>Get aware about all the school's event, be a part of it as volunteer. Get instant information about all the changes.</Text>
          <TouchableWithoutFeedback onPress={() => this.skipManual()}>
            <View style={styles.classbtn}>
              <Text style={styles.buttonText}>Go to Dashboard</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        </Swiper>
    );

  }
}
