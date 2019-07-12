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
  Modal,
  ToastAndroid,
  Alert,
  WebView,
  TouchableWithoutFeedback
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from '../assets/css/mainStyle';
import config from '../assets/json/config.json';
import SchoolStoryServices from '../services/SchoolStoryServices';
import ChangeSchoolService from '../services/ChangeSchoolService';
import Menu from 'react-native-pop-menu';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Video from 'react-native-video';
import ChatVideo from './ChatVideo';
import Loader from './Loader';
import ZoomImage from './ZoomImage';
import DismissKeyboard from 'dismissKeyboard';
export default class SchoolStory extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    video: Video;
    this.state = {
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
      items: '',
      buttons: ['Class Story', 'Student Story'],
      member_no: '',
      rate: 1,
      volume: 1,
      muted: false,
      resizeMode: 'contain',
      duration: 0.0,
      currentTime: 0.0,
      paused: true,
      pause1: true,
    };
  }
  
  async componentDidMount() {      
    /* Close keypad */
    DismissKeyboard();
    /* Get local storage values */
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    );

    await AsyncStorage.getItem('app_token').then((value) =>
      this.setState({ "app_token": value })
    );
   /* Get school story on the time of page load */
    this.getSchoolStory(this.state.loggedInUser.school_id, this.state.pagecount);
  }  

  /* Get school story */
  getSchoolStory(school_id, pagecount) {
    obj = this;
    /* Call function in school story searvice to get school story */
    SchoolStoryServices.getSchoolStory((school_id).toString(), (pagecount).toString(), this.state.app_token).then((response) => {
      this.setState({ postCount: response.data.post.length });
      if (response.data.comments == 'Success') {
        var postItems = response.data.post;
        for (var i = 0; i < this.state.postCount; i++) {
         /* Check like status for like or dislike */
          if (response.data['post'][i]['like_status']) {
            for (var j = 0; j < response.data['post'][i]['like_status']['length']; j++) {
              if (response.data['post'][i]['like_status'][j]['member_no'] == this.state.loggedInUser.member_no) {
                if (response.data['post'][i]['like_status'][j]['status'] == '0') {
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
        obj.setState({ items: postItems, Schoolname: response.data.school_name['0']['school_name'] });
      } else {
        throw new Error('Server Error!');
      }
    })
  }

 /* Show popover */
  showPopover() {
    this.refs.button.measure((ox, oy, width, height, px, py) => {
      this.setState({
        isVisible: true,
        buttonRect: { x: px, y: py, width: width, height: height }
      });
    });
  }

  /* Close popover */
  closePopover() {
    this.setState({ isVisible: false });
  }

  /* Back button show in left side header */
  _renderLeftHeader() {
    return (
      <View style={styles.Leftheaderstyle}>
        <TouchableWithoutFeedback onPress={() => Actions.DashboardTeacher()}>
          <View><FontAwesome style={styles.LeftheaderIconStyle}>{Icons.arrowLeft}</FontAwesome></View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  /* Show middle title in header */
  _renderMiddleHeader() {
    return (
      <View style={styles.Middleheaderstyle}>
        <Text style={styles.MiddleHeaderTitlestyle}>{this.state.Schoolname}</Text>
      </View>
    )
  }

  /* Right side header */
  _renderRightHeader() {
    return (
      <View style={styles.Rightheaderstyle}>
        <TouchableWithoutFeedback onPress={() => {
          this.setState({
            menuVisible: true,
            arrowPosition: 'topRight',
            left: undefined,
            right: 12,
          });
        }}
        >
          <View>
            <FontAwesome style={styles.RightheaderIconStyle}>{Icons.ellipsisV}</FontAwesome>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  /* Pagination work on press more butoon */
  more(pagecount) {
    this.setState({ pagecount: pagecount + 1 });
    this.getSchoolStory(this.state.loggedInUser.school_id, this.state.pagecount);

  }

  /* Get like list */
  Likeslist(storyid) {
    SchoolStoryServices.getLikelist(this.state.loggedInUser.school_id, storyid, this.state.app_token).then((response) => {
      if (response.data.status == 'Success') {
        this.setState({
          likeslist: response.data.like_list
        })
      } else if (response.data.status == 'Failure') {
        this.setState({
          likeslist: {}
        })
      } else {
        throw new Error('Server Error!');
      }
    })
    /* Open modal */
     this.setState({ modalVisible: true });
  }

  /* Close modal */
  closeModal() {
    this.setState({ modalVisible: false });
  }

  /* Comment list show in other page */
  Commentlist(storyid) {
    Actions.SchoolStoryComments({ storyid: (storyid).toString(), member_no: (this.state.loggedInUser.member_no).toString(), school_id: (this.state.loggedInUser.school_id).toString() });

  }

  /* Edit school story  */
  EditSchoolStory(id) {
    AsyncStorage.setItem('storyid', (id).toString());
    AsyncStorage.setItem('member_no', (this.state.loggedInUser.member_no).toString());
  }

  /* Confirmation box for delete */
  delete_popup(id) {
    Alert.alert(
      'Class Genie',
      'Would you like to remove this School Story',
      [
        { text: 'OK', onPress: () => this.deleteStory(id) },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: false }
    )
  }

  /* Delete school story */
  deleteStory(id) {
    SchoolStoryServices.Deletestory((id).toString(), this.state.loggedInUser.member_no, this.state.app_token).then((response) => {
      if (response.data.status == 'Success') {
        ToastAndroid.showWithGravity(
          'Post Deleted successfully',
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        this.getSchoolStory(this.state.loggedInUser.school_id, this.state.pagecount);
      } else {
        throw new Error('Server Error!');
      }
    })
  }

  /* Make Video url */
  video(videoId) {
    return config.image_url + 'assets/school_stories/' + videoId;
  }

  /* Like and dislike */
  Likesstatus(status, id) {
    if (status == '0') {
      /* Like school story */
      var like = '+1';
      this.setState({ "showLoader": 1 });
      SchoolStoryServices.likePost((id).toString(), like, this.state.loggedInUser.member_no, this.state.loggedInUser.school_id, this.state.app_token).then((response) => {
        this.setState({ "showLoader": 0 });
        if (response.data.status == 'Success') {
          ToastAndroid.showWithGravity(
            'Like successfully',
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          )
          obj.getSchoolStory(this.state.loggedInUser.school_id, this.state.pagecount);
        }
      })
    } else {
      var like = '-1';
      /* Dislike school story */
      this.setState({ "showLoader": 1 });
      SchoolStoryServices.likePost((id).toString(), like, this.state.loggedInUser.member_no, this.state.loggedInUser.school_id, this.state.app_token).then((response) => {
        this.setState({ "showLoader": 0 });
        if (response.data.status == 'Success') {
          ToastAndroid.showWithGravity(
            'Disliked successfully',
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
          obj.getSchoolStory(this.state.loggedInUser.school_id, this.state.pagecount);

        }
      })
    }
  }

  /* Function is used to change the School or Cancel them */
  cancelChangeSchool() {
    Actions.SchoolStory()
  }

  /* Change school */
  sureChangeSchool() {
    var obj = this;
    var member_no = obj.state.loggedInUser.member_no;
    ChangeSchoolService.changeSchools(obj.state.loggedInUser.member_no, this.state.app_token).then(function (response) {
      if (response.data.status == 'Success') {
        ToastAndroid.showWithGravity(
          'Your Account is  Deleted successfully please Signup first',
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        Actions.login();
      }
      else {
        throw new Error('Server Error!');
      }
    });
  }

  /* Reload school story */
  componentWillReceiveProps() {
    this.getSchoolStory(this.state.loggedInUser.school_id, this.state.pagecount);
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
          <ScrollView keyboardShouldPersistTaps="handled" >
           {/* Start header part */}
            <View style={[styles.customHeaderContainer]}>
              {this._renderLeftHeader()}
              {this._renderMiddleHeader()}
              {this._renderRightHeader()}
            </View>
           {/* End header part */}
           {/* Chenge school menu only show for principal and viceprincipal */}
            <View>
              {this.state.loggedInUser.type == '1' || this.state.loggedInUser.type == '5' ?
                <Menu visible={this.state.menuVisible} onVisible={(isVisible) => { this.state.menuVisible = isVisible }}
                  left={undefined}
                  right={12}
                  arrowPosition={this.state.arrowPosition}
                  data={[
                    {
                      title: 'Change School',
                      onPress: () => {
                        Alert.alert(
                          '',
                          'Are you sure want to Change the School ',
                          [
                            { text: 'OK', onPress: () => this.sureChangeSchool() },
                            { text: 'Cancel', onPress: () => this.cancelChangeSchool() },
                          ],
                        )
                      }
                    },
                    {
                      title: 'Teacher List',
                      onPress: () => {
                        Actions.TeacherList();
                      }
                    },
                  ]}
                  contentStyle={{ backgroundColor: 'teal' }} />
                :
                <Menu visible={this.state.menuVisible} onVisible={(isVisible) => { this.state.menuVisible = isVisible }}
                  left={undefined}
                  right={12}
                  arrowPosition={this.state.arrowPosition}
                  data={[
                    {
                      title: 'Change School',
                      onPress: () => {
                        Alert.alert(
                          '',
                          'Are you sure want to Change the School ',
                          [
                            { text: 'OK', onPress: () => this.sureChangeSchool() },
                            { text: 'Cancel', onPress: () => this.cancelChangeSchool() },
                          ],
                        )
                      }
                    },
                  ]}
                  contentStyle={{ backgroundColor: 'teal' }} />
              }
            </View>
            {/* Add school story */}
            <View style={styles.storycontainer}>
              <View style={styles.whitebackgrounnd}>
                <View style={styles.wholeborder}>
                  <View style={styles.classiconleft}>
                    <Text >
                      <FontAwesome style={styles.fontwholeicon}>{Icons.userCircle}</FontAwesome>
                    </Text>
                  </View>
                  <View style={styles.schoolstorystyle}>
                    <Text style={styles.paddingTop10} onPress={() => Actions.AddSchoolStory()}> What's happening in your School?</Text>
                  </View>
                  <View style={styles.whotestoryright}>
                    <Text style={styles.textright}>
                      <FontAwesome style={styles.fontwholeicon}>{Icons.camera}</FontAwesome>
                    </Text>
                  </View>
                </View>
              </View>
              {/* Render school story Details */}
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
                          <Image style={{ flexWrap: 'wrap', width: 45, height: 45 }} source={{ uri: config.server_path + '/assets/images/status_profile.png' + '?=' + Math.random() }} />
                        </View>
                        <View style={styles.midtextclass}>
                          <Text> {this.state.Schoolname}</Text>
                          <Text> {item.teacher_name} </Text>
                        </View>
                      </View>
                      <View style={styles.datestory}>
                        <Text style={[styles.datetext, styles.paddingTop10]} >
                          {item.date}
                        </Text>
                      </View>
                    </View>
                    <View style={[styles.padding, styles.borderbottomstyle]}>
                      <Text> {item.message} </Text>
                      {item.ext == 'mp4' || item.ext == '3gp' ?
                        <ChatVideo videoUrl={this.video(item.image)} videoClass={styles.VideoContainer} />
                        : <Text></Text>}
                      {item.ext == 'jpg' ? <ZoomImage style={styles.storyImg} imageUrl={imagePath + 'assets/school_stories/' + item.image + '?=' + Math.random()} /> : <Text></Text>}

                      <View style={styles.commentclass}>
                        <Text style={styles.paddingstyle} onPress={() => this.Likeslist(item.id)}> {item.likes} Like</Text>
                        <Text style={styles.paddingleft} >{item.comment_count} Comments </Text>
                      </View>
                    </View>
                    <View style={styles.dashlist}>
                      <View style={[styles.liststylepart, styles.commentclass]}>
                        <View style={styles.likecommentstyle}>

                          <TouchableOpacity style={styles.socialBarButton} onPress={() => this.Likesstatus(item.liked, item.id)}>
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
                          <TouchableOpacity style={styles.socialBarButton}>
                            <Text style={styles.paddingstyle} onPress={() => this.Commentlist(item.id)}><FontAwesome style={styles.storyfontteacher} >{Icons.comments}</FontAwesome></Text>
                          </TouchableOpacity>

                        </View>
                        <View style={styles.editdeleteicon}>
                        {/* Edit school story */}
                          <TouchableHighlight>
                            <Text style={styles.paddingstyle} onPress={() => Actions.EditSchoolStory({ storyid: item.id })}>
                              <FontAwesome style={styles.editicon} >{Icons.edit}</FontAwesome>
                            </Text>
                          </TouchableHighlight>
                          {/* Delete school story */}
                          <TouchableHighlight>
                            <Text style={styles.paddingleft} onPress={() => this.delete_popup(item.id)}>
                              <FontAwesome style={styles.deleteicon}>{Icons.trash}</FontAwesome>
                            </Text>
                          </TouchableHighlight>
                        </View>
                      </View>
                    </View>
                  </View>
                }
                keyExtractor={(item, index) => index}
              />

             {/* Open modal */}
              <Modal transparent={true} visible={this.state.modalVisible} animationType={'slide'} onRequestClose={() => this.closeModal()} >
                <View style={styles.modelContainer}>
                  <ScrollView>
                    <Text style={styles.eventlistcolor}>Like Lists</Text>
                    <View style={styles.dashcontainer}>
                      <FlatList
                        data={this.state.likeslist}
                        renderItem={({ item }) =>
                          <TouchableWithoutFeedback onPress={() => this.closeModal()}>
                            <View style={[styles.listviewpage, styles.classstoryparents]} >
                              {
                                item.image !== '' ?
                                  <Image style={{ flexWrap: 'wrap', width: 32, height: 32, borderRadius: 40 / 2 }} source={{ uri: imagePath + 'assets/profile_image/' + item.image + '?=' + Math.random() }} />
                                  :
                                  <Image style={{ flexWrap: 'wrap', width: 32, height: 32, borderRadius: 40 / 2 }} source={{ uri: config.server_path + "/assets/images/chat_user.png" }} />}
                              <View style={{ flexWrap: 'wrap' }}>
                                <Text style={styles.listviewmargin}> {item.name}</Text>
                              </View>
                            </View>
                          </TouchableWithoutFeedback>
                        }
                        keyExtractor={(item, index) => index}
                      />
                      <TouchableHighlight
                        style={styles.classbtn}
                        title="Close" onPress={() => this.closeModal()}  >
                        <Text style={styles.buttonText}>Close</Text>
                      </TouchableHighlight>
                    </View>

                  </ScrollView>
                </View>
              </Modal>
              {this.state.postCount >= 10 ?
                <TouchableHighlight style={styles.classbtn}
                  title="More" onPress={() => this.more(this.state.pagecount)}>
                  <Text style={styles.buttonText}>More</Text>
                </TouchableHighlight> : null}
            </View>
          </ScrollView>
        }
      </View>
    );
  }
}
