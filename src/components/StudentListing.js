import React, { Component } from 'react';
import { TouchableWithoutFeedback, TouchableOpacity, StyleSheet, Text, View, Image, Button, AsyncStorage, ScrollView, FlatList, TextInput, ToastAndroid, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import TeacherServices from '../services/teacherServices';
import config from '../assets/json/config.json';
import styles from '../assets/css/mainStyle';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Loader from './Loader';
import DismissKeyboard from 'dismissKeyboard';

export default class StudentListing extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: 0,
      loggedInUser: {},
      studentList: [],
      classid: '',
      student_name: '',
    }
  }

  async componentDidMount() {
    /* Close keypad */
    DismissKeyboard();
    /* Get Local storage values  */
    await AsyncStorage.getItem('app_token').then((value)=> 
      this.setState({"app_token": value})
    );
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    )
    await AsyncStorage.getItem('classid').then((value) =>
      this.setState({ "classid": value })
    )
    /* Get student list on the time to page load */
    this.getStudentList();

  }

  /* Go to class room page */
  _handleBack() {
    Actions.ClassRoom();
  }  

  /* Back button on left side header */
  _renderLeftHeader() {
    return (
      <View style={styles.Leftheaderstyle}>
        <TouchableWithoutFeedback onPress={() => this._handleBack() }>         
          <View><FontAwesome style={styles.LeftheaderIconStyle}>{Icons.times}</FontAwesome></View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  /* Middle content in header middle */
  _renderMiddleHeader() {
    return (
      <View style={styles.MiddleheaderstyleLeft}>
        <Text style={styles.MiddleHeaderTitlestyle}>{this.props.title}</Text>
      </View>
    )
  }

  /* Get student list */
  getStudentList() {
    var objThis = this;
    this.setState({ "showLoader": 0 });
    TeacherServices.getStudentList(this.state.classid,this.state.app_token).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      objThis.setState({ 'studentList': response.data.class_details.student_list });
    });
  }

  /* Edit student to move other page  */
  openEditStudent(stu_id, stu_name, stu_image) {
    Actions.EditStudent({ stu_id: stu_id, stu_name: stu_name, stu_image: stu_image })
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
          <ScrollView>
            {/* Start header part */}
          <View style={[styles.customHeaderContainer]}>
            {this._renderLeftHeader()}
            {this._renderMiddleHeader()}
          </View>

            <View style={styles.dashcontainer}>
              <FlatList
                data={this.state.studentList}
                renderItem={({ item }) =>

                  <TouchableOpacity style={styles.addgstyle} onPress={() => this.openEditStudent(item.id, item.name, item.image)}>
                    <Image style={{ flexWrap: 'wrap', width: 32, height: 32 }} source={{ uri: imagePath + 'assets/student/' + item.image }} />
                    <View style={{ flexWrap: 'wrap' }}>
                      <Text style={styles.listviewmargin} >{item.name}</Text>
                    </View>
                  </TouchableOpacity>
                }
                keyExtractor={(item, index) => index}
              />
            </View>
          </ScrollView>
        }
        </View>
    );
  }
}