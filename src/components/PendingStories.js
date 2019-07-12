import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage,
  ListView,
  Image,
  FlatList,
  ScrollView
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ClassStoryTeacherServices from '../services/ClassStoryTeacherServices';
import styles from '../assets/css/mainStyle';
import Loader from './Loader';
import config from '../assets/json/config.json';
import DismissKeyboard from 'dismissKeyboard';
export default class PendingStories extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      showLoader: 0,
      loggedInUser: {},
      classid: '',
      class_list: "",
      pagecount: '1',
      searchTerm: '',
      index: 0,
      items: {},
      postCount: '',
      teacher_ac_no: '',
      imagefolder: '',
      dataSource: {},
      userlist: {},
      modalVisible: false,
      parent_ac_no: '',
      student_no: '',
      buttons: ['Class Story', 'Student Story'],
    };
  }

  async componentDidMount() {
    /* Close keypad */
    DismissKeyboard();
    /* Get local storage values */
    await AsyncStorage.getItem('classid').then((value) =>
      this.setState({ "classid": value })
    );

    await AsyncStorage.getItem('app_token').then((value)=> 
      this.setState({"app_token": value})
    );    
    var objThis = this;   
    /* Get class student list on the time of page load */
    await ClassStoryTeacherServices.getClassStudentList(this.state.app_token,this.state.classid).then((response) => {
     if (response.status == 200) {
        this.setState({ userlist: response.data.user_list })
      } else {
        throw new Error('Server Error!');
      }
    })
  }

  /* Pending student story base in parent and student */
  pendingStoryiesPost_Student(parent_ac_no, student_no) {
    AsyncStorage.setItem('parent_ac_no', parent_ac_no);
    AsyncStorage.setItem('student_no', student_no);
    Actions.PendingStoriesPost();
  }

  /* All pending story */
  pendingStoriesPost() {
    AsyncStorage.setItem('parent_ac_no', '');
    AsyncStorage.setItem('student_no', '');
    Actions.PendingStoriesPost();
  }

  render() {
    var server_path = config.server_path;
    return (
      <ScrollView>
       <View style={styles.dashcontainer}>
         <View>
          <Text style={styles.textchange}>
            Student List
            </Text>
          </View>
          {/* Whole class story */}
        <View style={[styles.listviewclass, styles.padding]}>
          <View style={styles.classstoryimage}>
          <Image style={{ width: 50, height: 50 }} source={{ uri: config.server_path + '/assets/images/all_parent.png' }} />
          </View>
          <View style={styles.classstorycontent}>
            <Text onPress={() => this.pendingStoriesPost()}>
              Whole Class Story
             </Text>
          </View>
        </View>
        <View style={styles.backchange}>
        <FlatList
          data={this.state.userlist}
          renderItem={({ item }) =>
          <View style={styles.listviewclass}>
            <View style={styles.classstoryimage}>
            <Image style={{ width: 50, height: 50 }} source={{ uri: config.server_path + '/assets/images/chat_user.png' }} />
            </View>
            <View style={styles.classstorycontent}>
           <Text style={styles.classstorycontent} onPress={() => this.pendingStoryiesPost_Student(item.parent_ac_no, item.student_no)}> {item.name}</Text>
           </View>
           </View>
           }           
          keyExtractor={(item, index) => index}         
        />
        </View>
      </View>
     </ScrollView>
     
    );
  }
}
