import React, { Component } from 'react';
import { TextInput, TouchableHighlight, Dimensions, TouchableWithoutFeedback, Clipboard, Platform, TouchableOpacity, StyleSheet, Text, View, Button, SectionList, AsyncStorage, FlatList, Image, ScrollView, Alert, ToastAndroid, Picker, Modal } from 'react-native';
import TeacherServices from '../services/teacherServices';
import config from '../assets/json/config.json';
import styles from '../assets/css/mainStyle';
import { Actions } from 'react-native-router-flux';
import Share, { ShareSheet } from 'react-native-share';
import Loader from './Loader';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import HideableView from 'react-native-hideable-view';
import DismissKeyboard from 'dismissKeyboard';
import DatePicker from 'react-native-datepicker';
import PdfReader from './PdfReader';

export default class AssignmentListTeacher extends Component {

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
      pdf: '',
      modalVisible: false,
      page: 1,
      scale: 1,
      numberOfPages: 0,
      horizontal: false,
      attachmentPdf: ''
    };

  }

  async componentWillMount() {

    DismissKeyboard();

    Actions.refresh();
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

    /* Load the assignment list */
    this.getAssignmentList();
  }

    /* Function call from render for back button in header */
  _renderLeftHeader() {
    return (
      <View style={styles.Leftheaderstyle}>
        <TouchableOpacity onPress={() => Actions.ClassRoom()}>
          <FontAwesome style={styles.headerfont}>{Icons.times}</FontAwesome>
        </TouchableOpacity>
      </View>
    )
  }

    /* Function call from render for Header middle content */
  _renderMiddleHeader() {
    return (
      <View style={styles.Middleheaderstyle}>
        <Text style={styles.MiddleHeaderTitlestyle}>{this.props.title}({this.state.classname})</Text>
      </View>
    )
  }

  /* Function call from render for move for create assignment */
  _renderRightHeader() {
    return (
      <View style={styles.Rightheaderstyle}>
        <TouchableOpacity onPress={() => { Actions.CreateAssignment() }}  >
          <Text style={styles.textright}><FontAwesome style={styles.headerfont}>{Icons.plusCircle}</FontAwesome></Text>
        </TouchableOpacity>
      </View>
    )
  }

  /* Get assignment list */
  getAssignmentList() {
    var objThis = this;
    this.setState({ "showLoader": 0 });
    if (this.state.fromDate && this.state.toDate) {
      /*Formate the date according to API need */
      var d = new Date(this.state.fromDate);
      var month = d.getMonth() + 1;
      var day = d.getDate();
      var year = d.getFullYear();
      var fromDate = year + '-' + month + '-' + day;


      var d = new Date(this.state.toDate);
      var month = d.getMonth() + 1;
      var day = d.getDate();
      var year = d.getFullYear();
      var toDate = year + '-' + month + '-' + day;
    }else {
      var fromDate = '';
      var toDate = '';
    }
    /* Get assignment list */
    TeacherServices.getAssignmentList(this.state.classid, fromDate, toDate, this.state.page_number, this.state.title, this.state.app_token).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      if (response.data['status'] == "Success") {
        objThis.setState({ 'assignmentList': response.data['assignment_list'], 'total_submit_count': (response.data['assignment_list']).length });
      }
    });
  }

  onSubmitSearch() {
    /* validate the date */
    if ((!this.state.fromDate) || (!this.state.toDate)) {
      Alert.alert(
        '',
        'Please select both start date and end date',
        [
          { text: 'OK', style: 'cancel' },
        ],
      );
      return false;
    }

    if ((new Date(this.state.fromDate)).getTime() > (new Date(this.state.toDate)).getTime()) {
      Alert.alert(
        '',
        'End date should be greater than start date',
        [
          { text: 'OK', style: 'cancel' },
        ],
      );
      return false;
    }
    /* Function call for get assignment list */
    this.getAssignmentList()
  }

  /* Send notification and open notification page */
  openNotification(assignmentId) {
    AsyncStorage.setItem('assignmentId', assignmentId.toString());
    Actions.AssignmentNotification();
  }

  /* Remove assignment pop up confirmation box */
  removeAssignmentCnf(assignmentId) {
    var objThis = this;
    Alert.alert(
      '',
      'Would you like to remove this Assignment ?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => objThis.removeAssignment(assignmentId) },
      ],
    );
  }

  /* Remove assignment */
  removeAssignment(assignmentId) {
    var objThis = this;
    var dataParam = {
      token: objThis.state.app_token,
      id: assignmentId.toString()
    }
    /* Call function in techer services for removing assignment */
    TeacherServices.removeAssignment(dataParam).then(function (resp) {
      if (resp['data']['status'] == "Success") {
        objThis.getAssignmentList();
        ToastAndroid.showWithGravity(
          'Assignment Removed successfully.',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      }else{
        ToastAndroid.showWithGravity(
          'Unable to remove Assignment. Please try again later',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      }
    });
  }

  /* For edit assignment move edit teacher assignment page */
  editAssignment(assignment) {
    Actions.EditTeacherAssingnment({ 'attachment': assignment.attachment, 'class_id': assignment.class_id, 'description': assignment.description, 'id': assignment.id, 'member_no': assignment.member_no, 'submition_date': assignment.submition_date, 'titles': assignment.title });
  }

  /* For search */
  SearchFilterFunction(text) {
    var objThis = this;
    let search_text = text.toLowerCase();
    let trucks = this.state.assignmentList;
    let trucks_length = this.state.assignmentList.length;
    var filteredName = {};
    if (trucks_length > 0) {
      filteredName = trucks.filter((item) => {
        return item.title.toLowerCase().match(search_text)
      })
    } else {
      filteredName = {};
    }
    if (!text || text === '') {
      this.getAssignmentList()
    } else {
      this.setState({ assignmentList: filteredName });
    }
  }

  /* Open pdf file */
  openPdf(attachemet) {
    this.setState({ 'attachmentPdf': attachemet });
    this.setState({ 'modalVisible': true });

  }

  /* Close modal */
  closeModal() {
    this.setState({ 'modalVisible': false });
    this.getAssignmentList();
  }

  /* Pagination for click more button */
  moreAssignment() {
    var obj = this;
    var page = obj.state.page_number + 1;
    obj.setState({ "page_number": page, 'callByLoadMore': 1 }, () => { obj.getAssignmentList() });
  }

  render() {
    let source = { uri: 'http://182.76.98.134/stagingclassgenie_node_api/assets/assignment/image_61.pdf', cache: true };
    var imagePath = config.image_url;
    var server_path = config.server_path;
    var objThis = this;
    return (
      <ScrollView>
        {/*HEADER PART*/}
        <View style={[styles.customHeaderContainer]}>
          {this._renderLeftHeader()}
          {this._renderMiddleHeader()}
          {this._renderRightHeader()}
        </View>

        {/*START PAGE CONTAINER */}
        <View style={styles.dashcontainer} >
          <View>
            <View style={[styles.whitebackgrounnd, styles.padding]} >
              <View>
                <TextInput
                  style={styles.TextInputStyleClass}
                  onChangeText={(text) => this.SearchFilterFunction(text)}
                  underlineColorAndroid='transparent'
                  placeholder="Search Here"
                />
              </View>

             {/* Start Date Picker */}
              <View style={{ flexDirection: 'row' }}>
                <View style={{ flex: 1 }}>
                  <DatePicker
                    style={styles.datepickerbox}
                    date={this.state.fromDate}
                    mode="date"
                    placeholder=" MM/DD/YYYY"
                    format="MM/DD/YYYY"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 10,
                        marginLeft: 0,
                        paddingRight: 10,
                        width: 20,
                        height: 20
                      },
                      dateInput: {
                        marginLeft: 0
                      }
                    }}
                    onDateChange={(date) => { this.setState({ fromDate: date }) }}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <DatePicker
                    style={styles.datepickerbox}
                    date={this.state.toDate}
                    mode="date"
                    placeholder=" MM/DD/YYYY"
                    format="MM/DD/YYYY"
                    confirmBtnText="Confirm"
                    cancelBtnText="Cancel"
                    customStyles={{
                      dateIcon: {
                        position: 'absolute',
                        left: 0,
                        top: 10,
                        marginLeft: 0,
                        paddingRight: 10,
                        width: 20,
                        height: 20
                      },
                      dateInput: {
                        marginLeft: 0,
                      }

                    }}
                    onDateChange={(date) => { this.setState({ toDate: date }) }}
                  />
                </View>
              </View>

              {/* Start Searching */}
              <View style={styles.saveattenbtn}>
                <TouchableOpacity title="Search" onPress={() => this.onSubmitSearch()}>
                  <Text style={styles.attenbtntext}>Search</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Start Assignment listing*/}
          <HideableView visible={this.state.assignmentList.length < 1} removeWhenHidden={true}>
            <Text>There is no assignment available</Text>
          </HideableView>
          <FlatList
            data={this.state.assignmentList}
            renderItem={({ item }) =>
              <View style={styles.eventliststyle}>
                <View style={styles.assignmentTitleRow}>
                  <Text style={styles.White}>{item.title}</Text>
                  <TouchableWithoutFeedback onPress={() => Actions.SubmittedAssignmentList({ 'assi_id': item.id, 'title': item.title })}>
                    <View>
                      <Text style={styles.asignlisttext}>
                        {item.total_student_submit_count}/{objThis.state.total_submit_count}
                      </Text>
                    </View>
                  </TouchableWithoutFeedback>
                </View>
                <View style={{ padding: 10, }}>
                  <Text>{item.description}</Text>
                  <HideableView visible={item.attachment} removeWhenHidden={true}>
                    <TouchableHighlight onPress={() => objThis.openPdf(item.attachment)} >
                      <Text style={styles.invitelink}>Attachment: {item.attachment}</Text>
                    </TouchableHighlight>
                  </HideableView>
                  <Text>Date: {item.created_at}</Text>
                  <Text>Submition Date: {item.submition_date}</Text>
                </View>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableHighlight style={styles.eventsendbtn} title="Ok" onPress={() => objThis.openNotification(item.id)}>
                    <Text style={styles.buttonText}><FontAwesome>{Icons.bell}</FontAwesome> Send</Text>
                  </TouchableHighlight>
                  <TouchableHighlight style={styles.editdisablebtn} title="Edit" onPress={() => objThis.editAssignment(item)}>
                    <Text style={styles.buttonText}><FontAwesome>{Icons.pencil}</FontAwesome> Edit</Text>
                  </TouchableHighlight>
                  <TouchableHighlight style={styles.eventdeletebtn} title="Cancel" onPress={() => objThis.removeAssignmentCnf(item.id)}>
                    <Text style={styles.buttonText}> <FontAwesome>{Icons.trash}</FontAwesome> Delete</Text>
                  </TouchableHighlight>
                </View>
              </View>
            }
            keyExtractor={(item, index) => index}
          />

          {/* End Assignment listing*/}
          <HideableView style={styles.saveattenbtn} visible={this.state.total_submit_count > '9'} removeWhenHidden={true}>
            <TouchableOpacity title="Load More" onPress={() => this.moreAssignment()}>
              <Text style={styles.attenbtntext}>Load More</Text>
            </TouchableOpacity>
          </HideableView>
        </View>
        <Modal
          visible={this.state.modalVisible}
          animationType={'slide'}
          onRequestClose={() => this.closeModal()}
          transparent={false}
          presentationStyle='formSheet'
        >
          <PdfReader source={config.image_url + 'assets/assignment/' + this.state.attachmentPdf} />
          <View>
            <TouchableHighlight style={styles.assignmentlistbtn} title="Cancel" onPress={() => this.closeModal()}>
              <Text style={[styles.textcolor, styles.textcenter]}>Cancel</Text>
            </TouchableHighlight>
          </View>
        </Modal>
      </ScrollView>
    );
  }

}