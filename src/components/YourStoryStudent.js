import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  DrawerLayoutAndroid,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  ListView,
  AsyncStorage,
  FlatList,
  ScrollView,
  WebView,
  Alert,
  TouchableWithoutFeedback

} from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from '../assets/css/mainStyle';
import config from '../assets/json/config.json';
import StudentStoryServices from '../services/StudentStoryServices';
import Menu from 'react-native-pop-menu';
import CustomTabBar from "./CustomTabBar";
import Drawer from 'react-native-drawer-menu';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Loader from './Loader';
import ChatVideo from './ChatVideo';
import Video from 'react-native-video';
export default class YourStoryStudent extends Component {
  constructor(props) {
    super(props);
    this.openDrawer = this.openDrawer.bind(this);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    video: Video;
    this.state = {
      showLoader: 0,
      loggedInUser: {},
      classid: '',
      pagecount: 1,
      searchTerm: '',
      index: 0,
      items: [],
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
      classList: '',
      buttons: ['Class Story', 'Student Story'],
      mylist_data: [],
      firstclass: '',
      class_name: '',
      menuVisible: false,
      arrowPosition: 'topRight',
      left: 12,
      right: undefined,
      color: '#F5FCFF',
      userImage: ''
    };
  }

  async componentDidMount() {
    /* Get loacl storage values */
    await AsyncStorage.getItem('app_token').then((value) =>
      this.setState({ "app_token": value })
    );
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    );
    /* Get image */
    var userImage = this.state.loggedInUser.image;
    this.setState({ "userImage": userImage })
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    /* Call function in student story to get student list */
    await StudentStoryServices.getlist(this.state.app_token, this.state.loggedInUser.member_no).then((response) => {
      objThis.setState({ "showLoader": 0 });
      if (response.data.status == 'Success') {
        this.setState({ 'mylist_data': response.data.student_list });
        AsyncStorage.setItem('firstclass', response['data']['student_list'][0].class_id);
        this.setState({ 'class_name': response['data']['student_list'][0].class_name });
        AsyncStorage.setItem('first_student_code', response['data']['student_list'][0].student_no);
      } else {
        throw new Error('Server Error!');
      }
    })

