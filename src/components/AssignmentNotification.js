import React, { Component } from 'react';
import { TouchableWithoutFeedback, Clipboard, Platform, TouchableOpacity, StyleSheet, Text, View, Button, SectionList, AsyncStorage, FlatList, Image, ScrollView, Alert, ToastAndroid } from 'react-native';
import TeacherServices from '../services/teacherServices';
import config from '../assets/json/config.json';
import styles from '../assets/css/mainStyle';
import { Actions } from 'react-native-router-flux';
import Share, { ShareSheet } from 'react-native-share';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Loader from './Loader';
import CheckBox from 'react-native-checkbox';
import DismissKeyboard from 'dismissKeyboard';
import base64 from 'base-64';
import HideableView from 'react-native-hideable-view';

export default class AssignmentNotification extends Component {
  constructor() {
    super();
    this.state = {
      showLoader: 0,
      studentList: [],
      loggedInUser: {},
      image_url: '',
      classid: 0,
      selectedStudent: [],
      assignmentId: 0
    }
  }

  async componentWillMount() {
    {/* Close keyboard */}
    DismissKeyboard();
    await AsyncStorage.getItem('app_token').then((value) =>
      this.setState({ "app_token": value })
    );
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    );

    await AsyncStorage.getItem('classid').then((value) =>
      this.setState({ "classid": value })
    )

    await AsyncStorage.getItem('assignmentId').then((value) =>
      this.setState({ "assignmentId": value })
    )
    /* Load the assignment student list */
    this.getAssignmentStudentList();
  }

  /* Get student list */
  getAssignmentStudentList() {
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    /* Call the function for get student list in teacher searvice */
    TeacherServices.getAssignmentStudentList(this.state.classid, this.state.app_token).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      objThis.setState({ 'studentList': response.data.details });
    });
  }

  /* Check student notification send or not */
  checkedOrNot(status, notification_status) {
    if (notification_status == 1 || status == 0) {
      return true;
    }
    else {
      return false;
    }
  }

   /* Select student by checkbox */
  selectStudent(student_no) {
    if (this.state.selectedStudent.indexOf(student_no) !== -1) {
      let ax = this.state.selectedStudent.indexOf(student_no);
      this.state.selectedStudent.splice(ax, 1);
      return false;
    }
    else {
      this.state.selectedStudent.push(student_no);
      return true;
    }
  }

   /* Send notification to the student */
  sendAssignmentNotification() {
    var noOfSelectedStu = (this.state.selectedStudent).length;
    if (!noOfSelectedStu) {
      ToastAndroid.showWithGravity(
        'Please select atleast one student',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return false;
    }
    var lists_value = base64.encode(JSON.stringify(this.state.selectedStudent));
    var dataParam = {
      sender_ac_no: this.state.loggedInUser.member_no,
      student_no: lists_value,
      assignment_id: (this.state.assignmentId),
      token: this.state.app_token
    }
    /* Call function in teacher services for send notification */
    TeacherServices.sendAssignmentNotification(dataParam).then(function (response) {
      if (response['data']['status'] == "Success") {
        ToastAndroid.showWithGravity(
          'Notification has been sent',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
         /* Move to assignment list page */
        Actions.AssignmentListTeacher();
      }
    });
  }

  render() {
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
              <View style={styles.dashcontainer}>
              {/* render the assignment student list */}
                <FlatList style={[styles.whitebackgrounnd, styles.padding]}
                  data={this.state.studentList}
                  renderItem={({ item }) =>
                    <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                      <View>
                        <HideableView visible={item.notification_status == 1 && item.status == 1} removeWhenHidden={true}>
                          <CheckBox label='' disabled={true} checked={true} />
                        </HideableView>

                        <HideableView visible={item.notification_status == 0 && item.status == 1} removeWhenHidden={true}>
                          <CheckBox label='' onChange={(checked) => objThis.selectStudent(item.student_no)} />
                        </HideableView>

                        <HideableView visible={item.notification_status == 0 && item.status == 0} removeWhenHidden={true}>
                          <CheckBox label='' disabled={true} checked={true} />
                        </HideableView>

                        {/* // (item.notification_status == 1 || item.status == 0) ?                          
                          // <CheckBox label='' disabled={true} checked={objThis.checkedOrNot(item.status,item.notification_status)} />
                          // :
                          // <TouchableOpacity style={styles.listviewclass}>
                          // <CheckBox label=''  onChange={(checked) => objThis.selectStudent(item.student_no)} />
                          // </TouchableOpacity> */}

                      </View>
                      <View >
                        {
                          item.status == 0 ?
                            <Text style={styles.listclassmargin} >{item.name} (Not Reg)</Text>
                            :
                            <Text style={styles.listclassmargin} >{item.name} </Text>
                        }
                      </View>
                    </View>
                  }
                  keyExtractor={(item, index) => index}
                />
                {/* Send notification */}
                <HideableView visible={this.state.selectedStudent.length < 1} removeWhenHidden={true}>
                  <View style={styles.saveattenbtn}>
                    <TouchableOpacity title="Send" onPress={() => this.sendAssignmentNotification()}>
                      <Text style={styles.attenbtntext}>Send</Text>
                    </TouchableOpacity>
                  </View>
                </HideableView>
              </View>
            </ScrollView>
        }
      </View>
    );
  }
}