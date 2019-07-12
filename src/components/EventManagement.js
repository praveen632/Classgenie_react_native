import React, { Component } from 'react';
import { TouchableHighlight, TouchableWithoutFeedback, Clipboard, Platform, TouchableOpacity, StyleSheet, Text, View, Button, SectionList, AsyncStorage, FlatList, Image, ScrollView, Alert, ToastAndroid, Picker, Modal } from 'react-native';
import TeacherServices from '../services/teacherServices';
import config from '../assets/json/config.json';
import styles from '../assets/css/mainStyle';
import { Actions } from 'react-native-router-flux';
import Share, { ShareSheet } from 'react-native-share';
import Loader from './Loader';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import HideableView from 'react-native-hideable-view';
import DismissKeyboard from 'dismissKeyboard';

export default class EventManagement extends Component {

  constructor() {
    super();
    this.state = {
      loggedInUser: {},
      showLoader: 0,
      eventList: [],
      eventSource: '',
      modalVisible: false,
      displaySchedule: 0,
      displayResponsibility: 0,
      startDateArray: [],
      endDateArray: [],
      responsibiltyList: []
    }
  }

  async componentWillMount() {
    /* Close Keypad */
    DismissKeyboard();
    Actions.refresh();
    /* Get local storage values */
    await AsyncStorage.getItem('app_token').then((value) =>
      this.setState({ "app_token": value })
    );
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    );

