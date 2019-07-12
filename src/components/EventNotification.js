import React, { Component } from 'react';
import { TouchableWithoutFeedback, Clipboard, Platform,TextInput, TouchableOpacity, StyleSheet, Text, View, Button, SectionList, AsyncStorage, FlatList, Image, ScrollView, Alert, ToastAndroid } from 'react-native';
import EditEventServices from '../services/EditEventServices';
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
      loggedInUser: {},   
      image_url: '',
      school_id: 0,
      Teacher_list: [],
      count_list: [], 
      pagecount:1,
      selectedStudent:[]     
    }        
  }

  async componentWillMount() {   
    /* CLose keypad */
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

    await AsyncStorage.getItem('assignmentId').then((value) =>
      this.setState({ "assignmentId": value })
    );
    /* Get event teacher list on time page load */
    this.eventTeacherList();
  }

  /* Get teacher list */
  eventTeacherList(school_id,pagecount){     
    var objThis = this;
    /* Call edit event services to get techer list */
    EditEventServices.teacherlistEvent(this.state.app_token,this.props.school_id, this.state.pagecount, ).then(function (response) {
       objThis.setState({ "showLoader": 0 });
      if (response.data['status'] == "Success") {
        objThis.setState({ 'Teacher_list': response.data['Teacher_list'] });
      }
    });
  }  
  
  /* Check check box check or not */
  checkedOrNot(status,notification_status) {
    if (notification_status == 1 || status == 0) {
      return true;
    }   
    else{
      return false;
    }
  }

  /* Select teacher */
  selectTeacher(member_no){    
      if (this.state.selectedStudent.indexOf(member_no) !== -1) {
        let ax = this.state.selectedStudent.indexOf(member_no);
        this.state.selectedStudent.splice(ax, 1);     
        return false;
      }
      else {
        this.state.selectedStudent.push(member_no);    
        return true;
      }   
  }

  /* Send event */
  sendEventNotification()
  {
    var member_nos = base64.encode(JSON.stringify(this.state.selectedStudent));
    var dataParam = {
      member_no:this.state.loggedInUser.member_no,
      sender_ac_no:member_nos,
      token:this.state.app_token 
    }
   
    EditEventServices.sendEventNotification(dataParam).then(function (response) {      
      if (response['data']['status'] == "Success") {
        ToastAndroid.showWithGravity(
          'Notification has been sent',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER        
        );
      }
    });
  }

  render() {
    var imagePath = config.image_url;
    var server_path = config.server_path;    
    var objThis = this;
    return (
      <View>
      <Text> Teacher List </Text>
      <FlatList style={styles.backchange}
        data={this.state.Teacher_list}
        renderItem={({ item }) =>
        <View>
            <View>    
            <HideableView visible={item.notification_status == 1 && item.status == 1} removeWhenHidden={true}>        
              <CheckBox label='' disabled={true} checked={true} />
            </HideableView>        
           <HideableView visible={item.notification_status == 0 && item.status == 1} removeWhenHidden={true}>           
            <CheckBox label=''  onChange={(checked) => objThis.selectTeacher(item.name)}/>
           </HideableView>
           <HideableView visible={item.notification_status == 0 && item.status == 0} removeWhenHidden={true}>            
            <CheckBox label='' disabled={true} checked={true} />
           </HideableView>                  
            {
              (item.status == 1) ?                          
              <CheckBox label='' disabled={true} checked={true} />
              :
              <TouchableOpacity style={styles.listviewclass}>
              <CheckBox label=''  onChange={(checked) => objThis.selectTeacher(item.member_no)} />
              </TouchableOpacity>
            }
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
        <TouchableWithoutFeedback title="Submit Event" onPress={() => this.sendEventNotification()}>
        <View style={styles.classbtn}>
          <Text style={styles.buttonText}>Send </Text>
        </View>
        </TouchableWithoutFeedback>
     </View>
    );
  }
}