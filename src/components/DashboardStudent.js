import React, { Component } from 'react';
import { View, StyleSheet, Button, Text, AsyncStorage, TouchableWithoutFeedback, ActivityIndicator, Image, TouchableHighlight, ToastAndroid, ScrollView, TouchableOpacity, TextInput, Alert, Modal, FlatList } from 'react-native';
import StudentServices from '../services/studentServices';
import config from '../assets/json/config.json';
import HideableView from 'react-native-hideable-view';
import styles from '../assets/css/mainStyle';
import Menu from 'react-native-pop-menu';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import { Actions } from 'react-native-router-flux';
import CustomTabBar from "./CustomTabBar";
import Loader from './Loader';
import DismissKeyboard from 'dismissKeyboard';

export default class DashboardStudent extends Component {
  constructor() {
    super();
    this.state = {
      showLoader: 0,
      loggedInUser: {},
      detalis: {},
      student_lists: {},
      student_no: '',
      studentNo: '',
      unverified: {},
      parentdata: {},
      message: '',
      modalVisible: false,
      studen_val: '',
      menuVisible: false,
      profileImage: '',
      email: ''
    }
    this.getStudentList = this.getStudentList.bind(this);
    this._onPress = this._onPress.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.sendMail = this.sendMail.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.clearInputField = this.clearInputField.bind(this);
    this.removeStudent = this.removeStudent.bind(this);
    this.removeStud = this.removeStud.bind(this);
  }

  async componentDidMount() {
    /* Close keypad */
    DismissKeyboard();
    /* get local storage values */
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    )