    /* Load All the event list on page load */
    this.getEventList();

  }

  /* Display left header back button */
  _renderLeftHeader() {
    return (
      <View style={styles.Leftheaderstyle}>
        <TouchableOpacity onPress={() => Actions.pop()}>
          <FontAwesome style={styles.headerfont}>{Icons.times}</FontAwesome>
        </TouchableOpacity>
      </View>
    )
  }

  /* Display header middle content */
  _renderMiddleHeader() {
    return (
      <View style={styles.Middleheaderstyle}>
        <Text style={styles.MiddleHeaderTitlestyle}>{this.props.title}</Text>
      </View>
    )
  }

  /* Add event button in right side in header */
  _renderRightHeader() {
    return (
      <View style={styles.Rightheaderstyle}>
        <TouchableOpacity style={{ paddingRight: 10 }} onPress={() => { Actions.AddEvent() }}  >
          <Text style={styles.textright}><FontAwesome style={styles.headerfont}>{Icons.plusCircle}</FontAwesome></Text>
        </TouchableOpacity>
      </View>
    )
  }

  /* Get event list */
  getEventList() {
    var objThis = this;
    this.setState({ "showLoader": 0 });
    /* Call function in teacher service to get event list */
    TeacherServices.getEventList(this.state.loggedInUser.school_id, this.state.loggedInUser.member_no, this.state.eventSource, this.state.app_token).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      if (response.data['status'] == "Success") {
        objThis.setState({ 'eventList': response.data['event_details'] });
      }
    });
  }

  /* Filter in event data */
  changeEventSource(itemValue) {
    this.setState({ eventSource: itemValue }, () => { this.getEventList() });
  }

  /* Get schedule list */
  showSchedule(event_id) {
    var objThis = this;
    /* Call function in teacher services to get event shedule details */
     TeacherServices.getSchedule(event_id, this.state.app_token).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      if (response.data['status'] == "Success") {
        let responsedata = response.data['date_time_list'][0];        
        let startDateArray = responsedata.start_date.split(' ', 4);
        let endDateArray = responsedata.end_date.split(' ', 4);
        objThis.setState({ "displaySchedule": 1, "displayResponsibility": 0, "startDateArray": startDateArray, "endDateArray": endDateArray }, () => { objThis.openModel() });
      }
    });
  }

  /* Show responsibilty */
  showResponsibility(event_id) {
    var objThis = this;   
    TeacherServices.getResponsibiltyList(event_id, this.state.app_token).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      if (response.data['status'] == "Success") {
        objThis.setState({ "displaySchedule": 0, "displayResponsibility": 1, responsibiltyList: response.data['responsibilty_list'] }, () => { objThis.openModel() });
      }
    });
  }

  /* Open modal */
  openModel() {
    this.setState({ modalVisible: true });
  }

 /* Close modal */
  closeModal() {
    this.setState({ modalVisible: false });
  }

   /* Remove event confirmation box */
  removeEventCnf(event_id) {
    var objThis = this;   
    Alert.alert(
      '',
      'Would you like to remove this Event ?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => objThis.removeEvent(event_id) },
      ],
    );

  }

   /* Remove event */
  removeEvent(event_id) {
    var objThis = this;
    var dataParam = {
      token: objThis.state.app_token,
      id: event_id.toString()
    }
     /* Call function to teacher services to remove event */
    TeacherServices.deleteEvent(dataParam).then(function (resp) {    
      if (resp['data']['status'] == "Success") {        
        ToastAndroid.showWithGravity(
          'Event Removed successfully.',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
        objThis.getEventList();
      } else {
        ToastAndroid.showWithGravity(
          'Unable to remove Event. Please try again later',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      }
    });
  }

  render() {
    console.log(this.state.eventList);
    var imagePath = config.image_url;
    var server_path = config.server_path;
    var objThis = this;
    return (
      <View>
        {/* Show the loader when data is loading else show the page */}
        {
          this.state.showLoader == 1 ?
            <View style={styles.loaderContainer}>
              <Loader />
            </View>
            :
            <ScrollView>
              {/*HEADER PART*/}
              <View style={[styles.customHeaderContainer]}>
                {this._renderLeftHeader()}
                {this._renderMiddleHeader()}
                {this._renderRightHeader()}
              </View>
              {/*START PAGE CONTAINER */}
              <View style={styles.dashcontainer} >
                <View style={styles.eventselect}>
                  <View style={styles.selecttype} >
                    <Text>Select Event Type</Text>
                  </View>
                  <View style={[styles.selectbottomborder, styles.divide]}>
                    <Picker selectedValue={this.state.eventSource} onValueChange={(itemValue, itemIndex) => this.changeEventSource(itemValue)}>
                      <Picker.Item label="All Event" value="" />
                      <Picker.Item label="Ongoing" value="ongoing" />
                      <Picker.Item label="Upcomming" value="upcomming" />
                      <Picker.Item label="Previous" value="previous" />
                    </Picker>
                  </View>
                </View>
                {/* Start Event listing*/}
                <HideableView visible={this.state.eventList.length < 1} removeWhenHidden={true}>
                  <Text>No Event Available Yet !</Text>
                </HideableView>
                <FlatList
                  data={this.state.eventList}
                  renderItem={({ item }) =>

                    <View style={styles.eventliststyle}>
                      <Text style={styles.eventlistcolor} >{item.event_list[0].event_name}</Text>
                      <View style={{ padding: 10, }}>
                        <Text>Description: {item.event_list[0].description}</Text>
                        <Text>Number of volunteers: ({item.total_volunteer_count}/{item.event_list[0].no_of_volunteer})</Text>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <View style={styles.eventbtnstyle}>
                          <View style={styles.invitebtn}>
                            <TouchableWithoutFeedback title="Schedule">
                              <View>
                                <Text style={styles.EventText} onPress={() => objThis.showSchedule(item.event_list[0].id)}>Schedule</Text>
                              </View>
                            </TouchableWithoutFeedback>
                          </View>
                        </View>
                        <View style={styles.eventbtnstyle}>
                          <View style={styles.invitebtn}>
                            <TouchableWithoutFeedback title="Responsibility">
                              <View>
                                <Text style={styles.EventText} onPress={() => objThis.showResponsibility(item.event_list[0].id)}>Responsibility</Text>
                              </View>
                            </TouchableWithoutFeedback>
                          </View>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                        <TouchableHighlight style={styles.eventsendbtn} title="Ok" onPress={() => Actions.EventNotification({ 'school_id': item.event_list[0].school_id })}>
                          <Text style={styles.buttonText}><FontAwesome>{Icons.bell}</FontAwesome> Send</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.ebventeditbtn} title="Edit"
                          onPress={() => Actions.EditEvent({ 'event_id': item.event_list[0].id, 'eventName': item.event_list[0].event_name, 'event_desc': item.event_list[0].description, 'event_volunteer': item.event_list[0].no_of_volunteer, 'event_response': item.event_list[0].volunteer_responsibility, 'startDate': item.start_date, 'endDate': item.end_date, 'start_time': item.start_date1, 'end_time': item.end_date1 })}>
                          <Text style={styles.buttonText}><FontAwesome>{Icons.pencil}</FontAwesome> Edit</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.eventdeletebtn} title="Cancel" onPress={() => this.removeEventCnf(item.event_id)}>
                          <Text style={styles.buttonText}> <FontAwesome>{Icons.trash}</FontAwesome> Delete</Text>
                        </TouchableHighlight>
                      </View>
                    </View>
                  }
                  keyExtractor={(item, index) => index}
                />
                {/* End Event listing*/}
              </View>
              {/*Start for schedule and responsibility model popup */}
              <Modal transparent={true} visible={this.state.modalVisible} animationType={'slide'} onRequestClose={() => this.closeModal()} >
                <View style={styles.modelContainer} >
                  <ScrollView>
                    <HideableView visible={this.state.displaySchedule} removeWhenHidden={true}>
                      <View style={{ backgroundColor: 'rgba(224, 219, 219, 0.9)', marginBottom: 15, padding: 10, margin: 20, justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'center', marginBottom: 10, color: '#000000e6' }} > Event Schedule </Text>
                        <View style={{ borderWidth: .7, borderColor: '#ddd', padding: 10, backgroundColor: '#fff' }}>
                          <Text>Start Date: {this.state.startDateArray[0]} {this.state.startDateArray[1]} {this.state.startDateArray[2]}</Text>
                          <Text>Start Time: {this.state.startDateArray[3]}</Text>
                          <Text>End Date: {this.state.endDateArray[0]} {this.state.endDateArray[1]} {this.state.endDateArray[2]}</Text>
                          <Text>End Time: {this.state.endDateArray[3]}</Text>
                        </View>
                      </View>
                    </HideableView>
                    <HideableView visible={this.state.displayResponsibility} removeWhenHidden={true}>
                      <View style={{ backgroundColor: 'rgba(224, 219, 219, 0.9)', marginBottom: 15, padding: 10, margin: 20, justifyContent: 'center' }}>
                        <Text style={{ textAlign: 'center', marginBottom: 10, color: '#000000e6' }} > Responsibility List</Text>
                        <View style={{ borderWidth: .7, borderColor: '#ddd', padding: 10, backgroundColor: '#fff' }}>
                          {
                            this.state.responsibiltyList.map(function (item, key) {
                              return (
                                <Text style={[styles.borderbottomstyle, styles.paddingBottomevent]} key={key} >{item.responsibilty}</Text>
                              )
                            })
                          }
                          <HideableView visible={this.state.responsibiltyList.length < 1} removeWhenHidden={true}>
                            <Text>No responsiblity added</Text>
                          </HideableView>
                        </View>
                      </View>
                    </HideableView>
                    <ScrollView>
                      <View style={styles.dashcontainer}>
                        <View style={{ flexDirection: 'row' }}>
                          <TouchableHighlight style={styles.attensavebtn} title="Cancel" onPress={() => this.closeModal()}>
                            <Text style={styles.buttonText}>Close</Text>
                          </TouchableHighlight>
                        </View>
                      </View>
                    </ScrollView>
                  </ScrollView>
                </View>
              </Modal>
              {/*End for for schedule and responsibility model popup */}
            </ScrollView>
        }
      </View>
    );
  }
}