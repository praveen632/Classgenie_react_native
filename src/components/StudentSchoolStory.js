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
  TouchableHighlight,
  ScrollView,
  Video,
  Modal,
  ToastAndroid,
  WebView
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from '../assets/css/mainStyle';
import config from '../assets/json/config.json';
import StudentStoryServices from '../services/StudentStoryServices';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Loader from './Loader';
import ChatVideo from './ChatVideo';
import DismissKeyboard from 'dismissKeyboard';

export default class StudentSchoolStory extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    video: Video;
    this.state = {
      showLoader: 0,
      loggedInUser: {},
      classid: '',
      class_list: "",
      pagecount: 1,
      searchTerm: '',
      index: 0,
      items: {},
      postCount: 0,
      teacher_ac_no: '',
      imagefolder: '',
      dataSource: {},
      postlist: {},
      likeslist: {},
      menuVisible: false,
      arrowPosition: 'topRight',
      left: 12,
      right: undefined,
      color: '#F5FCFF',
      modalVisible: false,
      order: 1,
      isVisible: false,
      buttonRect: {},
      Schoolname: '',
      title: '',
      buttons: ['Class Story', 'Student Story'],
      app_token: '',
      school_idStudent: ''
    };
  }

  async componentDidMount() {
    /* Close keypad */
    DismissKeyboard();
    /* Get local storage values */
    await AsyncStorage.getItem('app_token').then((value) =>
      this.setState({ "app_token": value })
    );

    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    );
    var obj = this;
    /* Call function in student story to get school list on the time page load */
    StudentStoryServices.schoolList(this.state.loggedInUser.member_no, this.state.app_token).then(function (response) {
      if (response.data.status == 'Success') {
        obj.setState({ "school_idStudent": response.data.school_name[0].school_id }, () => { obj.getSchoolStory(obj.state.school_idStudent, obj.state.pagecount) })
      }
      else if (response.data.status == 'Failure') {
        ToastAndroid.showWithGravity(
          'We are unable to get story!!',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      }
    });  
  }

  /* Pagination on the click of more button */
  more(pagecount) {
    this.setState({ pagecount: pagecount + 1 });
    this.getSchoolStory(this.state.loggedInUser.school_id, this.state.pagecount);
  }

  /* Get school story */
  getSchoolStory(school_id, pagecount) {
    StudentStoryServices.getSchoolStory((school_id).toString(), (pagecount).toString(), this.state.app_token).then((response) => {
      if (response.data.status == 'Success') {
        this.setState({ postCount: response.data.post.length })
        this.setState({ Schoolname: response.data.school_name['0']['school_name'] })
        this.setState({ items: response.data.post })
        this.setState({ title: response.data.school_name['0']['school_name'] })
        /* Check like status for like or dislike */
        for (var i = 0; i < this.state.postCount; i++) {
          if (response.data['post'][i]['like_status']) {
            for (var j = 0; j < response.data['post'][i]['like_status']['length']; j++) {
              if (response.data['post'][i]['like_status'][j]['member_no'] == this.state.loggedInUser.member_no) {
                if (response.data['post'][i]['like_status'][j]['status'] == '0') {
                  this.state.items[i]['liked'] = 0;
                }
                else {
                  this.state.items[i]['liked'] = 1;
                }
              }
              else {
                this.state.items[i]['liked'] = 0;
              }
            }
          } else {
            this.state.items[i]['liked'] = 0;
          }
        }
      } else {
        throw new Error('Server Error!');
      }
    })
  }

  /* Make video url */
  video(videoId) {
    return config.image_url + 'assets/school_stories/' + videoId;
  }

  render() {
    var imagePath = config.image_url;
    var server_path = config.server_path;
    return (
      <ScrollView keyboardShouldPersistTaps="handled">
        <FlatList style={styles.list}
          data={this.state.items}
          ItemSeparatorComponent={() => {
            return (
              <View style={styles.separator} />
            )
          }}
          renderItem={({ item }) =>
            <View style={[styles.whitebackgrounnd, styles.marginTop15]}>
              <View style={[styles.classstoryparents, styles.padding]}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.wholeimageleft}>
                    <Image style={{ flexWrap: 'wrap', width: 45, height: 45 }} source={{ uri: server_path + 'assets/images/status_profile.png' }} />
                  </View>
                  <View style={styles.midtextclass}>
                    <Text >{this.state.Schoolname}</Text>
                    <Text>{item.teacher_name}</Text>
                  </View>
                </View>

                <View style={styles.datestory}>
                  <Text style={[styles.datetext, styles.paddingTop10]}>{item.date}</Text>
                </View>
              </View>

              <View style={[styles.padding, styles.borderbottomstyle]}>
                <Text> {item.message} </Text>
                {item.ext == 'mp4' || item.ext == '3gp' ?
                  <ChatVideo videoUrl={this.video(item.image)} videoClass={styles.VideoContainer} />
                  : <Text></Text>}
                {item.ext == 'jpg' ? <Image style={styles.storyImg} source={{ uri: imagePath + 'assets/school_stories/' + item.image }} /> : null}
              </View>
            </View>
          }
          keyExtractor={(item, index) => index}
        />
        {/* More button for pagination */}
        {this.state.postCount >= 10 ?         
          <TouchableHighlight style={styles.classbtn}
            title="More" onPress={() => this.more(this.state.pagecount)}>
            <Text style={styles.buttonText}>More</Text>
          </TouchableHighlight> : null}
      </ScrollView>
    );
  }
}