    await AsyncStorage.getItem('app_token').then((value) =>
      this.setState({ "app_token": value })
    );
    /* Show header in title */
    Actions.refresh({ title: this.state.loggedInUser.username, initial: true });
    /* Set profile Image */
    if (this.state.loggedInUser['image']) {
      var profileImage = config.image_url + '/assets/profile_image/' + this.state.loggedInUser['image'] + '?=' + Math.random();
    } else {
      var profileImage = config.server_path + '/assets/images/chat_user.png';
    }
    this.setState({ "profileImage": profileImage });
    /* Get student list */
    this.getStudentList();
  }

  /* Get student list */
  getStudentList() {
    var member_no = this.state.loggedInUser.member_no;
    const val = this;
    /* Call function in student service to get student list */
    StudentServices.getStudentLists(this.state.app_token, member_no).then(function (response) {
      if (response.data.status == 'Failure') {
        Alert.alert(
          '',
          response.data.comments,
          [
            { text: 'OK', style: 'cancel' },
          ],
        )
      }else if (response.data.status == 'Success') {
        val.setState({ 'detalis': response.data.student_list })
        AsyncStorage.setItem('student_lists', JSON.stringify(response.data.student_list));
        val.setState({ 'student_no': response.data.student_list[0]['student_no'] });
        AsyncStorage.setItem('studentNo', response.data.student_list[0]['student_no']);
      }
    });
   /* Check student active or not */
    if (this.state.loggedInUser.status == '0') {
      /* Get student listIf student in not active */
      var objThis = this;
      objThis.setState({ "showLoader": 0 });
      /* Call function in student service to search student */
      StudentServices.getStudentSearch(this.state.app_token, member_no).then(function (response) {
        objThis.setState({ "showLoader": 0 });
        if (response.data.status == 'Failure') {
          Alert.alert(
            '',
            response.data.comments,
            [
              { text: 'OK', style: 'cancel' },
            ],
          )
        }
        else if (response.data.user_list['0']['status'] === '1') {
          /* If student is active */
          val.setState({ 'unverified': false });
          AsyncStorage.setItem('parentdata', JSON.stringify(response.data.user_list));
          Alert.alert(
            '',
            'You account has been activated by your parent',
            [
              { text: 'OK', style: 'cancel' },
            ],
          )
        } else {
          val.setState({ 'unverified': true });
        }
      });
    } else {
      val.setState({ 'unverified': false });
    }
  }

  /* Open modal */
  _onPress() {
    this.setState({ 'modalVisible': true });

  }

  /* Close modal */
  closeModal() {
    this.setState({ 'modalVisible': false });
    this.getStudentList();
  }

  /* Clear input field after submit */
  clearInputField() {
    this.textInput.clear();
    this.getStudentList();
  }

  /* Send mail to parent for approving student */
  sendMail() {
    var username = this.state.loggedInUser.username;
    var name = this.state.detalis[0].name;
    var student_no = this.state.detalis[0].student_no;
    var parent_no = this.state.detalis[0].parent_no;
    const value = this.state.email;
    var obj = this;
    if (value !== null) {
      var objThis = this;
      objThis.setState({ "showLoader": 0 });
      /* Call function in student service for sending mail */
      StudentServices.sendParentMail(this.state.app_token, value, name, student_no, parent_no).then(function (response) {
        objThis.setState({ "showLoader": 0 });
        if (response.data.status == 'Failure') {
          Alert.alert(
            '',
            response.data.comments,
            [
              { text: 'OK', style: 'cancel' },
            ],
          )
        } else if (response.mail_flage == "teacher") {
          Alert.alert(
            '',
            'This email id already exists as a teacher id',
            [
              { text: 'OK', style: 'cancel' },
            ],
          )
          this.setState({ 'modalVisible': false });
        } else {
          Alert.alert(
            '',
            'invitation sent successfully  to ' + username + "'s" + ' parent',
            [
              { text: 'OK', onPress: () => obj.closeModal() },
            ],
          )
        }
      });
    } else {
      Alert.alert(
        '',
        'Email Should not empty!!',
        [
          { text: 'OK', style: 'cancel' },
        ],
      )
    }
  }


  /* Form submit to add student */
  handleSubmit() {
    const value = this.state.studen_val;
    var member_no = this.state.loggedInUser.member_no;
    var obj = this;
    obj.setState({ "showLoader": 0 });
    /*Call function in student service to add student */
    StudentServices.student_add(this.state.app_token, value, member_no).then(function (response) {
      obj.setState({ "showLoader": 0 });
      if (response.data.status == 'Failure') {
        ToastAndroid.showWithGravity(
          'Data Not Match',
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        )
      } else {
        obj.textInput.clear()
        obj.getStudentList();
        ToastAndroid.showWithGravity(
          'Student code added successfully',
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        )
      }
    });
  }

 /* Left side header display student profile */
  _renderLeftHeader() {
    return (
      <View style={styles.Leftheaderstyle}>
        <View style={{ width: 40, height: 40, borderRadius: 40 / 2 }}>
          <Image style={{ width: 40, height: 40, borderRadius: 40 / 2 }} source={{ uri: this.state.profileImage }}></Image>
        </View>
      </View>
    )
  }

  /* Middle header title display */
  _renderMiddleHeader() {
    return (
      <View style={styles.Middleheaderstyle}>
        <Text style={styles.MiddleHeaderTitlestyle}>{this.state.loggedInUser.username}</Text>
      </View>
    )
  }

  /* Right side header menu open */
  _renderRightHeader() {
    return (
      <View style={styles.Rightheaderstyle}>
        <TouchableWithoutFeedback onPress={() => {
          this.setState({
            menuVisible: true,
            arrowPosition: 'topRight',
            left: undefined,
            right: 12,
          });
        }}
        >
          <View>
            <FontAwesome style={styles.RightheaderIconStyle}>{Icons.ellipsisV}</FontAwesome>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  /* Middle header title display */
  removeStudent(item) {
    var obj = this;
    Alert.alert(
      '',
      'Would you like remove this student!',
      [
        { text: 'OK', onPress: () => obj.removeStud(item) },
        { text: 'Cancel', onPress: () => obj.closeModal() }
      ],
    )
  }
/* Remove student */
  removeStud(data) {
    var obj = this;
    StudentServices.removeStudent(this.state.app_token, data).then(function (response) {
      if (response.data.status == 'Failure') {
        Alert.alert(
          '',
          'Student Not deleted',
          [
            { text: 'OK', style: 'cancel' },
          ],
        )
      } else {
        Alert.alert(
          '',
          'Student Remove Successfully',
          [
            { text: 'OK', onPress: () => obj.closeModal() },
          ],
        )
      }
    });
  }

  /* Move student report for report display */
  viewReport() {
    Actions.StudentReport();
  }

  render() {
    var imagePath = config.image_url;
    var username = this.state.loggedInUser.username;
    const invButt = this.state.unverified;
    let button = null;
    let text = null;
    if (invButt) { 
      /* Invite parent */    
      button = <TouchableHighlight
        title="View duffer report" onPress={this._onPress}  >
        <Text style={styles.viewreport}>Invite Parent</Text>
      </TouchableHighlight>
      text = <Text style={styles.viewreporttext}>Invite your parent to review performance graph</Text>;
    } else {
      /* View Report */      
      button = <TouchableHighlight
        title="View duffer report" onPress={this.viewReport}  >
        <Text style={styles.viewreport}>{'View ' + username + ' Report'}</Text>
      </TouchableHighlight>
    }
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
                {this._renderRightHeader()}
              </View>
               {/* End header part */}              
              <View>
                <CustomTabBar tabList={[{ 'title': 'Student Invite', currentTab: 1, tabIcon: 'users' }, { 'title': 'Story', actionPage: () => Actions.StudentStory(), tabIcon: 'image' }]} />
              </View>
              <View style={styles.dashstucontainer}>
               {/* Render view report/Invite parent */}              
                {button}
                {text}
                <TextInput style={styles.styleinput} ref={input => { this.textInput = input }} placeholder="Ex. SXYRF2C9Q" onChangeText={(text) => this.setState({ studen_val: text })}
                />
                <TouchableHighlight
                  style={styles.classbtn}
                  title="Submit" onPress={this.handleSubmit}  >
                  <Text style={styles.buttonText}>Submit</Text>
                </TouchableHighlight>
              </View>
               {/* Reander student list */}              
              <View style={styles.listcon}>
                <FlatList
                  data={this.state.detalis}
                  renderItem={({ item }) => (
                    <View style={styles.dashlist}>
                      <View style={styles.liststylepart}>
                        <Text>{item.name}</Text>
                        <Text>{item.class_name}</Text>
                      </View>
                      <View style={{ flex: .5, alignItems: 'flex-end', alignSelf: 'center', paddingRight: 10 }}>
                        <Text onPress={() => this.removeStudent(item.student_no)}>
                          <FontAwesome style={styles.crossstyle}>{Icons.times}</FontAwesome>
                        </Text>
                      </View>
                    </View>
                  )}
                  keyExtractor={(item, index) => index}
                />
              </View>
               {/* Reander menu part */}              
              <Menu visible={this.state.menuVisible}
                onVisible={(isVisible) => {
                  this.state.menuVisible = isVisible
                }}
                left={this.state.left}
                right={this.state.right}
                arrowPosition={this.state.arrowPosition}
                data={[
                  {
                    title: 'Account Settings',
                    onPress: () => {
                      Actions.StudentProfile()
                    }
                  },

                  {
                    title: 'School Story',
                    onPress: () => {
                      Actions.StudentSchoolStory();
                    }
                  },
                  {
                    title: 'Assignment',
                    onPress: () => {
                      Actions.AssignmentStudentClassList();
                    }
                  },
                  {
                    title: 'Event Detail',
                    onPress: () => {
                      Actions.StudentEventList();
                    }
                  },
                ]}
                contentStyle={{ backgroundColor: 'teal' }} />
               {/* Reander modal */}
              <Modal
                visible={this.state.modalVisible}
                animationType={'slide'}
                onRequestClose={() => this.closeModal()}
                transparent={false}
                presentationStyle='formSheet'
              >
                <View style={styles.modalContainerpopup}>
                  <View style={[styles.dashstucontainer, styles.padding]}>
                    <Text style={styles.viewreport} >Enter Parent Email address</Text>
                    <TextInput style={styles.styleinput} onChangeText={(email) => this.setState({ 'email': email })} placeholder="Enter Parent Email id" />
                    <View style={{ flexDirection: 'row' }}>
                      <TouchableHighlight style={styles.attenbutton} title="Ok" onPress={() => this.sendMail()}>
                        <Text style={styles.buttonText}>Ok</Text>
                      </TouchableHighlight>
                      <TouchableHighlight style={styles.attensavebtn} title="Cancel" onPress={() => this.closeModal()}>
                        <Text style={styles.buttonText}>Cancel</Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                </View>
              </Modal>
            </ScrollView>
        }
      </View>
    );
  }
}
