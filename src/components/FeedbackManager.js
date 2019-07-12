import React, { Component } from 'react';
import { TouchableWithoutFeedback, StyleSheet, Text, View, Image, Button, AsyncStorage, ScrollView, FlatList, TouchableHighlight, TouchableOpacity, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import CustomTabBar from "./CustomTabBar";
import TeacherServices from '../services/teacherServices';
import config from '../assets/json/config.json';
import HideableView from 'react-native-hideable-view';
import styles from '../assets/css/mainStyle';
import Menu from 'react-native-pop-menu';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Loader from './Loader';
import DismissKeyboard from 'dismissKeyboard';

export default class FeedbackManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: 0,
      loggedInUser: {},
      optionPositive: [],
      optionNegative: [],
      selectedStudent: [],
      classid: '',
      classname: '',
      groupId: '',
      groupName: '',
      awardTo: '',
      currentTab: 'positive',
      studentName: '',
      studentId: '',
      student_no: '',
    }
    this.changeTab = this.changeTab.bind(this);
  }

  async componentDidMount() {
    /* CLose keypad */
    DismissKeyboard();
    /* Get local storage values */
    await AsyncStorage.getItem('app_token').then((value)=> 
      this.setState({"app_token": value})
    );
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    )
    await AsyncStorage.getItem('classid').then((value) =>
      this.setState({ "classid": value })
    )
    await AsyncStorage.getItem('classname').then((value) =>
      this.setState({ "classname": value })
    )
    /* Get prpps values that are send by other page in function */
    var param = {
      groupId: this.props.group_id,
      groupName: this.props.group_name,
      awardTo: this.props.awardTo,
      studentName: this.props.studentName,
      studentId: this.props.studentId,
      student_no: this.props.student_no,
      selectedStudent: this.props.selectedStudent,
    }
    /* Set state */
    this.setState(param);

    /* Set title by condition base */
    if (this.state.groupId) {
      Actions.refresh({ title: 'Give feedback to ' + this.state.groupName });
    }
    else if (this.state.awardTo == 'awardMultiStudent') {
      Actions.refresh({ title: 'Give feedback to selected students' });
    }
    else if (this.state.awardTo == 'awardSingleStudent') {
      Actions.refresh({ title: 'Give feedback to ' + this.state.studentName });
    }
    else if (this.state.awardTo == 'awardWholeClass') {
      Actions.refresh({ title: 'Give feedback to Whole Class' });
    }
    else if (this.state.awardTo == 'editSkill') {
      Actions.refresh({ title: 'Skills List' });
    }
    /* Get feedback on the time of page load */
    this.getFeedbackOption();
  }  

   /* Display back button in header */
  _renderLeftHeader() {
    return (
      <View style={styles.Leftheaderstyle}>
        <TouchableWithoutFeedback onPress={() => Actions.ClassRoom()}>         
          <View><FontAwesome style={styles.LeftheaderIconStyle}>{Icons.times}</FontAwesome></View>
        </TouchableWithoutFeedback>
      </View>
    )
  }  

  /* Display header title */
  _renderMiddleHeader() {
    return (
      <View style={styles.MiddleheaderstyleLeft}>
        <Text style={styles.MiddleHeaderTitlestyle}>{this.props.title}</Text>
      </View>
    )
  }

  /* Change tab */
  changeTab(tabName) {   
    var awardTo = this.state.awardTo;
    this.setState({ "awardTo":'' },()=>{this.setState({ "currentTab": tabName,awardTo:awardTo })});
  }

  /* Open student list to other page */
  openStudentFeedback() {
    Actions.StudentListing();
  }

  giveReward(pointweight, skill_id, name, image, skill_type) {
    /* if this page called by group reward then call feedback for group */
    if (this.state.groupId) {
      this.giveRewardToGroup(pointweight, skill_id);
    }
    else if (this.state.awardTo == 'awardMultiStudent') {
      this.giveRewardToMultiStudent(pointweight, skill_id);
    }
    else if (this.state.awardTo == 'editSkill') {
      Actions.AddEditSkill({ 'skill_weight': pointweight, 'skill_id': skill_id, 'skill_name': name, 'skill_image': image, 'skill_type': skill_type });
    }
    else if (this.state.awardTo == 'awardSingleStudent') {
      this.giveRewardToSingleStudent(pointweight, skill_id);
    }
    else if (this.state.awardTo == 'awardWholeClass') {
      this.giveRewardToClass(pointweight, skill_id);
    }
  }


  /* Give reward to the group */
  giveRewardToGroup(pointweight, skill_id) {
    let dataParam = {
      group_id: (this.state.groupId).toString(),
      group_name: (this.state.groupName).toString(),
      pointweight: (pointweight).toString(),
      class_id: (this.state.classid).toString(),
      customize_skills_id: (skill_id).toString(),
      token: this.state.app_token
    }
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    TeacherServices.giveRewardToGroup(dataParam).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      if (response.data['status'] == "Success") {
        /* make api call for get the updated class point */
        objThis.wholeClassPoint(objThis.state.classid);      
        Alert.alert(
          '',
          'Your feedback has been added to group.',
          [
            { text: 'OK', style: 'cancel' },
          ],
        );
      }
      else {
        Alert.alert(
          '',
          'Unable to add feedback now. Please try again later',
          [
            { text: 'OK', style: 'cancel' },
          ],
        );
      }

    });
  }

  /* Give reward to multiple student */
  giveRewardToMultiStudent(pointweight, skill_id) {
    let dataParam = {
      id: this.state.selectedStudent,
      pointweight: (pointweight).toString(),
      class_id: (this.state.classid).toString(),
      customize_skills_id: (skill_id).toString()
    }
    let finalParam = {
      data: JSON.stringify(dataParam),
      token: this.state.app_token
    }
    objThis = this;
    objThis.setState({ "showLoader": 0 });
    TeacherServices.giveRewardToMultiStudent(finalParam).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      if (response.data['status'] == "Success") {
        /* make api call for get the updated class point */
        objThis.wholeClassPoint(objThis.state.classid);
        Alert.alert(
          '',
          'Your feedback has been added to selected student.',
          [
            { text: 'OK', style: 'cancel' },
          ],
        );
      }
      else {
        Alert.alert(
          '',
          'Unable to add feedback now. Please try again later',
          [
            { text: 'OK', style: 'cancel' },
          ],
        );
      }

    });
  }

  /* Give single student reward */
  giveRewardToSingleStudent(pointweight, skill_id) {  
    let dataParam = {
      id: (this.state.studentId).toString(),
      student_no: (this.state.student_no).toString(),
      pointweight: (pointweight).toString(),
      class_id: (this.state.classid).toString(),
      customize_skills_id: (skill_id).toString(),
      token: this.state.app_token
    }
    objThis = this;
    objThis.setState({ "showLoader": 0 });
    TeacherServices.giveRewardToSingleStudent(dataParam).then(function (response) {
      objThis.setState({ "showLoader": 0 });
       if (response.data['status'] == "Success") {
        objThis.wholeClassPoint(response.data.user_list[0].class_id);     
        Alert.alert(
          '',
          'Feedback has been added successfully.',
          [
            { text: 'OK', style: 'cancel' },
          ],
        );
      }
      else {
        Alert.alert(
          '',
          'Unable to add feedback now. Please try again later',
          [
            { text: 'OK', style: 'cancel' },
          ],
        );
      }
    });
  }

  /* Get whole class point */
  wholeClassPoint(class_id){
    TeacherServices.wholeClassPointget(class_id, this.state.app_token).then(function (response) {     
       if (response.data['status'] == "Success") {   
       let classpoint = response['data']['class_details'].pointweight;
       AsyncStorage.setItem('classpoint', (classpoint).toString(), () => {
         Actions.ClassRoom({ currentTab: 'student' })
       });
       // Actions.ClassRoom({ currentTab: 'student' });      
      }
    });
  }

  /* Give reward to classes */
  giveRewardToClass(pointweight, skill_id) {
    let dataParam = {
      pointweight: (pointweight).toString(),
      class_id: (this.state.classid).toString(),
      customize_skills_id: (skill_id).toString(),
      token: this.state.app_token
    }
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    TeacherServices.giveRewardToClass(dataParam).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      if (response.data['status'] == "Success") {
        /* set the updated feedback point for class in storage */
        let classpoint = response['data']['user_list'][0].pointweight;
        AsyncStorage.setItem('classpoint', (classpoint).toString(), () => {
          Actions.ClassRoom({ currentTab: 'student' })
        });
        Alert.alert(
          '',
          'Feedback has been added successfully.',
          [
            { text: 'OK', style: 'cancel' },
          ],
        );
      }
      else {
        Alert.alert(
          '',
          'Unable to add feedback now. Please try again later',
          [
            { text: 'OK', style: 'cancel' },
          ],
        );
      }
    });
  }
  
  getFeedbackOption() {
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    TeacherServices.getFeedbackOption(this.state.classid,this.state.app_token).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      objThis.setState({ 'optionPositive': response.data.user_list, 'optionNegative': response.data.needwork });
      //objThis.setState({ "optionPositive":response.data.user_list },()=>{this.setState({ "optionNegative": response.data.needwork })});
    });
  }

   /* Get class point list */
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
          <View style={[styles.customHeaderContainer]}>
            {this._renderLeftHeader()}
            {this._renderMiddleHeader()}
          </View>

          <View style={styles.dashcontainer}>
          {
            this.state.currentTab == 'positive' ?
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <View style={{ flex: 1, width: '50%' }} >
                    <View style={styles.classbtn}>
                      <TouchableWithoutFeedback disabled={true} onPress={() => console.log('')} title="Positive">
                        <Text style={styles.buttonText}>
                          Positive
                        </Text>
                      </TouchableWithoutFeedback>
                    </View>
                  </View>
                  <View style={{ flex: 1, width: '50%' }} >
                    <View style={styles.groupbtn}>
                      <TouchableWithoutFeedback onPress={() => this.changeTab('needWork')} title="Needs Work">
                        <Text style={styles.bcolor}>
                          Needs Work
                        </Text>
                      </TouchableWithoutFeedback>
                    </View>
                  </View>
                </View>
                <View>
                  <FlatList
                    data={this.state.optionPositive}
                    renderItem={({ item }) =>
                      <TouchableWithoutFeedback onPress={() => this.giveReward(item.pointweight, item.id, item.name, item.image, 'positive')}>
                        <View style={styles.addback}>
                          <View style={{ flexDirection: 'row' }}>

                            <View style={styles.textstylebtn}   >
                              <Text style={objThis.getPointClsBg(item.pointweight)}  >
                                {item.pointweight}
                              </Text>
                            </View>
                          </View>
                          <View>
                            <Text>
                              <Image style={{ width: 220, height: 220 }} source={{ uri: imagePath + 'assets/skill/' + item.image }} />
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
                  <HideableView visible={this.state.awardTo == 'editSkill'} removeWhenHidden={true}>                   
                    <View style={styles.addback}>
                      <TouchableOpacity onPress={() => Actions.AddEditSkill({ skill_type: 'positive' })}>
                        <Text>
                          <FontAwesome style={styles.addcolor}>{Icons.plus}</FontAwesome>
                        </Text>
                        <Text style={{ textAlign: 'center' }} >
                          Add
                      </Text>
                      </TouchableOpacity>
                    </View>
                  </HideableView>
                </View>
              </View>
              :
              <View>
                <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                  <View style={{ flex: 1, width: '50%' }} >
                    <View style={styles.groupbtn}>
                      <TouchableWithoutFeedback onPress={() => this.changeTab('positive')} title="Positive">
                        <Text style={styles.bcolor}>
                          Positive
                        </Text>
                      </TouchableWithoutFeedback>
                    </View>
                  </View>
                  <View style={{ flex: 1, width: '50%' }} >
                    <View style={styles.classbtn}>
                      <TouchableWithoutFeedback onPress={() => console.log('')} title="Needs Work" disabled={true}>
                        <Text style={styles.buttonText}>
                          Needs Work
                        </Text>
                      </TouchableWithoutFeedback>
                    </View>
                  </View>
                </View>
                <View>
                  <FlatList
                    data={this.state.optionNegative}
                    renderItem={
                      ({ item }) =>

                        <TouchableWithoutFeedback onPress={() => this.giveReward(item.pointweight, item.id, item.name, item.image, 'negative')}>
                          <View style={styles.addback}>
                            <View style={{ flexDirection: 'row' }}>

                              <View style={styles.textstylebtn}   >
                                <Text style={objThis.getPointClsBg(item.pointweight)}  >
                                  {item.pointweight}
                                </Text>
                              </View>
                            </View>
                            <View>
                              <Text>
                                <Image style={{ width: 220, height: 220 }} source={{ uri: imagePath + 'assets/skill/' + item.image }} />
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

                  <HideableView visible={this.state.awardTo == 'editSkill'} removeWhenHidden={true}>                    
                    <View style={styles.addback}>
                      <TouchableOpacity onPress={() => Actions.AddEditSkill({ skill_type: 'negative' })}>
                        <Text>
                          <FontAwesome style={styles.addcolor}>{Icons.plus}</FontAwesome>
                        </Text>
                        <Text style={{ textAlign: 'center' }} >
                          Add
                      </Text>
                      </TouchableOpacity>
                    </View>
                  </HideableView>

                </View>
              </View>
          }
        </View>
      </ScrollView>
      }
      </View>
    );
  }
}
