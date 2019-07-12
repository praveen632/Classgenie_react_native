import React, { Component } from 'react';
import { StyleSheet, Text, AsyncStorage, ToastAndroid, View, Button, TextInput, Alert, ScrollView, ImageBackground, TouchableHighlight, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import AddNewSchoolService from '../services/AddNewSchoolService';
import styles from '../assets/css/mainStyle';
import config from '../assets/json/config.json';
import Loader from './Loader';
import DismissKeyboard from 'dismissKeyboard';
export default class AddNewSchool extends Component {
  constructor() {
    super();
    this.state = {
      showLoader: 0,
      loggedInUser: {},
      teacher_list: {},
      userList: {},
      school_name: '',
      address: '',
      state: '',
      country: '',
      pin: '',
      phone: '',
      email: '',
      site: '',
      city: '',
    }
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  async componentWillMount() {
    DismissKeyboard();
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    )

    await AsyncStorage.getItem('app_token').then((value) =>
      this.setState({ "app_token": value })
    );
  }

  /* Add school */
  handleSubmit = () => {
    var obj = this;
    var param = {
      school_name: obj.state.school_name,
      address: obj.state.address,
      city: obj.state.city,
      state: obj.state.state,
      country: obj.state.country,
      pin: obj.state.pin.toString(),
      phone: obj.state.phone.toString(),
      email_id: obj.state.email,
      web_url: obj.state.site,
      member_no: obj.state.loggedInUser.member_no,
      token: this.state.app_token
    }
    /* Validation pattern for phone */
    var phoneno = /^\d{10}$/;
    /* Validation pattern for Allphabate */
    var letter = /^[a-zA-Z '.-]+$/;
    /* Validation pattern for zip */
    var isValidZip = /(^\d{5}$)|(^\d{5}-\d{4}$)/.test("90210");
    /* Validation pattern for email */
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    /* Validation for Name */
    if (!this.state.school_name.match(letter)) {
      ToastAndroid.showWithGravity(
        'Please Enter valid school Name',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }    
    else if (!this.state.state.match(letter)) {   /* Validation for state */
      ToastAndroid.showWithGravity(
        'Please Enter valid State',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER

      );
    }
    else if (!this.state.city.match(letter)) {   /* Validation for City */
      ToastAndroid.showWithGravity(
        'Please Enter valid city',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
    else if (!this.state.country.match(letter)) {   /* Validation for Country */
      ToastAndroid.showWithGravity(
        'Please Enter valid country',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
    else if (!re.test(String(this.state.email).toLowerCase())) {   /* Validation for Email */
      ToastAndroid.showWithGravity(
        'Please Enter valid School Email',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
    else if (!this.state.phone.match(phoneno)) {  /* Validation for Phone */
      ToastAndroid.showWithGravity(
        'Mobile Number must be 10 digits',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }else {
      var objThis = this;
      objThis.setState({ "showLoader": 0 });
      /* Call the add new school service for add school */
      AddNewSchoolService.addSchool(param).then(function (response) {
        objThis.setState({ "showLoader": 0 });
        if (response.data.status == 'Failure') {
          alert('School is Already Registered');
        }
        else if (response.data.status == 'Success') {
          AsyncStorage.setItem('school', JSON.stringify(response['data']['teacher_list'][0]));
          obj.approveSchool(response['data']['teacher_list'][0]);
          /* Move the add new school details page */
          Actions.AddNewSchoolDetail();
        }
      })
    }
  }

  /* Approve School */
  approveSchool(data) {
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    AddNewSchoolService.approveSchool(this.state.api_token, data.school_name, this.state.loggedInUser.name).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      if (response.data.status == 'Success') {
        return true;
      }
    });
  }

  render() {
    return (
      <View style={styles.storycontainer}>
        <ScrollView style={styles.signupscrollstyle} contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }} keyboardShouldPersistTaps="handled" >
          <View style={{ width: '100%' }}>
            <View style={[styles.whitebackgrounnd, styles.padding]}>
              <TextInput style={styles.profileinput} ref={input => { this.textInput = input }}
                placeholder="School Name" onChangeText={(text) => this.setState({ school_name: text })}
              />
              <TextInput style={styles.profileinput} ref={input => { this.textInput = input }}
                placeholder="School Name Address"  onChangeText={(text) => this.setState({ address: text })}
              />
              <TextInput style={styles.profileinput} ref={input => { this.textInput = input }}
                placeholder="City " onChangeText={(text) => this.setState({ city: text })}
              />
              <TextInput style={styles.profileinput} ref={input => { this.textInput = input }}
                placeholder="State" onChangeText={(text) => this.setState({ state: text })}
              />
              <TextInput style={styles.profileinput} ref={input => { this.textInput = input }}
                placeholder="Country" onChangeText={(text) => this.setState({ country: text })}
              />
              <TextInput style={styles.profileinput} ref={input => { this.textInput = input }}
                placeholder="Pin Code" onChangeText={(text) => this.setState({ pin: text })}
              />
              <TextInput style={styles.profileinput} ref={input => { this.textInput = input }}
                placeholder="Phone " onChangeText={(text) => this.setState({ phone: text })}
              />
              <TextInput style={styles.profileinput} ref={input => { this.textInput = input }}
                placeholder="Email" onChangeText={(text) => this.setState({ email: text })}
              />
              <TextInput style={styles.profileinput} ref={input => { this.textInput = input }}
                placeholder="School website" onChangeText={(text) => this.setState({ site: text })}
              />
              <TouchableHighlight
                style={styles.classbtn}
                title="Save School" onPress={this.handleSubmit} >
                <Text style={styles.buttonText}>Save School</Text>
              </TouchableHighlight>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}


