import React, { Component } from 'react';
import { TextInput, TouchableHighlight, TouchableWithoutFeedback, Clipboard, Platform, TouchableOpacity, StyleSheet, Text, View, Button, SectionList, AsyncStorage, FlatList, Image, ScrollView, Alert, ToastAndroid, Picker, Modal } from 'react-native';
import { Actions } from 'react-native-router-flux';
import AssignmentServices from '../services/AssignmentServices';
import styles from '../assets/css/mainStyle';
import Loader from './Loader';
import config from '../assets/json/config.json';
import DismissKeyboard from 'dismissKeyboard';
import Pdf from 'react-native-pdf';

export default class AssignmentStudentClassList extends Component {
  constructor() {
    super();
     this.state = {
      student_list:'',         
        };     
    }
   
  async componentWillMount() {
    /* Close keypad */
    DismissKeyboard();
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    )
    await AsyncStorage.getItem('app_token').then((value)=> 
      this.setState({"app_token": value})
    );
    /* Get class list */
    this.studentClassList();
  }	

/* Get student class list */
  studentClassList(){
    var obj = this;
    AssignmentServices.getStudentClassList(this.state.loggedInUser.member_no, this.state.app_token).then(function (response) {
       obj.setState({'student_list':response.data.student_list})     
    });
  }


	
render() {
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
      <View style={styles.classcontainer}  >
        <View>
          <Text style={styles.textchange}>
            Your Classes
        </Text>      
        </View> 
        <View style={styles.backchange}>           
      <FlatList
          data={ this.state.student_list }
          renderItem={({item}) => ( 
            <View style={styles.listviewclass}>
                <View style={styles.classstoryimage}>
                  <Image style={{ width: 50, height: 50 }} source={{ uri: config.server_path + '/assets/images/chat_user.png' }} />
                </View>
                <View style={styles.classstorycontent} >
              <View>
                {/* move assignment student page in this page show all assignment details */}
                <Text style={styles.listmsgmargin} onPress={() => Actions.AssignmentStudent({'allDetails' : item}) }>              
                   {item.class_name}                         
                </Text>
              </View>
               </View>                        
          </View>
          )}
          keyExtractor={(item, index) => index}               
        />
        </View>
      </View>      
    </ScrollView>
    }
    </View> 
  )};
}