import React, { Component } from 'react';
import { TouchableWithoutFeedback, TouchableOpacity, StyleSheet, Text, View, Image, Button, AsyncStorage, TouchableHighlight, ScrollView, FlatList, TextInput, ToastAndroid, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import TeacherServices from '../services/teacherServices';
import config from '../assets/json/config.json';
import styles from '../assets/css/mainStyle';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Loader from './Loader';
import DismissKeyboard from 'dismissKeyboard';

export default class AddStudent extends Component {
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
    DismissKeyboard();
    await AsyncStorage.getItem('app_token').then((value) =>
      this.setState({ "app_token": value })
    );
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    )
    await AsyncStorage.getItem('classid').then((value) =>
      this.setState({ "classid": value })
    )
    this.getStudentList();
  }

   /* Move other page like DashboardTeacher / ClassRoom  */
  _handleBack() {
    if (this.props.cameFrom == 'addNewClass') {
      Actions.DashboardTeacher();
    }
    else {
      Actions.ClassRoom();
    }
  }

  /* In header back button  */
  _renderLeftHeader() {
    return (
      <View style={styles.Leftheaderstyle}>
        <TouchableWithoutFeedback onPress={() => this._handleBack()}>
          <View><FontAwesome style={styles.LeftheaderIconStyle}>{Icons.times}</FontAwesome></View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  /* Header title */
  _renderMiddleHeader() {
    return (
      <View style={styles.Middleheaderstyle}>
        <Text style={styles.MiddleHeaderTitlestyle}>{this.props.title}</Text>
      </View>
    )
  }

  /* In header button to move invite aprent page */
  _renderRightHeader() {
    return (
      <View style={styles.Rightheaderstyle}>
        <TouchableWithoutFeedback onPress={() => Actions.InviteParents()}>
          <View><FontAwesome style={styles.LeftheaderIconStyle}>{Icons.check}</FontAwesome></View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  /* Get student list  */
  getStudentList() {
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    /* Call teacher services for student list  */
    TeacherServices.getStudentList(this.state.classid, this.state.app_token).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      objThis.setState({ 'studentList': response.data.class_details.student_list });

    });
  }

  /* Add student */
  addStudent() {
    if (!this.state.student_name) {
      ToastAndroid.showWithGravity(
        'Please Enter Student Name',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return false;
    }
    var objThis = this;
    var param = {
      name: this.state.student_name,
      class_id: this.state.classid,
      token: this.state.app_token
    }
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    TeacherServices.addStudent(param).then(function (resp) {
      objThis.setState({ "showLoader": 0 });
      if (resp['data']['status'] == "Success") {
        var responseJson = resp['data']['user_list'];
        var jsonObj = JSON.stringify(responseJson);
        AsyncStorage.setItem('studentdata', jsonObj);
        objThis.setState({ "student_name": '' })
        /* load again the student list after adding to reflect it in listing */     
        objThis.getStudentList();
        ToastAndroid.showWithGravity(
          'Student has been added successfully',
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      }else{
        Alert.alert(
          '',
          'Name already exist.',
          [
            { text: 'OK', style: 'cancel' },
          ],
        );
      }

    });
  }

  render() {
    /* Image path get from config file */  
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
            <ScrollView keyboardShouldPersistTaps="handled">
              <View >
                <View style={[styles.customHeaderContainer]}>
                  {this._renderLeftHeader()}
                  {this._renderMiddleHeader()}
                  {this._renderRightHeader()}
                </View>
                <View style={styles.dashcontainer}>
                  <View style={{ backgroundColor: '#fff' }}>
                    <TextInput style={[styles.dashcontainer, styles.selectbottomborder]} placeholder="Add New Student" onChangeText={(student_name) => this.setState({ student_name: student_name })} value={this.state.student_name} />
                    {/* <Button title="Add"  onPress={()=>this.addStudent()} /> */}

                    <TouchableHighlight style={[styles.classbtn, styles.marb]} onPress={() => this.addStudent()} title="Add">
                      <Text style={styles.buttonText}>
                        Add
                      </Text>
                    </TouchableHighlight>
                    <FlatList
                      data={this.state.studentList}
                      renderItem={({ item }) =>
                        <View style={styles.addmar} >
                          <Image
                            source={{
                              uri: imagePath + 'assets/student/' + item.image,
                            }}
                            style={{ flexWrap: 'wrap', width: 32, height: 32 }}
                          />
                          <View style={styles.listitems}>
                            <Text style={styles.listviewmargin}>{item.name} </Text>
                          </View>
                        </View>
                      }
                      keyExtractor={(item, index) => index}
                    />
                  </View>
                </View>
              </View>
            </ScrollView>
        }
      </View>
    );
  }
}