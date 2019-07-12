import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Button, AsyncStorage, TouchableHighlight, ScrollView, FlatList, TextInput, ToastAndroid, Alert, TouchableWithoutFeedback } from 'react-native';
import { Actions } from 'react-native-router-flux';
import base64 from 'base-64';
import TeacherServices from '../services/teacherServices';
import config from '../assets/json/config.json';
import styles from '../assets/css/mainStyle';
import Loader from './Loader';
import DismissKeyboard from 'dismissKeyboard';

export default class addGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: 0,
      loggedInUser: {},
      studentList: [],
      selectedStudent: [],
      studentListOfGroup: [],
      classid: '',
      group_name: '',
      strStudentList: 'Student List',
      groupId: 0
    }
  }

  async componentDidMount() {
     /* Close keypad */
    DismissKeyboard();
    await AsyncStorage.getItem('app_token').then((value)=> 
      this.setState({"app_token": value})
    );
    
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    )
    await AsyncStorage.getItem('classid').then((value) =>
      this.setState({ "classid": value })
    )

    this.setState({ "groupId": this.props.group_id })
    this.setState({ "group_name": this.props.group_name })

    if (this.state.groupId) {
      Actions.refresh({ title: 'Edit Group' });
      this.getStudentListOfGroup();
    }
    this.getStudentList();
  }

  /* Get student list */
  getStudentList() {
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    /* Call the teacher service for get student list */
    TeacherServices.getStudentList(this.state.classid,this.state.app_token).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      objThis.setState({ 'studentList': response.data.class_details.student_list });
    });
  }

  /* Get student list for group */
  getStudentListOfGroup() {
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    TeacherServices.getStudentListOfGroup(this.state.classid, this.state.groupId,this.state.app_token).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      objThis.setState({ 'studentListOfGroup': response.data.student_info });
      /* Set the previous selected student */
      for (let i = 0; i < (objThis.state.studentListOfGroup).length; i++) {
        objThis.selectStudent(objThis.state.studentListOfGroup[i].student_no);
      }
    });
  }


  /* Add group */
  addGroup() {
    var objThis = this;
    if (!this.state.group_name) {
      ToastAndroid.showWithGravity(
        'Please Enter Group Name',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER      
      );
      return false;
    }
   
    if ((this.state.selectedStudent).length < 2) {
      ToastAndroid.showWithGravity(
        'Add more than one students to the group',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER      
      );
      return false;
    }
    var groupdata = [];
    /* if there is group id then need to update else create the group */
    if (this.state.groupId) {
      var groupApiUrl = '/groupinfo/update';
      var successMessage = 'Group Updated Successfully!';
    }
    else {
      var groupApiUrl = '/groupinfo/addgroup';
      var successMessage = 'Group Created Successfully!';
    }
    for (let i = 0; i < (this.state.selectedStudent).length; i++) {
      if (this.state.groupId) {
        groupdata.push({ 'class_id': this.state.classid, 'student_no': this.state.selectedStudent[i], 'group_name': this.state.group_name, 'group_id': this.state.groupId });
      }
      else {
        groupdata.push({ 'class_id': this.state.classid, 'student_no': this.state.selectedStudent[i], 'group_name': this.state.group_name });
      }
    }
    var lists_value = base64.encode(JSON.stringify(groupdata));
    objThis.setState({ "showLoader": 0 });
    TeacherServices.addGroup(lists_value, groupApiUrl,this.state.app_token).then(function (resp) {
      objThis.setState({ "showLoader": 0 });
      Actions.ClassRoom({ 'currentTab': 'group' });
      if (resp['data']['status'] == "Success") {
        ToastAndroid.showWithGravity(
          successMessage,
          ToastAndroid.SHORT,
          ToastAndroid.CENTER        
        );
      }
      else {
      ToastAndroid.showWithGravity(
        'Group Name already exists!',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER      
      );
      }
    });

  }

  /* Select student number */
  selectStudent(student_no) {
    var strStudentList = '';
    if (this.state.selectedStudent.indexOf(student_no) !== -1) {
      let ax = this.state.selectedStudent.indexOf(student_no);
      this.state.selectedStudent.splice(ax, 1)
    }
    else {
      this.state.selectedStudent.push(student_no);
    }

    for (let i = 0; i < (this.state.studentList).length; i++) {
      if (this.state.selectedStudent.indexOf(this.state.studentList[i].student_no) !== -1) {
        strStudentList += ", " + this.state.studentList[i].name;
      }
    }
    if(strStudentList){
      strStudentList =  strStudentList.substr(1);
    }else{
      strStudentList = "Student List";
    }

    this.setState({ "strStudentList": strStudentList });
    this.getStudentList();

  }

  /* change css class */
  getSelectedStyle(student_no) {
    if (this.state.selectedStudent.indexOf(student_no) !== -1) {
      return [styles.addgstyle, styles.backgray];
    }
    else {      
      return [styles.addgstyle];
    }
  }

  render() {
    var imagePath = config.image_url;
    return (
      <View>
      {/* Show the loader when data is loading else show the page */}
      {
        this.state.showLoader == 1 ?
          <View style={styles.loaderContainer}>
            <Loader />
          </View>
        :
        <ScrollView style={styles.dashcontainer} keyboardShouldPersistTaps="handled">
        <View style={{ backgroundColor: '#fff' }}>
          <TextInput style={styles.mar10} placeholder="Group Name" onChangeText={(group_name) => this.setState({ group_name: group_name })} value={this.state.group_name} />
          <Text style={styles.mar10}  >{this.state.strStudentList}</Text>  
          <TouchableHighlight style={styles.classbtn} title="Save Changes" onPress={() => this.addGroup()}>
            <Text style={styles.buttonText}>
              Save Changes
            </Text>
          </TouchableHighlight>
        </View>
        <FlatList
          data={this.state.studentList}
          renderItem={
            ({ item }) =>
              <TouchableWithoutFeedback onPress={() => this.selectStudent(item.student_no)} >
                <View style={this.getSelectedStyle(item.student_no)} >
                  <Image source={{ uri: imagePath + 'assets/student/' + item.image }}
                    style={{ flexWrap: 'wrap', width: 32, height: 32 }}
                  />
                  <View style={{ flexWrap: 'wrap' }}>
                    <Text style={styles.listviewmargin}>{item.name} </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
          }
          keyExtractor={(item, index) => index}
        />
      </ScrollView>
      }
      </View>
    );
  }
}