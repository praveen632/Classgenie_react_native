import React, { Component } from 'react';
import { TouchableWithoutFeedback, StyleSheet, Text, View, Image, Button, AsyncStorage, ScrollView, FlatList, TouchableHighlight, TouchableOpacity } from 'react-native';
import { Actions } from 'react-native-router-flux';
import TeacherServices from '../services/teacherServices';
import config from '../assets/json/config.json';
import styles from '../assets/css/mainStyle';
import CheckBox from 'react-native-checkbox';
import Loader from './Loader';
import DismissKeyboard from 'dismissKeyboard';
export default class AwardMultiStudent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: 0,
      loggedInUser: {},
      studentList: [],
      selectedStudent: [],
      noOfSelectedStu: 0,
      selectAll: false,
      classid: '',
      student_name: '',
    }

    this.selectStudent = this.selectStudent.bind(this);
    this.selectAll = this.selectAll.bind(this);
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
    /* Get student list */
    this.getStudentList();
  }

  /* Get student list */
  getStudentList() {
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    /* Call function in teacher searvice to get student list */
    TeacherServices.getStudentList(this.state.classid,this.state.app_token).then(function (response) {
      objThis.setState({ "showLoader": 0});
      objThis.setState({ 'studentList': response.data.class_details.student_list });

    });
  }

  /* Select student list to click checkbox */
  selectStudent(student_no) {
    if (this.state.selectedStudent.indexOf(student_no) !== -1) {
      let ax = this.state.selectedStudent.indexOf(student_no);
      this.state.selectedStudent.splice(ax, 1)
    }
    else {
      this.state.selectedStudent.push(student_no);
    }   
    var noOfSelectedStu = (this.state.selectedStudent).length;
    this.setState({ noOfSelectedStu: noOfSelectedStu });
    var studentList = this.state.studentList;
    this.setState({ 'studentList': [] }, () => { this.setState({ studentList: studentList }) });
  }

  /* Select all student */
  selectAll() {
    this.state.selectedStudent = [];
    this.state.selectAll = !this.state.selectAll;
    if (this.state.selectAll) {
      for (let i = 0; i < (this.state.studentList).length; i++) {
        this.state.selectedStudent.push(this.state.studentList[i].id);
      }
    }  
    var noOfSelectedStu = (this.state.selectedStudent).length;
    this.setState({ noOfSelectedStu: noOfSelectedStu });
    var studentList = this.state.studentList;
    this.setState({ 'studentList': [] }, () => { this.setState({ studentList: studentList }) });
  }

  /* Get student class list */
  getStudentClass(student_no) {
    if (this.state.selectedStudent.indexOf(student_no) !== -1) {
      return [styles.addback, styles.selectedBg];
    }
    else {
      return styles.addback;
    }
  }

  /* Award multiple student to move feedback manager page */
  awardMultiplestudents() {
    Actions.FeedbackManager({ selectedStudent: this.state.selectedStudent, awardTo: 'awardMultiStudent' });
  }

  /* Get point by class */
  getPointClsBg(pointWeight) {
    if (pointWeight > 0) {
      return styles.classstyles;
    }
    else if (pointWeight < 0) {
      return styles.classtyl;
    }
    else {
      return styles.graystyle;
    }
  }

  /* Check the checkbox is check or not */
  checkedOrNot(student_no) {
    if (this.state.selectedStudent.indexOf(student_no) !== -1) {
      return true;
    }
    else {
      return false;
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
        <View style={styles.dashcontainer}>

          <View>
            <TouchableWithoutFeedback onPress={() => objThis.selectAll()}>
              <View style={styles.addback}>
                <View>
                  <Text>
                    <Image style={{ width: 132, height: 52 }} source={{ uri: server_path + 'assets/images/three.png' }} />
                  </Text>
                  <Text style={{ textAlign: 'center' }} >
                    {this.state.selectAll ? 'Deselect All' : 'Select All'}
                  </Text>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>

          <FlatList
            data={this.state.studentList}
            renderItem={({ item }) =>
              <TouchableWithoutFeedback onPress={() => objThis.selectStudent(item.id)}>
                <View style={objThis.getStudentClass(item.id)}>
                  <View style={{ flexDirection: 'row' }}>
                    <View>
                      <CheckBox label='' checked={objThis.checkedOrNot(item.id)} onChange={(checked) => objThis.selectStudent(item.id)} />
                    </View>
                    <View style={styles.textstylebtn}>
                      <Text style={objThis.getPointClsBg(item.pointweight)}  >
                        {item.pointweight}
                      </Text>
                    </View>
                  </View>
                  <View>
                    <Text>
                      <Image style={{ width: 220, height: 220 }} source={{ uri: imagePath + 'assets/student/' + item.image }} />
                    </Text>
                    <Text style={{ textAlign: 'center' }} >
                      {item.name}
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            }
            keyExtractor={(item, index) => index}
          />
          {/* move to award multiple page */}
          <TouchableWithoutFeedback disabled={!this.state.noOfSelectedStu} onPress={() => this.awardMultiplestudents()}>
            <View style={styles.classbtn}>
              <Text style={styles.buttonText}>Give award to {this.state.noOfSelectedStu} </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>

      </ScrollView>
      }
      </View>
    );
  }
}