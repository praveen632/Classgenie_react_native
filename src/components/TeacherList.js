import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage,
  ListView,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  Video,
  Modal,
  ToastAndroid,
  WebView,
  Alert

} from 'react-native';
import Loader from './Loader';
import { Actions } from 'react-native-router-flux';
import styles from '../assets/css/mainStyle';
import config from '../assets/json/config.json';
import SchoolStoryServices from '../services/SchoolStoryServices';
import DismissKeyboard from 'dismissKeyboard';

export default class TeacherList extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      showLoader:0,
      loggedInUser: {},
      pageCount: 1,
      Teacher_list: {},
      imageBasePath: '',
      token:''
    };
  }

  async componentDidMount() {
    DismissKeyboard();
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    );

    await AsyncStorage.getItem('app_token').then((value)=> this.setState({"token": value}));
    console.log(this.state.loggedInUser.school_id);

    await this.teacherlist();



  }

  teacherlist() {
    var objThis = this;
    this.setState({ "showLoader": 0 });
    SchoolStoryServices.teacherlist(this.state.loggedInUser.school_id, this.state.pageCount,this.state.token).then((response) => {
      objThis.setState({ "showLoader": 0 });
      if (response.data.status == 'Success') {
        console.log(response.data);
        this.setState({ Teacher_list: response.data.Teacher_list })

      } else {
        throw new Error('Server Error!');
      }
    })
  }

  approoveTeacherCnf(member_no) {
    Alert.alert(
      'Approove teacher',
      'Are you sure want to change status?',
      [
        { text: 'OK', onPress: () => this.approoveTeacher(member_no) },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: false }
    )
  }

  removeTeacherCnf(member_no) {
    Alert.alert(
      'Delete teacher',
      'Are you sure want to delete?',
      [
        { text: 'OK', onPress: () => this.removeTeacher(member_no) },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: false }
    )

  }


  approoveTeacher(member_no,token) {
    var objThis = this;
    this.setState({ "showLoader": 0 });
    SchoolStoryServices.approveTeacher(member_no, this.state.loggedInUser.school_id, this.state.loggedInUser.member_no,this.state.token).then((response) => {
      objThis.setState({ "showLoader": 0 });
      if (response.data.status == 'Success') {
        this.teacherlist();
        ToastAndroid.showWithGravity(
          'Teacher is Successfully approved',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        
        );
      } else {
        throw new Error('Server Error!');
      }
    })

  }

  removeTeacher(member_no) {
    var objThis = this;
    this.setState({ "showLoader": 0 });
    SchoolStoryServices.removeTeacher(member_no, this.state.loggedInUser.school_id, this.state.loggedInUser.member_no,this.state.loggedInUser.token).then((response) => {
      objThis.setState({ "showLoader": 0 });
      if (response.data.status == 'Success') {
        this.teacherlist();
        ToastAndroid.showWithGravity(
          'Teacher is deleted',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        
        );

      } else {
        throw new Error('Server Error!');
      }
    })

  }

  more(pagecount) {
    var objThis = this;
    objThis.setState({ pagecount: pagecount + 1 });
    objThis.teacherlist();
    

  }


  render() {
    this.state.imageBasePath = config.image_url;
    return (
            
      <ScrollView keyboardShouldPersistTaps="handled">

      <View>

        <FlatList style={styles.list}
          data={this.state.Teacher_list}
          ItemSeparatorComponent={() => {
            return (
              <View style={styles.separator} />
            )
          }}
          renderItem={({ item }) =>
            <View style={[styles.list, styles.listback]}>
             
                <View style={styles.techaerlistp} >{item.image == '' ? <Image
              source={{
                uri: config.server_path + 'assets/images/chat_user.png',
              }}
              style={{
                flexWrap: 'wrap', width: 50, height: 50, marginTop: 20, marginRight: 30
              }}
            /> : <Image
            source={{
              uri: this.state.imageBasePath + '/assets/profile_image/' + item.image,
            }}
            style={{
              flexWrap: 'wrap', width: 50, height: 50, marginTop: 20, marginRight: 30
            }}
          />}
            <View style={styles.listitems}>
                  <Text style={styles.textchange}>{item.name}</Text>
                  <Text>{item.email}</Text>
                  <View style={styles.teacherlistbtn}>
                  {(item.status == 0) ?  <Text style={styles.pendingbtn} onPress={() => this.approoveTeacherCnf(item.member_no)}>Pending</Text> : <Text style={styles.approvebtn}>Approved</Text>}
                  <Text style={styles.dltbtn} onPress={() => this.removeTeacherCnf(item.member_no)}>Delete</Text>
                  </View>
                  </View>
                </View>
              
            </View>
          } keyExtractor={(item, index) => index}
        />
      </View>

      {this.state.postCount >= 10 ?
            <TouchableHighlight style={styles.classbtn}
              title="More" onPress={() => this.more(this.state.pagecount)}>
              <Text style={styles.buttonText}>More</Text>
         </TouchableHighlight> : null}
      </ScrollView>
    
    );
  }
}