    if (this.state.classid == '' || this.state.classid == 'undefined') {
      await AsyncStorage.getItem('firstclass').then((value) =>
        this.setState({ "class_id": value })
      );

      await AsyncStorage.getItem('first_student_code').then((value) =>
        this.setState({ "student_no": value })
      );
    }
    await this.loadData(this.state.class_id);
  }

  /* Open drower */
  openDrawer() {
    this.drawer.openDrawer();
  }

  /* Get student pending story */
  loadData(classid) {
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    StudentStoryServices.getStudent_pendingStory(this.state.student_no, classid, this.state.pagecount, this.state.loggedInUser.member_no, this.state.app_token).then((response) => {
      objThis.setState({ "showLoader": 0 });
      if (response.data.status == 'Success') {
        this.setState({ postCount: response.data.user_list.length })
        this.setState({ items: response.data.user_list })
        /* Check like status */
        for (var i = 0; i < this.state.postCount; i++) {
          if (response.data['user_list'][i]['like_status']) {
            for (var j = 0; j < response.data['user_list'][i]['like_status']['length']; j++) {
              if (response.data['user_list'][i]['like_status'][j]['member_no'] == this.state.loggedInUser.member_no) {
                if (response.data['user_list'][i]['like_status'][j]['status'] == '0') {
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

/* Reload post in time to like and comment */
  loadpost(classname, classid) {
    this.state.classid = classid;
    this.state.class_name = classname;
    this.loadData(this.state.classid);
    this.drawer.closeDrawer();
  }

  /* Add post */
  AddPost() {
    Actions.AddStudentStory({ classid: this.state.classid, class_name: this.state.class_name });
  }

  /* Make video url */
  video(videoId) {
    return config.image_url + 'assets/class_stories/' + videoId;
  }

  /* Remove story */
  removeStory(id) {
    var objThis = this;
    this.setState({ "showLoader": 0 });
    StudentStoryServices.Deletestory(id, this.state.app_token).then((response) => {
      objThis.setState({ "showLoader": 0 });
      if (response.data.status == 'Success') {
        this.loadData(this.state.class_id);

      } else {
        throw new Error('Server Error!');
      }
    })
  }

  /* Confirmation box for delete story */
  deleteStory(id) {
    Alert.alert(
      'Please Confirm!',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
        {
          text: 'OK', onPress: () => { this.removeStory(id) }
        },
      ],
      { cancelable: false }
    )
  }

  /* Back button render in left side hearder */
  _renderLeftHeader() {
    return (
      <View style={styles.Leftheaderstyle}>
        <TouchableWithoutFeedback onPress={() => Actions.StudentStory()}>
          <View><FontAwesome style={styles.LeftheaderIconStyle}>{Icons.times}</FontAwesome></View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  /* Open drower in right side header */
  _renderRightHeader() {
    return (
      <View style={styles.Rightheaderstyle}>
        <TouchableWithoutFeedback onPress={this.openDrawer}>
          <View><FontAwesome style={styles.RightheaderIconStyle}>{Icons.bars}</FontAwesome></View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  /* Create video url */
  video(videoId) {
    return config.image_url + 'assets/student_stories/' + videoId;
  }

  render() {
    /* Student list */
    var navigationView = (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
          <Text style={styles.eventlistcolor}>Student's Class</Text>
        <FlatList
          data={this.state.mylist_data}
          renderItem={({ item }) =>
            <TouchableOpacity style={styles.listviewclass} onPress={() => this.loadpost(item.class_name, item.class_id)}>
              <View style={{ flexWrap: 'wrap' }}>
                <Text style={styles.listclassmargin}> {item.class_name}</Text>
              </View>
            </TouchableOpacity>
          }
          keyExtractor={(item, index) => index}

        />
      </View>
    );

    var imagePath = config.image_url;
    var server_path = config.server_path;
    return (
      <DrawerLayoutAndroid
        drawerWidth={300}
        ref={(_drawer) => this.drawer = _drawer}
        drawerPosition={DrawerLayoutAndroid.positions.Right}
        renderNavigationView={() => navigationView}>
       {/* Start header part */}
        <View style={[styles.customHeaderContainer]}>
          {this._renderLeftHeader()}
          {this._renderRightHeader()}
        </View>
       {/* End header part */}
        <ScrollView keyboardShouldPersistTaps="handled">
          <View style={styles.storycontainer}>
          {/* Add student story */}
            <View style={styles.whitebackgrounnd}>
              <View style={styles.wholeborder}>
                <View style={styles.classiconleft}>
                  <Text >
                    <FontAwesome style={styles.fontwholeicon}>{Icons.userCircle}</FontAwesome>
                  </Text>
                </View>
                <View style={styles.schoolstorystyle}>
                  <Text style={styles.paddingTop10} onPress={() => this.AddPost()}> Add Student Story</Text>
                </View>
                <View style={styles.whotestoryright}>
                  <Text style={styles.textright}>
                    <FontAwesome style={styles.fontwholeicon}>{Icons.camera}</FontAwesome>
                  </Text>
                </View>
              </View>
            </View>

            <FlatList
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
                        {this.state.userImage == '' ? <Image style={{ flexWrap: 'wrap', width: 45, height: 45 }} source={{ uri: server_path + "/assets/images/chat_user.png" }} />
                          :
                          <Image style={{ flexWrap: 'wrap', width: 45, height: 45 }} source={{ uri: imagePath + 'assets/profile_image/' + this.state.userImage + '?=' + Math.random() }} />}
                      </View>
                      <View style={styles.midtextclass}>
                        <Text >{item.username}</Text>
                        <Text >{item.class_name}</Text>
                      </View>
                    </View>

                    <View style={styles.datestory}>
                      <Text style={[styles.datetext, styles.paddingTop10]}> {item.status == '1' ? <Text style={styles.viewreport}>Approved</Text> : <Text style={styles.viewreport}>Not Approved</Text>
                      }</Text>
                      <Text style={styles.datetext}>{item.date}</Text>
                    </View>
                  </View>
                  <View style={[styles.padding, styles.borderbottomstyle]}>
                    <Text> {item.message} </Text>
                    {item.ext == 'mp4' || item.ext == '3gp' ?
                      <ChatVideo videoUrl={this.video(item.image)} videoClass={styles.VideoContainer} />
                      : <Text></Text>}
                    {item.ext == 'jpg' ? <Image style={styles.storyImg} source={{
                      uri: imagePath + 'assets/student_stories/' + item.image + '?=' + Math.random()
                    }} /> : null}
                  </View>
                  <View style={styles.dashlist}>

                    <View style={[styles.editdeleteiconright, styles.padding]}>
                    {/* Edit story */}
                      <TouchableHighlight>
                        <Text style={styles.paddingstyle} onPress={() => Actions.EditStudentStory({ storyid: item.id })}>
                          <FontAwesome style={styles.editicon} >{Icons.edit}</FontAwesome>
                        </Text>
                      </TouchableHighlight>
                      {/* Delete story */}
                      <TouchableHighlight>
                        <Text style={styles.paddingleft} onPress={() => this.deleteStory(item.id)} >
                          <FontAwesome style={styles.deleteicon}>{Icons.trash}</FontAwesome>
                        </Text>
                      </TouchableHighlight>
                    </View>

                  </View>
                </View>
              }
              keyExtractor={(item, index) => index}
            />
          </View>
        </ScrollView>
      </DrawerLayoutAndroid>
    );
  }
}




