import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, Button, AsyncStorage, ScrollView, TouchableWithoutFeedback, FlatList, TouchableHighlight, TouchableOpacity, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import joinYourSchoolServices from '../services/joinYourSchoolServices';
import styles from '../assets/css/mainStyle';
import Loader from './Loader';
import config from '../assets/json/config.json';
import DismissKeyboard from 'dismissKeyboard';
export default class ChooseSchool extends Component {
  constructor() {
    super();
    this.state = {
      showLoader: 0,
      teacherList: [],
      loggedInUser: {},
      member_no: {},
      Teacher_list: '',
      userList: {},
      user_list: '',
      modalVisible: false,
      type: 2,
      email: '',
      schoolInfo:''
    }
    this.joinyourSchool = this.joinyourSchool.bind(this);
  }

  async componentDidMount() {
    /* Close keypad */
    DismissKeyboard();
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    );

    await AsyncStorage.getItem('app_token').then((value)=> 
      this.setState({"app_token": value})
    );
   /* Get props values that are send by other page through function */
    var param = {
      school_name: this.props.school_name,
      address: this.props.address,
      school_id: this.props.school_id
    }
    /* Set param values in state */
    this.setState({schoolInfo: param})
    /* Get teacher list */
    this.getTeacherList();
    AsyncStorage.setItem('Teacher_list', '');    
    this.joinyourSchool(member_no);
    AsyncStorage.setItem('user_list', '');
  }
  /* options to get  teacher list choosen in school */
  getTeacherList() {
    var objThis = this;  
    objThis.setState({ "showLoader": 0 });  
    /* Call function in join your school searvice for get teacher list */
    joinYourSchoolServices.getTeacherList(objThis.state.app_token, objThis.state.schoolInfo.school_id).then((response) => {
      objThis.setState({ "showLoader": 0 });  
      if (response.data.status == "Success") {
        objThis.setState({ 'teacherList': response.data.Teacher_list });
      } else {
        Alert.alert(
          '',
          'You are first teacher in this school',
          [ 
            {text: 'OK', style: 'cancel'},
          ],
        )   
      }

    })
  }

  /* set the list of teacher */         
  schoolTeacheList(school_id, teachername, teacheremail) {
    Actions.ChooseSchool({ teachername: name, email: teacheremail })
  }

  /* options for  teacher to choose their school */
  joinyourSchool() {
    Alert.alert(
      '',
      'Are you sure want to join this School Account',
      [
        { text: 'OK', onPress: () => this.sureSelectSchool() },
        { text: 'Cancel', onPress: () => this.discardJoin() },
      ],
    )

  }

  /* Move to join your school page */
  discardJoin() {
    Actions.JoinYourSchool();
  }

  /* Select school for join */
  sureSelectSchool() {   
    var obj = this;
    var type = obj.state.type;
    obj.setState({ "showLoader": 0 });
    /* Class function in join your school for join school */  
    joinYourSchoolServices.joinyourSchool(obj.state.app_token, obj.props.school_id, obj.state.loggedInUser.member_no, obj.state.type).then(function (response) {
      obj.setState({ "showLoader": 0 }); 
      if (response.data.status == "Success") {
        /* Set school informetion in local storage  */
        AsyncStorage.setItem('school', JSON.stringify(obj.state.schoolInfo));
        obj.setState({ 'userList': response.data.user_list });
        var loggedInUser = obj.state.loggedInUser;
        loggedInUser.school_id = obj.props.school_id; 
        /* Set login user information in loacal storage */      
        AsyncStorage.setItem('loggedInUser',JSON.stringify(loggedInUser)).then(()=>
        obj.sendrequest()
        ); 
        /* Move to teacher dashboard */              
        Actions.DashboardTeacher();       
      } else {
        throw new Error('Server Error!');
      }
    });
   }

   /* Send mail to techer if techer school in join */
   sendrequest(){  
     var idList = [];
    for(var i=0;i<(this.state.teacherList).length;i++){
       idList +=this.state.teacherList[i].email+',';  
     } 
     var obj = this;    
     obj.setState({ "showLoader": 1 });  
     joinYourSchoolServices.joinSchoolMailSend(this.state.app_token, idList, this.state.loggedInUser.member_no).then(function (response) {
      obj.setState({ "showLoader": 0 });  
      if (response.data.status == "Success") {
        return true; 
      } else {
        return true;
      }
    });
     
   }

  render() {
    var imagePath = config.image_url;
    return (     
      <ScrollView>
        <View style={styles.dashcontainer}>
          <Text style={styles.textcenter}>{this.props.school_name}</Text>
          <Text style={styles.textcenter}>{this.props.address}</Text>
          <View style={styles.classbtn}>
            <TouchableWithoutFeedback onPress={this.joinyourSchool} title="Join The School">
              <Text style={styles.buttonText}>
                Join The School
               </Text>
            </TouchableWithoutFeedback>
          </View>
          <View style={[styles.whitebackgrounnd, styles.padding]}>
            <Text style={styles.marginBottom10}>Available Teacher in School</Text>
            <FlatList
              data={this.state.teacherList}
              renderItem={
                ({ item }) =>(
                  <View style={styles.listviewclass}>
                  <View style={styles.classstoryimage}>
                  {item.image == '' ?
                  <Image style={{ flexWrap: 'wrap', width: 45, height: 45 }} source={{ uri: config.server_path + '/assets/images/chat_user.png' }} /> 
                  :
                  <Image style={{ flexWrap: 'wrap', width: 45, height: 45 }} source={{ uri: imagePath + '/assets/profile_image/' + item.image + '?=' + Math.random()}} />}
                  </View>
                  <View style={styles.classstorycontent} >
                  <Text style={styles.choosetextleft} > <Image style={{ width: 50, height: 50 }} /> {item.name} ({item.email})</Text>
                  </View>
                  </View>
                )}
              keyExtractor={(item, index) => index}
            />
          </View>
        </View>
      </ScrollView>     
    );
  }
}
