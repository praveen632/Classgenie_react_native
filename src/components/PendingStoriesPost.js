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
  ToastAndroid,
  ScrollView,
  TouchableHighlight
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ClassStoryTeacherServices from '../services/ClassStoryTeacherServices';
import styles from '../assets/css/mainStyle';
import config from '../assets/json/config.json';
import Loader from './Loader';
import ChatVideo from './ChatVideo';
import DismissKeyboard from 'dismissKeyboard';
export default class PendingStoriesPost extends Component {

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
      app_token: ''
    };
  }


  async componentDidMount() {
    /* Close keypad */
    DismissKeyboard();
    /* Get local storage values */
    await AsyncStorage.getItem('classid').then((value) =>
      this.setState({ "classid": value })
    );
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    );

    await AsyncStorage.getItem('parent_ac_no').then((value) =>
      this.setState({ "parent_ac_no": value })
    );

    await AsyncStorage.getItem('student_no').then((value) =>
      this.setState({ "student_no": value })
    );

    await AsyncStorage.getItem('app_token').then((value) =>
     this.setState({ "app_token": value })
    );
    /* Load pending story in time to page load */
    await this.loadpendingStories();
  }

  /* Get pending story */
  loadpendingStories() {
    if (this.state.parent_ac_no == null && this.state.student_no == null) {
      var objThis = this;
      objThis.setState({ "showLoader": 0 });
      /* Call function in teacher service to get class pending story */
      ClassStoryTeacherServices.getClasspendingStories(this.state.classid, this.state.pageCount, this.state.app_token).then((response) => {
        objThis.setState({ "showLoader": 0 });
        if (response.status == 200) {
          this.setState({ userlist: response.data.user_list })
        } else {
          throw new Error('Server Error!');
        }
      })
    } else {
      var objThis = this;
      objThis.setState({ "showLoader": 0 });
      /* Get pending story on the base of student  */
      ClassStoryTeacherServices.getClasspendingStories_student(this.state.classid, this.state.parent_ac_no, this.state.student_no, this.state.pageCount, this.state.app_token).then((response) => {
        objThis.setState({ "showLoader": 0 });
        if (response.status == 200) {
          console.log(response.data);
          this.setState({ userlist: response.data.user_list })
        } else {
          throw new Error('Server Error!');
        }
      })
    }
  }

  /* Approved pending story */
  Approve(id) {
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    ClassStoryTeacherServices.approvePendingpost(id, this.state.loggedInUser.member_no, this.state.app_token).then((response) => {
      objThis.setState({ "showLoader": 0 });
      if (response.data.status == 'Success') {
        this.loadpendingStories();
        ToastAndroid.showWithGravity(
          'Story is Successfully approved',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      } else {
        throw new Error('Server Error!');
      }
    })
  }

  /* Disapproved pending story */
  DisApprove(id) {
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    ClassStoryTeacherServices.disapprovePendingpost(id, this.state.loggedInUser.member_no, this.state.app_token).then((response) => {
      objThis.setState({ "showLoader": 0 });
      if (response.data.status == 'Success') {
        this.loadpendingStories();
        ToastAndroid.showWithGravity(
          'Story is Successfully disapproved',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
         );
      } else {
        throw new Error('Server Error!');
      }
    })
  }

/* Create video url */
  video(videoId, imagefolder) {
    return config.image_url + 'assets/' + 'student_stories' + '/' + videoId;
  }

  render() {
    console.log(this.state.userlist);
    var imagePath = config.image_url;
    var server_path = config.server_path;
    return (
      <ScrollView>
        <View style={styles.dashcontainer}>
          <FlatList
            data={this.state.userlist}
            ItemSeparatorComponent={() => {
              return (
                <View style={styles.separator} />
              )
            }}
            renderItem={({ item }) =>
              <View style={[styles.whitebackgrounnd, styles.padding]}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.wholeimageleft}>
                    {item.image_name === '' ? <Image style={{ flexWrap: 'wrap', width: 45, height: 45 }} source={require('../assets/images/chat_user.png')} />
                      :
                      <Image style={{ flexWrap: 'wrap', width: 45, height: 45 }} source={{ uri: imagePath + '/assets/profile_image/' + item.image_name }} />}
                  </View>
                  <View style={styles.midtextclass}>
                    <Text>{item.class_name}</Text>
                    <Text>{item.username}</Text>
                  </View>
                </View>

                <View style={styles.padding}>
                  <Text> {item.message} </Text>
                  {item.ext == 'mp4' || item.ext == '3gp' ?
                    <ChatVideo videoUrl={this.video(item.image)} videoClass={styles.VideoContainer} />
                    : <Text></Text>}
                  {item.ext == 'jpg' ? <Image style={styles.storyImg} source={{ uri: imagePath + 'assets/student_stories/' + item.image }} /> : <Text></Text>}
                </View>

                <View style={{ flexDirection: 'row' }}>
                  <TouchableHighlight>
                    <Text style={styles.dltbtn} onPress={() => this.Approve(item.id)}>Approved</Text>
                  </TouchableHighlight>
                  <TouchableHighlight>
                    <Text style={[styles.approvebtn, styles.marginLeft20]} onPress={() => this.DisApprove(item.id)}>Disapproved</Text>
                  </TouchableHighlight>
                </View>
              </View>
            }
            keyExtractor={(item, index) => index}
          />
        </View>
      </ScrollView>
    );
  }
}

