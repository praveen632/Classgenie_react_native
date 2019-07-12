import React, { Component } from 'react';
import { TouchableWithoutFeedback, StyleSheet, Text, View, Image, Button, TextInput, AsyncStorage, ScrollView, FlatList, TouchableHighlight, TouchableOpacity, Alert, Modal, Picker } from 'react-native';
import { Actions } from 'react-native-router-flux';
import CustomTabBar from "./CustomTabBar";
import TeacherServices from '../services/teacherServices';
import config from '../assets/json/config.json';
import HideableView from 'react-native-hideable-view';
import DatePicker from 'react-native-datepicker'
import styles from '../assets/css/mainStyle';
import Menu from 'react-native-pop-menu';
import { Dropdown } from 'react-native-material-dropdown';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import base64 from 'base-64';
import Loader from './Loader';
import DismissKeyboard from 'dismissKeyboard';

export default class ManageAttendance extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: 0,
      loggedInUser: {},
      studentList: [],
      selectedStudent: [],
      classid: '',
      classname: '',
      menuVisible: false,
      modalVisible: false,
      startDate: null,
      endDate: null,
      today: null,
      currentDate: null,
      displayResetBtn: 0,
      attendanceAll: '',
      arrowPosition: 'topRight',
      left: 12,
      right: undefined,
      color: '#F5FCFF',
    }
    this.handleDateChange = this.handleDateChange.bind(this);
    this.changeAttendanceForAll = this.changeAttendanceForAll.bind(this);
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
    await AsyncStorage.getItem('classid').then((value) =>
      this.setState({ "classid": value })
    )
    await AsyncStorage.getItem('classname').then((value) =>
      this.setState({ "classname": value })
    );

    /*Set default date*/
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var year = d.getFullYear();
    var startDate = month + '/' + day + '/' + year;
    var param = {
      startDate: startDate,
      endDate: startDate,
      currentDate: startDate,
      today: startDate
    }
    this.setState(param);
     /* Get student attendence list on the time page load */
    this.getStudentAttendanceList();
  }

  getStudentAttendanceList() {
    var objThis = this;
    /*Formate the date according to API need */
    var d = new Date(this.state.currentDate);
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var year = d.getFullYear();
    var currentDate = year + '/' + month + '/' + day;
    objThis.setState({ "showLoader": 0 });
    TeacherServices.getStudentAttendanceList(this.state.classid, currentDate, this.state.app_token).then((response) => {
      objThis.setState({ "showLoader": 0 });
      if (response.data['status'] == "Success") {
        objThis.setState({ 'studentList': response.data['user_list'] });
        objThis.setAttendance();
      }
    });

  }

  /* Save attendance */
  saveAttendance() {
    if (!this.state.currentDate) {
      this.setState({ currentDate: this.state.today });
    }
    var objSend = { class_id: 0, student_list: [] };
    objSend.class_id = this.state.classid;
    objSend.student_list = [];
    for (let i = 0; i < (this.state.studentList).length; i++) {
      let key = this.state.studentList[i].student_no[0].student_no;
      objSend.student_list.push({ student_no: key, attendance: this.state.selectedStudent[key] });
    }
    let lists_value = base64.encode(JSON.stringify(objSend));
    var objThis = this;
    /*Formate the date according to API need */
    var d = new Date(this.state.currentDate);
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var year = d.getFullYear();
    var currentDate = year + '/' + month + '/' + day;
    objThis.setState({ "showLoader": 0 });
    TeacherServices.saveAttendance(lists_value, currentDate, this.state.app_token).then((resp) => {
      objThis.setState({ "showLoader": 0 });
      if (resp.data['status'] == "Success") {
        objThis.setState({ 'displayResetBtn': 1 });
        Alert.alert(
          '',
          'Attendance updated successfully.',
          [
            { text: 'OK', style: 'cancel' },
          ],
        );
      }
      else {
        Alert.alert(
          '',
          'Unable to update Attendance.',
          [
            { text: 'OK', style: 'cancel' },
          ],
        );
      }
    });
  }

  /* Give attendence to student */
  setAttendance() {
    var selectedStudent = [];
    var displayResetBtn = 0;
    for (let i = 0; i < (this.state.studentList).length; i++) {
      let key = this.state.studentList[i].student_no[0].student_no;
      if ((this.state.studentList[i]).hasOwnProperty('id')) {
        displayResetBtn = 1;
      }
      else {
        displayResetBtn = 0;
      }
      if (this.state.studentList[i].student_no[0].attendance == '' || this.state.studentList[i].student_no[0].attendance == 'NA') {
        selectedStudent[key] = 'H';
      }
      else {
        selectedStudent[key] = this.state.studentList[i].student_no[0].attendance;
      }

    }
    this.setState({ selectedStudent: selectedStudent, displayResetBtn: displayResetBtn });
    /* TO RERENDER WE NEED TO SET STUDENT LIST AGAIN */
    var studentListing = this.state.studentList;
    this.setState({ 'studentList': [] });
    this.setState({ 'studentList': studentListing });
  }

  /* Change attendence one by one student */
  changeAttendance(student) {
    var selectedStudent = this.state.selectedStudent;
    var studentListing = this.state.studentList;
    var student_no = 0;
    if (student && student.length > 0) {
      student_no = student[0]['student_no'];
    }
    if (this.state.selectedStudent[student_no] == '' || this.state.selectedStudent[student_no] == 'NA' || this.state.selectedStudent[student_no] == 'H' || this.state.selectedStudent[student_no] == 'L') {
      selectedStudent[student_no] = 'P';
    }
    else if (this.state.selectedStudent[student_no] == 'P') {
      selectedStudent[student_no] = 'A';
    }
    else if (this.state.selectedStudent[student_no] == 'A') {
      selectedStudent[student_no] = 'L';
    }
   
    this.setState({
      selectedStudent: selectedStudent,
      studentList: [],
    }, () => { this.setState({ studentList: studentListing }) }
    );

  }

  /* Change all student */
  changeAttendanceForAll(attendanceVal) {
    if (attendanceVal) {
      var selectedStudent = [];
      for (let i = 0; i < (this.state.studentList).length; i++) {
        let key = this.state.studentList[i].student_no[0].student_no;
        selectedStudent[key] = attendanceVal;
      }
      /* TO RERENDER WE NEED TO SET STUDENT LIST AGAIN */
      var studentListing = this.state.studentList;
      this.setState({
        selectedStudent: selectedStudent,
        attendanceAll: attendanceVal,
        studentList: [],
      }, () => { this.setState({ studentList: studentListing }) }
      );
    } else {
      this.setState({ attendanceAll: attendanceVal });
    }
  }

  /* Get image attendance */
  getAttendanceImage(student) {
    var student_no = 0;
    if (student && student.length > 0) {
      student_no = student[0]['student_no'];
    }
    if (this.state.selectedStudent[student_no] == '' || this.state.selectedStudent[student_no] == 'NA' || this.state.selectedStudent[student_no] == 'H') {
      var imagePath = config.server_path + 'assets/images/attendance_na.png';
    }
    else if (this.state.selectedStudent[student_no] == 'P') {
      var imagePath = config.server_path + 'assets/images/attendance_p.png';
    }
    else if (this.state.selectedStudent[student_no] == 'A') {
      var imagePath = config.server_path + 'assets/images/attendance_a.png';
    }
    else if (this.state.selectedStudent[student_no] == 'L') {
      var imagePath = config.server_path + 'assets/images/attendance_l.png';
    }
    return imagePath;
  }

  /* Select all student attendance */
  handleChangeAttendanceForAll(attendanceVal) {
    var selectedStudent = [];
    for (let i = 0; i < (this.state.studentList).length; i++) {
      let key = this.state.studentList[i].student_no[0].student_no;
      selectedStudent[key] = attendanceVal;
    }
    this.setState({ selectedStudent: selectedStudent });
    /* TO RERENDER WE NEED TO SET STUDENT LIST AGAIN*/
    var studentListing = this.state.studentList;
    this.setState({ 'studentList': [] });
    this.setState({ 'studentList': studentListing });
    Actions.refresh();

  }

  /* Reset all attendance */
  resetAttendence() {
    var objThis = this;
    /*Formate the date according to API need */
    var d = new Date(this.state.currentDate);
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var year = d.getFullYear();
    var currentDate = year + '/' + month + '/' + day;
    objThis.setState({ "showLoader": 0 });
    TeacherServices.resetAttendence(this.state.classid, currentDate, this.state.app_token).then((resp) => {
      objThis.setState({ "showLoader": 0 });
      if (resp.data['status'] == "Success") {
        objThis.setState({ 'displayResetBtn': 0 });
        objThis.getStudentAttendanceList();
        Alert.alert(
          '',
          'Attendance reset successfully.',
          [
            { text: 'OK', style: 'cancel' },
          ],
        );
      }
      else {
        Alert.alert(
          '',
          'Unable to reset Attendance.',
          [
            { text: 'OK', style: 'cancel' },
          ],
        );
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

  /* Searching according to date */
  handleDateChange(dateObj) {
    if ((new Date(dateObj)).getTime() > (new Date(this.state.today)).getTime()) {
      Alert.alert(
        '',
        'You can\'t mark attendance for upcoming dates.',
        [
          { text: 'OK', style: 'cancel' },
        ],
      );
    }
    else {
      this.setState({ currentDate: dateObj });
      this.getStudentAttendanceList();
    }

  }

  /* Header left side back button */
  _renderLeftHeader() {
    return (
      <View style={styles.Leftheaderstyle}>
        <TouchableWithoutFeedback onPress={() => Actions.pop()}>
          <View><FontAwesome style={styles.LeftheaderIconStyle}>{Icons.times}</FontAwesome></View>
        </TouchableWithoutFeedback>
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

  /* Header right side menu */
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

  /* Attendance send to the mail */
  getAttendanceMail(data) {
    if (data.datetoken == 'daterange') {
      if ((new Date(this.state.startDate)).getTime() > (new Date(this.state.endDate)).getTime()) {
        Alert.alert(
          '',
          'End date should be greater than start date',
          [
            { text: 'OK', style: 'cancel' },
          ],
        );
        return false;
      }

      /*Formate the date according to API need */
      var d = new Date(this.state.startDate);
      var month = d.getMonth() + 1;
      var day = d.getDate();
      var year = d.getFullYear();
      var startDate = year + '/' + month + '/' + day;

      var d = new Date(this.state.endDate);
      var month = d.getMonth() + 1;
      var day = d.getDate();
      var year = d.getFullYear();
      var endDate = year + '/' + month + '/' + day;

      var daterange = JSON.stringify({ "date1": startDate.toString(), "date2": endDate.toString() });
      var message = 'Attendence record for selected date range has been successfully mailed on your id ' + this.state.loggedInUser.email;
    }
    else {
      var daterange = '';
      var message = 'Attendence record for ' + data.label + ' has been successfully mailed on your id ' + this.state.loggedInUser.email;
    }

    this.closeModal();
    let dataParam = {
      datetoken: data.datetoken,
      class_id: this.state.classid,
      teacher_name: this.state.loggedInUser.name,
      member_no: this.state.loggedInUser.member_no,
      email: this.state.loggedInUser.email,
      daterange: daterange,
      token: this.state.app_token
    }
    objThis = this;
    objThis.setState({ "showLoader": 0 });
    /* Send mail by api hit */
    TeacherServices.getAttendanceMail(dataParam).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      if (response.data['status'] == "Success") {
        Alert.alert(
          '',
          message,
          [
            { text: 'OK', style: 'cancel' },
          ],
        );
      }
      else {
        Alert.alert(
          '',
          'Unable to email attendance record. Please try again later.',
          [
            { text: 'OK', style: 'cancel' },
          ],
        );

      }

    });
  }


  render() {
    let data = [{
      value: 'Mark All Present',
    },
    {
      value: 'Mark All Absent',
    },
    {
      value: 'Mark Holiday',
    },];
    var imagePath = config.image_url;
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
              {/* Header part start */}
              <View style={[styles.customHeaderContainer]}>
                {this._renderLeftHeader()}
                {this._renderMiddleHeader()}
                {this._renderRightHeader()}
              </View>
             {/* Close header part  */}

              {/* date picker */}
              <View style={styles.dashcontainer}>
                <View style={styles.whitebackgrounnd}>
                  <DatePicker
                    style={styles.styleinput}
                    date={this.state.currentDate}
                    mode="date"
                    placeholder="select date"
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
                    onDateChange={(date) => { this.handleDateChange(date) }}
                  />

                <View style={styles.selectbottomborder}>
                  <Picker selectedValue={this.state.attendanceAll} onValueChange={(itemValue, itemIndex) => this.changeAttendanceForAll(itemValue)}>
                    <Picker.Item label="Attendance" value="" />
                    <Picker.Item label="Mark All Present" value="P" />
                    <Picker.Item label="Mark All Absent" value="A" />
                    <Picker.Item label="Mark Holiday" value="H" />
                  </Picker>
                </View>
                <View style={{height:15}}>
                </View>
                </View>              

                <View style={{ backgroundColor: '#fff', marginTop: 20 }}>
                  <FlatList
                    data={this.state.studentList}
                    renderItem={({ item }) =>

                      <View style={styles.attenclass}>
                        <View style={{ flexWrap: 'wrap' }}>
                          <Image
                            source={{ uri: imagePath + 'assets/student/' + item.image }}
                            style={{ flexWrap: 'wrap', width: 32, height: 32, alignSelf: 'flex-end' }}
                          />
                        </View>
                        <View style={styles.manageattentext}>
                          <Text style={styles.listviewmargin}>{item.name}</Text>
                        </View>
                        <View style={styles.manageattenimg}>
                          <TouchableOpacity title="Attendance" onPress={() => this.changeAttendance(item['student_no'])}>
                            <Image
                              source={{ isStatic: true, uri: objThis.getAttendanceImage(item['student_no']) }}
                              style={{ flexWrap: 'wrap', width: 32, height: 32, alignSelf: 'flex-end' }}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>

                    }
                    keyExtractor={(item, index) => index}
                  />

                </View>
                {/* Reset attendence */}
                <View style={{ flexDirection: 'row' }}>                  
                    <HideableView visible={this.state.displayResetBtn} removeWhenHidden={true} style={{ flex: 2 }}>
                      <View style={styles.resetbtn}>
                        <TouchableOpacity title="Reset" onPress={() => this.resetAttendence()}>
                          <Text style={styles.buttonText}>Reset</Text>
                        </TouchableOpacity>
                      </View>
                    </HideableView>
                    {/* Save attendance */}
                    <View style={{ flex: 2 }} >
                    <View style={styles.saveattenbtn}>
                      <TouchableOpacity title="Save attendance" onPress={() => this.saveAttendance()}>
                        <Text style={styles.attenbtntext}>Save Attendance</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              {/*Start for attendance menu */}
              <Menu visible={this.state.menuVisible}
                onVisible={(isVisible) => {
                  this.state.menuVisible = isVisible
                }}
                left={this.state.left}
                right={this.state.right}
                arrowPosition={this.state.arrowPosition}
                data={[
                  {
                    title: 'Today',
                    onPress: () => {
                      this.getAttendanceMail({ datetoken: 'today', label: 'Today' });
                    }
                  },
                  {
                    title: 'This Week',
                    onPress: () => {
                      this.getAttendanceMail({ datetoken: 'thisweek', label: 'This Week' })
                    }
                  },
                  {
                    title: 'This Month',
                    onPress: () => {
                      this.getAttendanceMail({ datetoken: 'thismonth', label: 'This Month' })
                    }
                  },
                  {
                    title: 'Date Range',
                    onPress: () => {
                      this.openModel()
                    }
                  },

                ]}
                contentStyle={{ backgroundColor: 'teal' }} />
              {/*End for attendance menu */}

              {/*Start for date range popup */}
              <Modal transparent={true} visible={this.state.modalVisible} animationType={'slide'} onRequestClose={() => this.closeModal()} >
                <View style={styles.modelContainer} >
                  <ScrollView>

                    <View style={[styles.customHeaderContainer]}>
                      <View style={styles.Leftheaderstyle}>
                        <TouchableWithoutFeedback onPress={() => this.closeModal()}>
                          <View><FontAwesome style={styles.LeftheaderIconStyle}>{Icons.times}</FontAwesome></View>
                        </TouchableWithoutFeedback>
                      </View>
                      <View style={styles.Middleheaderstyle}>
                        <Text style={styles.MiddleHeaderTitlestyle}>Select Date Range</Text>
                      </View>
                    </View>

                    <View style={{ flexDirection: 'row',flex:1}}>
                      <View style={{flex:1}}>
                        <DatePicker
                          style={styles.datepickerbox}
                          date={this.state.startDate}
                          mode="date"
                          placeholder="select start date"
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
                          onDateChange={(date) => { this.setState({ startDate: date }) }}
                        />
                      </View>
                      <View style={{flex:1}}>
                        <DatePicker
                          style={styles.datepickerbox}
                          date={this.state.endDate}
                          mode="date"
                          placeholder="select start date"
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
                              marginLeft: 0,
                            }

                          }}
                          onDateChange={(date) => { this.setState({ endDate: date }) }}
                        />
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <TouchableHighlight style={styles.attenbutton} title="Ok" onPress={() => this.getAttendanceMail({ datetoken: 'daterange', label: 'Date Range' })}>
                        <Text style={styles.buttonText}>Ok</Text>
                      </TouchableHighlight>
                      <TouchableHighlight style={styles.attensavebtn} title="Cancel" onPress={() => this.closeModal()}>
                        <Text style={styles.buttonText}>Cancel</Text>
                      </TouchableHighlight>
                    </View>
                  </ScrollView>
                </View>
              </Modal>
              {/*End for date range popup */}
              </View>
            </ScrollView>
        }
      </View>
    );
  }
}
