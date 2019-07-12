import React, { Component } from 'react';
import { TextInput, TouchableHighlight, TouchableWithoutFeedback, Clipboard, Platform, TouchableOpacity, StyleSheet, Text, View, Button, SectionList, AsyncStorage, FlatList, Image, ScrollView, Alert, ToastAndroid, Picker, Modal } from 'react-native';
import AssignmentServices from '../services/AssignmentServices';
import config from '../assets/json/config.json';
import styles from '../assets/css/mainStyle';
import { Actions } from 'react-native-router-flux';
import Loader from './Loader';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import HideableView from 'react-native-hideable-view';
import DismissKeyboard from 'dismissKeyboard';
import DatePicker from 'react-native-datepicker'


export default class SubmittedAssignmentList extends Component {

  constructor() {
    super();
    this.state = {
      loggedInUser: {},
      showLoader: 0,
      assignmentList: [],
      title: '',
      fromDate: null,
      toDate: null,
      page_number: 0,
      modalVisible: false,
      total_submit_count: 0,
      classid: 0,
      classname: '',
      assig_id:'',      
      assig_details:'',
      studentList:'',
      assignment_list:'',
      marksText:'',
      listsize:'',
      callByLoadMore:0
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

    var prop = {
      'assig_id' : this.props.assi_id,
      'title':this.props.title
    }
    this.setState({assig_details:prop}) 
    this.setState({page_number:1})    
    /* Load the assignment list */
    this.getAssignmentStudent();
  }

  /* Stuent assignment list */
  getAssignmentStudent(){    
    var objThis = this; 
    AssignmentServices.submitedList(this.state.assig_details.assig_id, this.state.page_number, this.state.app_token).then(function (resp) {
    if (resp['data']['status'] == "Success") { 
        objThis.setState({ 'assignment_list': resp.data.assignment_list[0], 'studentList': resp.data.assignmentStudentList });
        objThis.setState({'listsize':(objThis.state.studentList).length});    
      }else{
        ToastAndroid.showWithGravity(
          'Data not Matched Please Checks It',
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        Actions.AssignmentListTeacher();
      }   
    });
  }

  /* Submit marks to student */
  submitMarks(item){
   if(this.state.marksText == ''){
      Alert.alert(
        '',
        'Marks required!',
        [      
          { text: 'OK', style: 'cancel' },
        ],
      );
    }else{
      var data = {
        grade: (this.state.marksText).toString(),
        id: (item.id).toString(),
        student_no: (item.student_no).toString(),
        sender_ac_no:(this.state.loggedInUser.member_no).toString(),
        token:(this.state.app_token).toString(),
      } 
      var obj = this; 
      /* Call function to add mark */    
      AssignmentServices.addMark(data).then(function (resp) {
        if (resp['data']['status'] == "Success") {
          ToastAndroid.showWithGravity(
            'Successfully added grade',
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
          Actions.AssignmentListTeacher();
         }else{
           ToastAndroid.showWithGravity(
             'Grade not added!!!',
             ToastAndroid.LONG,
             ToastAndroid.CENTER
           );
           obj.getAssignmentStudent();
         }   
       });
    }
  }

  /* Send notification to the parent */
  sendReminder(item){
    var data = {   
      id: (item.id).toString(),
      student_no: item.student_no,
      member_no:this.state.loggedInUser.member_no,
      token:this.state.app_token,
    } 
    var obj = this;     
    AssignmentServices.sendReminder(data).then(function (resp) {
      if (resp['data']['status'] == "Success") {
        ToastAndroid.showWithGravity(
          'Reminder sent successfully',
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        Actions.AssignmentListTeacher();
       }else{
         ToastAndroid.showWithGravity(
           'Reminder not sent successfully',
           ToastAndroid.LONG,
           ToastAndroid.CENTER
         );
         obj.getAssignmentStudent();
       }   
     });
  }

  /* Alert student under varification */
  unverified(){
    Alert.alert(
      '',
      'Student account not activated',
      [      
        { text: 'OK', style: 'cancel' },
      ],
    );
  }

  /* pagination to click more button */
  morePage(){
    var obj = this;
    var page = obj.state.page_number + 1;     
    obj.setState({ "page_number": page,  'callByLoadMore': 1 }, () => {obj.getAssignmentStudent()});    
  }

  render() {
    var imagePath = config.image_url;
    var server_path = config.server_path;
    var objThis = this;
    return (
      <ScrollView>
        <View style={styles.dashcontainer}>
        {/* Reander student list whit assignment details */}
        <FlatList
          data={this.state.studentList}
          renderItem={({ item }) =>

          <View style={[styles.whitebackgrounnd, styles.marginTop15]} >
          <View style={styles.listviewpage} >
          <Image style={{ width: 50, height: 50 }} source={{ uri: config.server_path + '/assets/images/chat_user.png' }} />
            <View style={{ flexWrap: 'wrap' }}>
            {
              item.student_name.student_status == 0 ?
              <Text style={styles.listviewmargin}>{item.student_name.name}  (Not Reg) </Text>
              :
              <Text style={styles.listviewmargin}>{item.student_name.name} </Text>
            }             
            </View>
          </View>
          {/* Display mark and give mark */}
          <View style={styles.assignmarklist}>
            {
              item.grade == '' ?
              <View style={{ flex: 2 }}>
                <TextInput style={styles.assignbordertext} placeholder="Enter Marks" onChangeText={(text) => this.setState({ marksText: text })} />
              </View>
            :
            <View style={{ flex: 2 }}>
               <Text>Marks </Text>
            </View>
            }
           <View>
           {
             item.grade == '' ?
             <View style={{ flex: 1 }}>
               <Text style={styles.assigntextalign}  onPress={() => this.submitMarks(item)}>  <FontAwesome style={styles.assignlistiocn} >{Icons.checkCircle}</FontAwesome> </Text>
             </View>
             :
             <View style={{ flex: 2 }}>
                <Text>{ item.grade } </Text>
             </View>
           }             
            </View>
            {
              item.student_name.student_status == '0' ?
              <View style={{ flex: 1 }}>
                <Text style={styles.assigntextalign} onPress={() => this.unverified()}><FontAwesome style={styles.assigninfoicon}>{Icons.infoCircle}</FontAwesome></Text>
              </View>
            :
            
            <View style={{ flex: 1 }}>
            {/* Send reminder */}
            <HideableView visible={item.student_name.student_status == 1 && item.grade == ''} removeWhenHidden={true}>
               <Text style={styles.assigntextalign}  onPress={() => this.sendReminder(item)}><FontAwesome style={styles.assignorangeicon}>{Icons.infoCircle}</FontAwesome></Text>
            </HideableView>
            </View>           
            }           
          </View>
        </View>
          }
          keyExtractor={(item, index) => index}
        />
        <HideableView style={styles.saveattenbtn} visible={this.state.listsize > 9} removeWhenHidden={true}>
            <TouchableOpacity title=" More" onPress={() => this.morePage()} >
            <Text style={styles.attenbtntext}> More</Text>
           </TouchableOpacity>        
        </HideableView>
      </View>
      </ScrollView>
    );
  }

}