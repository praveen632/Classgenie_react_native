import React, { Component } from 'react';
import { TextInput, TouchableHighlight, TouchableWithoutFeedback, Clipboard, Platform, TouchableOpacity, StyleSheet, Text, View, Button, SectionList, AsyncStorage, FlatList, Image, ScrollView, Alert, ToastAndroid, Picker, Modal } from 'react-native';
import TeacherServices from '../services/teacherServices';
import config from '../assets/json/config.json';
import styles from '../assets/css/mainStyle';
import { Actions } from 'react-native-router-flux';
import Loader from './Loader';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import HideableView from 'react-native-hideable-view';
import DismissKeyboard from 'dismissKeyboard';
import DatePicker from 'react-native-datepicker';
import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import Moment from 'moment';
import axios from 'axios';
var FormData = require('form-data');

export default class CreateAssignment extends Component {
  constructor() {
    super();
    this.state = {
      loggedInUser: {},
      showLoader: 0,
      assignmentList: [],
      title: '',
      fromDate: null,
      toDate: null,
      page_number: 1,
      modalVisible: false,
      total_submit_count: 0,
      classid: 0,
      classname: '',
      pdfName: '',
      uploadName: '',
      fileType: '',
      fileSize: '',
      section: '0',
    }
  }

  async componentWillMount() {
    /* Close keypad */
    DismissKeyboard();    
    Actions.refresh();
    /* Get local storage values */
    await AsyncStorage.getItem('app_token').then((value) =>
      this.setState({ "app_token": value })
    );
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    );
    await AsyncStorage.getItem('classid').then((value) =>
      this.setState({ "classid": value })
    )
    await AsyncStorage.getItem('classname').then((value) =>
      this.setState({ "classname": value })
    )
  }

/* Open Document picker for choosing assingment */
  chooseAssignment() {
    DocumentPicker.show({
      filetype: [DocumentPickerUtil.allFiles()],
    }, (error, res) => {
      this.setState({ pdfName: res.fileName })
      this.setState({ uploadName: res.uri })
      this.setState({ fileType: res.type })
      this.setState({ fileSize: res.fileSize })
      this.setState({ section: '1' })     
    });
  }

  /* Upload Assignment */
  onSubmitSearch() {
    if (this.state.section == '0') {
      var formatedDate = Moment(this.state.fromDate).format('YYYY-MM-DD');
      var data = {
        token: this.state.app_token,
        title: this.state.title,
        id: '',
        description: this.state.text,
        submition_date: formatedDate,
        class_id: this.state.classid,
        member_no: this.state.loggedInUser.member_no,
        sender_ac_no: this.state.loggedInUser.member_no
      }
      var objThis = this;
      /* Call function to upload assingment only text */
      TeacherServices.createAssignment(data).then(function (response) {
        objThis.setState({ "showLoader": 0 });
        if (response.data['status'] == "Success") {
          Actions.AssignmentListTeacher();
          ToastAndroid.showWithGravity(
            'Assignment created successfully.',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          );
        }
      });
    } else {
      /* Upload pdf file */
      var formatedDate = Moment(this.state.fromDate).format('YYYY-MM-DD');
      var obj = this;
      var url = config.api_url + ':' + config.port + '/assignment/post?token=' + config.api_token;
      var configHeader = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
      const formData = new FormData();
      formData.append('upload_file', { uri: this.state.uploadName, name: '1.pdf', type: this.state.fileType, chunkedMode: false });
      formData.append('member_no', this.state.loggedInUser.member_no);
      formData.append('sender_ac_no', this.state.loggedInUser.member_no);
      formData.append('class_id', this.state.classid);
      formData.append('title', this.state.title);
      formData.append('description', this.state.text);
      formData.append('submition_date', formatedDate);
      formData.append('token', this.state.app_token);
      return new Promise(resolve => {
        var obj = this;
        axios.post(url, formData, configHeader)
          .then(function (response) {
            resolve(response);
            ToastAndroid.showWithGravity(
              'Assignment created successfully.',
              ToastAndroid.LONG,
              ToastAndroid.CENTER
            );
            Actions.AssignmentListTeacher();
          }
          )
          .catch((error) => {
            console.error(error);
          });
      });
    }
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
              {/*START PAGE CONTAINER */}
              <View style={styles.dashcontainer} >
                <View style={[styles.whitebackgrounnd, styles.padding]} >
                  <View>
                    <TextInput style={styles.TextInputStyleClass} placeholder="Title" onChangeText={(value) => this.setState({ title: value })} value={this.state.title} />
                    <DatePicker
                      style={styles.createassigndate}
                      date={this.state.fromDate}
                      mode="date"
                      placeholder="MM/DD/YYYY"
                      format="MM/DD/YYYY"
                      confirmBtnText="Confirm"
                      cancelBtnText="Cancel"
                      customStyles={{
                        dateIcon: {
                          position: 'absolute',
                          left: 0,
                          top: 4,
                          marginLeft: 0
                        },
                        dateInput: {
                          marginLeft: 0
                        }
                      }}
                      onDateChange={(date) => { this.setState({ fromDate: date }) }}
                    />

                    <TextInput style={styles.TextInputStyleClass} textAlignVertical={'top'} placeholder="Description" maxLength={100} multiline={true} numberOfLines={4} onChangeText={(value) => this.setState({ text: value })}
                      value={this.state.text} />
                  </View>
                  <View>
                    <Text>{this.state.pdfName}</Text>
                  </View>
                  <View style={styles.saveattenbtn}>
                    <TouchableOpacity title="ChooseAssignment" onPress={() => this.chooseAssignment()}>
                      <Text style={styles.attenbtntext}>Choose Assignment</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.saveattenbtn}>
                    <TouchableOpacity title="Search" onPress={() => this.onSubmitSearch()}>
                      <Text style={styles.attenbtntext}>Submit</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </ScrollView>
        }
      </View>
    );
  }
}