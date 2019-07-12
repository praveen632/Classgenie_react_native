import React, { Component } from 'react';
import {TouchableOpacity, StyleSheet, Text, View, Image, Button, AsyncStorage, ScrollView, FlatList, TextInput, ToastAndroid, Alert} from 'react-native';
import { Actions } from 'react-native-router-flux';
import TeacherServices from '../services/teacherServices';
import config from '../assets/json/config.json';
import styles from '../assets/css/mainStyle';
import Loader from './Loader';
import DismissKeyboard from 'dismissKeyboard';

export default class PerformanceStudentListing extends Component {  
  constructor(props)
  {
    super(props);
    this.state ={
      showLoader: 0,
      loggedInUser: {},
      studentList: [],
      classid:'',
      classname: '',
      classimage: '',
      student_name:'',     
    }
  }

  async componentDidMount()
  {
    /* Close keypad */
    DismissKeyboard();
    /* Get loacal storage values */
   await AsyncStorage.getItem('app_token').then((value)=> 
      this.setState({"app_token": value})
    );
   await AsyncStorage.getItem('loggedInUser').then((value)=>
        this.setState({"loggedInUser": JSON.parse(value)})
    )
    await AsyncStorage.getItem('classid').then((value)=>
        this.setState({"classid": value})
    )
    await AsyncStorage.getItem('classname').then((value) =>
      this.setState({ "classname": value })
    )
    await AsyncStorage.getItem('classimage').then((value) =>
      this.setState({ "classimage": value })
    )   
    /* Get student list on the time of page load */
    this.getStudentList();

  } 

  /* Get student list */
  getStudentList()
  {
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    TeacherServices.getStudentList(this.state.classid,this.state.app_token).then(function(response){
      objThis.setState({ "showLoader": 0 });
        objThis.setState({'studentList':response.data.class_details.student_list}) ;            

    });
  }
  
  /* Edit student for move other page */
  openEditStudent(stu_id, stu_name, stu_image)
  {
      Actions.EditStudent({stu_id:stu_id, stu_name:stu_name, stu_image:stu_image})
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
          <View   style={styles.dashcontainer}>      
        {/* For Class*/} 
        <Text style={styles.textchange}>Student List</Text>
        <TouchableOpacity style={styles.addgstyle} onPress={() => Actions.PerformanceGraph()}>
              <Image style={{ flexWrap: 'wrap', width: 32, height: 32 }} source={{ uri: imagePath+'assets/class/'+this.state.classimage }} />
              <View style={{ flexWrap: 'wrap' }}>
                <Text style={styles.listviewmargin} >Whole Class Performance</Text>
              </View>
        </TouchableOpacity> 
         {/* For Student Listing*/}  
          <FlatList
          data={ this.state.studentList }
          renderItem={({item}) =>
            <TouchableOpacity style={styles.addgstyle} onPress={() => Actions.PerformanceGraph({student_no:item.student_no,student_name:item.name}) }>
              <Image style={{ flexWrap: 'wrap', width: 32, height: 32 }} source={{ uri: imagePath+'assets/student/'+item.image }} />
              <View style={{ flexWrap: 'wrap' }}>
                <Text style={styles.listviewmargin} >{item.name}</Text>
              </View>
            </TouchableOpacity>
          }
          keyExtractor={(item, index) => index}
          />
      </View>
      }
      </View>
    );
  }
}