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
  WebView,
  TouchableWithoutFeedback,
  TextInput
} from 'react-native';
import Loader from './Loader';
import { Actions } from 'react-native-router-flux';
import styles from '../assets/css/mainStyle';
import config from '../assets/json/config.json';
import StudentStoryServices from '../services/StudentStoryServices';
import Menu from 'react-native-pop-menu';
import CustomTabBar from "./CustomTabBar";
import FontAwesome, { Icons } from 'react-native-fontawesome';
import ChatVideo from './ChatVideo';
import ZoomImage from './ZoomImage';
import DismissKeyboard from 'dismissKeyboard';

export default class StudentStory extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      loggedInUser: {},
      showLoader: 0,
      classid: '',
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
      items: '',
      classList: '',
      buttons: ['Class Story', 'Student Story'],
      modalVisible: false,
      studentlist: {},
      kidstory: '0',
      student_no: '',
      parent_no: '',
      studentnoLike: '',
      imagefolder: '',
      token: '',
      profileImage: '',
    };
  }

  async componentDidMount() {
    /* Close keypad */
    DismissKeyboard();
    /* get local storage values */
    await AsyncStorage.getItem('app_token').then((value) =>
      this.setState({ "app_token": value })
    );

    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    );

    await AsyncStorage.getItem('studentNo').then((value) =>
      this.setState({ "studentnoLike": value })
    );
    /* get class list on the time to page load */
    await StudentStoryServices.getclassid(this.state.loggedInUser.member_no, this.state.app_token).then((response) => {
      if (response.data.status == 'Success') {
        this.setState({ 'classList': response.data.class_id })
      } else {
        throw new Error('Server Error!');
      }
    })
    /* Set profile image for display */
    if (this.state.loggedInUser['image']) {
      var profileImage = config.image_url + '/assets/profile_image/' + this.state.loggedInUser['image'] + '?=' + Math.random();;
    } else {
      var profileImage = config.server_path + '/assets/images/chat_user.png';
    }
    this.setState({ "profileImage": profileImage });
    await this.getClassStory(this.state.classList);
  }

  /* Left header to display profile image */
  _renderLeftHeader() {
    return (
      <View style={styles.Leftheaderstyle}>
        <View style={{ width: 40, height: 40, borderRadius: 40 / 2 }}>
          <Image style={{ width: 40, height: 40, borderRadius: 40 / 2 }} source={{ uri: this.state.profileImage }}></Image>
        </View>
      </View>
    )
  }

  /* Middle header content */
  _renderMiddleHeader() {
    return (
      <View style={styles.MiddleheaderstyleLeft}>
        <Text style={[styles.MiddleHeaderTitlestyle, styles.padding5]}>{this.state.loggedInUser.username}</Text>
      </View>
    )
  }

  /* Get class story list in parent module */
  getClassStory(classid) {
    var objThis = this;
    /* Call function in student story to get class story */
    StudentStoryServices.getClassStory(classid, this.state.pagecount, this.state.loggedInUser.member_no, this.state.app_token).then((response) => {
      if (response.data.status == 'Success') {
        var postItems = response.data.posts;
        for (var i = 0; i < response.data.posts.length; i++) {
          var teacher_ac_no = response.data['posts'][i]['teacher_ac_no'];
          var value1 = teacher_ac_no.toString();
          var res2 = value1.slice(0, 1);
          var imagefolder = '';
          /* Check image folder */
          if (res2 == '4') {
            postItems[i]['imagefolder'] = 'student_stories';
          } else {
            postItems[i]['imagefolder'] = 'class_stories';
          }
          /* Chech liske status for like or dislike */
          if (response.data['posts'][i]['status']) {
            for (var j = 0; j < response.data['posts'][i]['status']['length']; j++) {
              if (response.data['posts'][i]['status'][j]['member_no'] == this.state.loggedInUser.member_no) {
                if (response.data['posts'][i]['status'][j]['status'] == '0') {
                  postItems[i]['liked'] = 0;
                } else {
                  postItems[i]['liked'] = 1;
                }
              }
              else {
                postItems[i]['liked'] = 0;
              }
            }
          } else {
            postItems[i]['liked'] = 0;
          }
        }
        this.setState({ postCount: response.data.posts.length, items: postItems })
     } else if (response.data.status == 'Failure') {
        this.setState({ items: {} });
      } else {
        throw new Error('Server Error!');
      }
    })
  }

  /* Get student story */
  StudentStory(student_no,parent_no) {
    var objThis = this;
    this.setState({ "showLoader": 0 });
    StudentStoryServices.getStudent_ClassStory_studentno(this.state.loggedInUser.member_no,parent_no, student_no, this.state.pagecount, this.state.app_token).then((response) => {
      objThis.setState({ "showLoader": 0 });
      if (response.data.status == 'Success') {
        var postItems = response.data.posts;
        for (var i = 0; i < response.data.posts.length; i++) {
          var teacher_ac_no = response.data['posts'][i]['teacher_ac_no'];
          var value1 = teacher_ac_no.toString();
          var res2 = value1.slice(0, 1);
          var imagefolder = '';
          /* Check image folder */
          if (res2 == '4') {
            postItems[i]['imagefolder'] = 'student_stories';
          } else {
            postItems[i]['imagefolder'] = 'class_stories';
          }
          /* Check like status for like or dislike */
          if (response.data['posts'][i]['status']) {
            for (var j = 0; j < response.data['posts'][i]['status']['length']; j++) {
              if (response.data['posts'][i]['status'][j]['member_no'] == this.state.loggedInUser.member_no) {
                if (response.data['posts'][i]['status'][j]['status'] == '0') {
                  postItems[i]['liked'] = 0;
                }
                else {
                  postItems[i]['liked'] = 1;
                }
              }
              else {
                postItems[i]['liked'] = 0;
              }
            }
          } else {
            postItems[i]['liked'] = 0;
          }
        }
        objThis.setState({ postCount: response.data.posts.length, items: postItems })
      } else if (response.data.status == 'Failure') {
        objThis.setState({ items: '' });
      } else {
        throw new Error('Server Error!');
      }
    })

  }

  /* Pagination on click of more button */
  more(pagecount) {
    this.setState({ pagecount: pagecount + 1 });
    this.getClassStory(this.state.classList);
  }

