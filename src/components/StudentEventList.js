import React, { Component } from 'react';
import {
  TouchableHighlight, TouchableWithoutFeedback, Clipboard, Platform, TouchableOpacity, StyleSheet, Text, View, Button, SectionList, AsyncStorage, FlatList, Image, ScrollView, Alert, ToastAndroid, Picker, Modal, TextInput
} from 'react-native';
import { Actions, Tabs } from 'react-native-router-flux';
import ParentEventService from '../services/ParentEventService';
import config from '../assets/json/config.json';
import styles from '../assets/css/mainStyle';
import Share, { ShareSheet } from 'react-native-share';
import Loader from './Loader';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import HideableView from 'react-native-hideable-view';
import DismissKeyboard from 'dismissKeyboard';

export default class ParentEventList extends Component {
  constructor() {
    super();
    this.state = {
      loggedInUser: {},
      showLoader: 0,
      eventList: {},
      eventSource: '',
      modalVisible: false,
      displaySchedule: 0,
      displayResponsibility: 0,
      startDateArray: [],
      endDateArray: [],
      school_details:[],      
    }
  }

    async componentWillMount() {
      /* Close keypad */
      DismissKeyboard();      
      /* Get local storage values */
      await AsyncStorage.getItem('app_token').then((value) =>
        this.setState({ "app_token": value })
      );
      await AsyncStorage.getItem('loggedInUser').then((value) =>
        this.setState({ "loggedInUser": JSON.parse(value) })
      );  
      /* Load All the event list on page load */
      await this.eventSchoolDetail();
    }

  /* calling api for school list */
  eventSchoolDetail() {
    var objThis = this;
    ParentEventService.eventParentschool(this.state.app_token, this.state.loggedInUser.member_no).then(function (response) {
      objThis.setState({ 'schoolName': response.data.school_name });     
      if (response.data.status == 'Failure') {
        alert('school is not  found');
      }
      else if (response.data.status == 'Success') {        
         objThis.setState({ 'school_details': response.data.school_name });
         objThis.setState({ 'school_id': response.data.school_name['0']['school_id']});       
         objThis.getEventList()
      }     
    });   
}                          

  /*function for event list here.........................*/  
   getEventList(school_id){
    var objThis = this;
    ParentEventService.getEvent(this.state.app_token,this.state.school_id,this.state.page_number,this.state.source).then(function (response) {
     if (response.data['status'] == "Success") {      ;
        objThis.setState({ 'eventList': response.data.event_details});
      }  
     });
   }

  render() { 
    return (
    <ScrollView>
        <View style={styles.dashcontainer} >
            <View style={styles.eventselect}>
              <View style={styles.selecttype} >
                <Text>Select Event Type</Text>
              </View>
              {/* Dropdown for seaching */}
              <View style={[styles.selectbottomborder, styles.divide]}>
                <Picker selectedValue={this.state.eventSource} onValueChange={(itemValue, itemIndex) => this.changeEventSource(itemValue)}>
                  <Picker.Item label="All Event" value="" />
                  <Picker.Item label="Ongoing" value="ongoing" />
                  <Picker.Item label="Upcomming" value="upcomming" />
                  <Picker.Item label="Previous" value="previous" />
                </Picker>
              </View>
            </View>
              <FlatList
              data={this.state.eventList}
              renderItem={({ item }) =>
                <View style={styles.eventliststyle}>
                  <Text style={styles.eventlistcolor} >{item.event_list[0].event_name}</Text>
                  <View style={{ padding: 10, }}>
                  <Text>Description: {item.event_list[0].description}</Text>
                  <Text>Start Date: {item.start_date1}</Text>
                  <Text>End Date: {item.end_date1}</Text>
                  <Text>Volunteers: {item.end_date1}</Text>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                  </View>
                </View>
              }
              keyExtractor={(item, index) => index}
            />
              </View>
        </ScrollView>      
    );
  }
}