import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert, TouchableHighlight, ListView, ScrollView, FlatList, Modal, AsyncStorage, Image } from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from '../assets/css/mainStyle';
import joinYourSchoolServices from '../services/joinYourSchoolServices';
import Loader from './Loader';
import config from '../assets/json/config.json';
import DismissKeyboard from 'dismissKeyboard';

export default class JoinYourSchool extends Component {
  constructor() {
    super();
    this.state = {
      showLoader: 0,
      schoolList: {},
      loggedInUser: {},
      member_no: {},
      school_list: '',
      modalVisible: false,
      school_id: {},
      searchTerm: ''
    }
  }

  async componentDidMount() {
    /* Close keypad */
    DismissKeyboard();
    /* Get local storage values */
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    );

    await AsyncStorage.getItem('app_token').then((value) =>
      this.setState({ "app_token": value })
    );
    /* Get schoo list on time to load page */
    this.getSchoolList();
    AsyncStorage.setItem('school_id', '');
    AsyncStorage.setItem('school_name', '');
  }
  /* School List for teacher to select any one of them */
  getSchoolList() {
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    joinYourSchoolServices.getSchoolList(this.state.app_token, this.state.loggedInUser.member_no).then((response) => {
      objThis.setState({ "showLoader": 0 });
      objThis.setState({ 'schoolList': response.data.school_list });
    })
  }

  /* School List search by  teacher to select any one of them or Add new one */
  SearchFilterFunction(text) {
    this.setState({ "searchTerm": text })
    joinYourSchoolServices.SearchFilterFunction(this.state.app_token, text).then((response) => {
      if (response.data.status == "Success") {
        this.setState({ 'schoolList': response.data.school_list });
      } else {
        throw new Error('Server Error!');
      }
    })
  }

  /* If teacher not join school then move teacher deshboard */
  handleSubmit() {
    Actions.DashboardTeacher();
  }

  /* School choose by  teacher and see all other teacher's list of their related teacher */
  schoolSelect(school_id, school_name, school_address) {
    Actions.ChooseSchool({ school_name: school_name, address: school_address, school_id: school_id })
  }

  render() {
    return (
      <View style={styles.storycontainer}>
        <ScrollView style={styles.signupscrollstyle} contentContainerStyle={{
          justifyContent: 'center',
          alignItems: 'center',
        }} keyboardShouldPersistTaps="handled">
          <View style={{ width: '100%' }}>
            <View style={[styles.whitebackgrounnd, styles.padding]}>
             {/* Search school */}
              <TextInput style={styles.TextInputStyleClass}
                onChangeText={(text) => this.SearchFilterFunction(text)}
                underlineColorAndroid='transparent'
                placeholder="Search Here"
              />
              <FlatList
                data={this.state.schoolList}
                renderItem={
                  ({ item }) =>
                    <View style={styles.whitebackgrounnd}>
                      <View style={styles.listviewclass} >
                        <View style={{ flexWrap: 'wrap' }}>
                          <Text style={styles.listviewmargin} onPress={() => this.schoolSelect(item.school_id, item.school_name, item.address)}> <Image style={{ width: 50, height: 50 }} /> {item.school_name}</Text>
                        </View>
                      </View>
                    </View>
                }
                keyExtractor={(item, index) => index}
              />
              {this.state.searchTerm == '' ? <Text ></Text> : <Text style={styles.textchange} onPress={() => Actions.AddNewSchool()}>Add School</Text>}
              <TouchableHighlight
                style={styles.classbtn}
                title="I am not in school" onPress={this.handleSubmit} >
                <Text style={styles.buttonText}>I am not in school</Text>
              </TouchableHighlight>
            </View>
          </View>
        </ScrollView>
      </View>
      );
  }
}