/* Get student own story */
  getmyStory() {
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    StudentStoryServices.getlist(this.state.app_token, this.state.loggedInUser.member_no).then((response) => {
      objThis.setState({ "showLoader": 0 });
      if (response.data.status == 'Success') {
        this.setState({ 'studentlist': response.data.student_list })
      } else {
        throw new Error('Server Error!');
      }
    })
    this.setState({ modalVisible: true });
  }

  /* Close Modal */
  closeModal() {
    this.setState({ modalVisible: false });
  }

  /* Like list show other page */
  Likeslist(id, class_id) {
    Actions.StudentStoryLikes({ storyid: id, classid: class_id });
  }

  /* Like or dislike */
  Likesstatus(status, id, class_id) {
    if (status == '0') {
      /* Like */
      var like = '+1';
      this.setState({ "showLoader": 1 });
      StudentStoryServices.likePost((id).toString(), like, this.state.loggedInUser.member_no, class_id, this.state.studentnoLike, this.state.app_token).then((response) => {
        this.setState({ "showLoader": 0 });
        if (response.data.status == 'Success') {
          ToastAndroid.showWithGravity(
            'Like successfully',
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          )
          this.getClassStory(this.state.classList);

        } else {
          throw new Error('Server Error!');
        }
      })
    } else {
      /* Dislike */
      var like = '-1';
      this.setState({ "showLoader": 1 });
      StudentStoryServices.likePost((id).toString(), like, this.state.loggedInUser.member_no, class_id, this.state.studentnoLike, this.state.app_token).then((response) => {
        this.setState({ "showLoader": 0 });
        if (response.data.status == 'Success') {
          ToastAndroid.showWithGravity(
            'Dislike successfully',
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          )
          this.getClassStory(this.state.classList);
        } else {
          throw new Error('Server Error!');
        }
      })
    }
  }

  /* Comment list */
  Commentlist(id, class_id, token) {
    Actions.StudentStoryComments({ storyid: id, classid: class_id });
  }

  /* Get student class list */
  showclassList_student(student_no, parent_no) {
    this.setState({ modalVisible: false });
    this.StudentStory(student_no, parent_no);
  }

  /* make video url */
  video(videoId, imagefolder) {
    return config.image_url + 'assets/' + imagefolder + '/' + videoId;
  }

  /* Searching on the base of text */
  SearchFilterFunction(text) {
    let search_text = text.toLowerCase();
    let trucks = this.state.items;
    let trucks_length = this.state.items.length;
    var filteredName  = {};
    if (trucks_length > 0)
    {
      filteredName = trucks.filter((item) => {
        return item.message.toLowerCase().match(search_text)
      }) 
    } else 
    {
      filteredName = {};
    }
    if (!text || text === '') {
      this.getClassStory(this.state.classList);
    } else {
      this.setState({ items: filteredName });
    }
  }

  render() {
    var imagePath = config.image_url;
    return (
      <View>
        {this.state.showLoader == 1 ?
          <View style={styles.loaderContainer}>
            <Loader />
          </View>
          :
          <ScrollView keyboardShouldPersistTaps="handled">
            {/* start header part */}
            <View style={[styles.customHeaderContainer]}>
              {this._renderLeftHeader()}
              {this._renderMiddleHeader()}
            {/* End header part */}
            </View>
             {/* Custom tab bar */}
            <View>
              <CustomTabBar tabList={[{ 'title': 'Student Invite', actionPage: () => Actions.DashboardStudent(), tabIcon: 'users' }, { 'title': 'Story', currentTab: 1, tabIcon: 'image' }]} />
            </View>

            {/* Three tab Start */}
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
              <View  >
                <View style={styles.classbtn}>
                  <TouchableOpacity onPress={() => this.getClassStory(this.state.classList)} title="Class Story">
                    <Text style={styles.buttonText}>
                      Class Story
                          </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View >
                <View style={styles.groupbtn}>
                  <TouchableOpacity onPress={() => Actions.YourStoryStudent()} title="Your Story">
                    <Text style={styles.bcolor}>
                      Your Story
                          </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View>
                <View style={styles.groupbtn}>
                  <TouchableOpacity onPress={() => this.getmyStory()} title="My Story">
                    <Text style={styles.bcolor}>
                      My Story
                          </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
           {/* End tab */}
            {/* Search box */}
            <View style={[styles.whitebackgrounnd, styles.marginTop15, styles.storycontainer]}>
              <View style={[styles.classstoryparents, styles.padding]}>
                <TextInput
                  style={styles.TextInputStyleClass}
                  onChangeText={(text) => this.SearchFilterFunction(text)}
                  underlineColorAndroid='transparent'
                  placeholder="Search Here"
                />
              </View>
            </View>
            {/* Reander story details */}
            <FlatList
              data={this.state.items}
              ItemSeparatorComponent={() => {
                return (
                  <View style={styles.separator} />
                )
              }}
              renderItem={({ item }) =>
                <View style={[styles.whitebackgrounnd, styles.marginTop15, styles.storycontainer]}>

                  <View style={[styles.classstoryparents, styles.padding]}>
                    <View style={{ flexDirection: 'row' }}>
                      <View style={styles.wholeimageleft}>
                        {item.teacher_name.image == '' ? <Image style={{ flexWrap: 'wrap', width: 45, height: 45 }} source={{ uri: config.server_path + 'assets/images/chat_user.png' }} />
                          :
                          <Image style={{ flexWrap: 'wrap', width: 45, height: 45 }} source={{ uri: imagePath + '/assets/profile_image/' + item.teacher_name.image + '?=' + Math.random()}} />}
                      </View>
                      <View style={styles.midtextclass}>
                        <Text >{item.username}</Text>
                        <Text >{item.teacher_name.name}</Text>
                        <Text style={styles.title}>{item.class_name.class_name}({item.class_name.grade})</Text>
                      </View>
                    </View>

                    <View style={styles.datestory}>
                      <Text style={[styles.datetext, styles.paddingTop10]}>{item.date}</Text>
                    </View>
                  </View>

                  <View style={[styles.padding, styles.borderbottomstyle]}>
                    <Text> {item.message} </Text>
                    {item.ext == 'mp4' || item.ext == '3gp' ?
                      <ChatVideo videoUrl={this.video(item.image, item.imagefolder)} videoClass={styles.VideoContainer} />
                      : <Text></Text>}
                    {item.ext == 'jpg' ? <ZoomImage style={styles.storyImg} imageUrl={imagePath + 'assets/' + item.imagefolder + '/' + item.image + '?=' + Math.random()} /> : null}

                    <View style={styles.commentclass}>
                      <Text style={styles.paddingstyle} onPress={() => this.Likeslist(item.id, item.class_id
                      )}>{this.state.unlike} {item.likes} Like</Text>
                      <Text style={styles.paddingleft} >{item.comment_count} Comments </Text>
                    </View>
                  </View>

                 {/* Like and comment part */}
                  <View style={styles.dashlist}>
                    <View style={[styles.liststylepart, styles.commentclass]}>
                      <TouchableOpacity style={styles.socialBarButton} onPress={() => this.Likesstatus(item.liked, item.id, item.class_id)}>
                        {
                          item.liked == '1' ?
                            <Text style={styles.paddingstyle}>
                              <Image style={{ flexWrap: 'wrap', width: 45, height: 45 }} source={{ uri: config.server_path + '/assets/images/heart.png' + '?=' + Math.random() }} />
                            </Text>
                            :
                            <Text style={styles.paddingstyle}>
                              <Image style={{ flexWrap: 'wrap', width: 45, height: 45 }} source={{ uri: config.server_path + '/assets/images/heartblack.png' + '?=' + Math.random() }} />
                            </Text>
                        }
                      </TouchableOpacity>
                      <Text style={styles.socialBarLabel} onPress={() => this.Likeslist(item.id, item.class_id)} ></Text>
                      <TouchableOpacity style={styles.socialBarButton}>
                        <Text style={styles.paddingstyle} onPress={() => this.Commentlist(item.id, item.class_id)}><FontAwesome style={styles.storyfontteacher} >{Icons.comments}</FontAwesome></Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              }
            />

           {/* Open modal */}
            <Modal transparent={true} visible={this.state.modalVisible} animationType={'slide'} onRequestClose={() => this.closeModal()} >
              <View style={styles.modelContainer} >
                <ScrollView>
                  <Text style={styles.eventlistcolor}>
                    Kid List
                    </Text>

                  <View style={styles.dashcontainer}>
                    <FlatList
                      data={this.state.studentlist}
                      ItemSeparatorComponent={() => {
                        return (
                          <View style={styles.separator} />
                        )
                      }}
                      renderItem={({ item }) => (
                        <View style={styles.listviewclass}>
                          <View style={styles.classstoryimage}>
                            <Image style={{ width: 32, height: 32, borderRadius: 40 / 2 }} source={{ uri: config.server_path + '/assets/images/chat_user.png' }} />
                          </View>
                          <TouchableOpacity style={styles.classstorycontent} onPress={() => this.showclassList_student(item.student_no, item.parent_ac_no)}>
                            <Text>
                              {item.name} ({item.class_name})
                  </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                      keyExtractor={(item, index) => index}
                    />
                  </View>
                  <TouchableHighlight
                    style={styles.classbtn}
                    title="Close" onPress={() => this.closeModal()}  >
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableHighlight>
                </ScrollView>
              </View>
            </Modal>
            {this.state.postCount >= 10 ?
              <TouchableHighlight style={styles.classbtn}
                title="More" onPress={() => this.more(this.state.pagecount)}>
                <Text style={styles.buttonText}>More</Text>
              </TouchableHighlight> : <Text></Text>}
          </ScrollView>
        }
      </View>
    );
  }
}