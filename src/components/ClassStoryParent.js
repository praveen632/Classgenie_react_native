import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, ImageBackground, ToastAndroid, TouchableHighlight, Image, TouchableWithoutFeedback, AsyncStorage, TextInput, ListView, ScrollView, FlatList, TouchableOpacity, Modal, SearchBar } from 'react-native';
import DashboardTeacher from './DashboardTeacher';
import styles from '../assets/css/mainStyle';
import config from '../assets/json/config.json';
import ClassStoryParentServices from '../services/ClassStoryParentServices';
import CustomTabBar from "./CustomTabBar";
import Menu from 'react-native-pop-menu';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Loader from './Loader';
import ChatVideo from './ChatVideo';
import ZoomImage from './ZoomImage';
import DismissKeyboard from 'dismissKeyboard';

export default class ClassStoryParent extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      showLoader: 0,
      loggedInUser: {},
      class_list: "",
      pagecount: 1,
      searchTerm: '',
      index: 0,
      items: {},
      postCount: 1,
      teacher_ac_no: '',
      imagefolder: '',
      dataSource: {},
      kidlist: {},
      modalVisible: false,
      searchText: '',
      text: '',
      buttons: ['Class Story', 'Student Story'],
      profileImage: '',
      menuVisible: false,
      storymenu: true
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
    await AsyncStorage.getItem('app_token').then((value) =>
     this.setState({ "app_token": value })
    );
     
    /* Call function in class story searvice to get class list */   
    await ClassStoryParentServices.getClassList(this.state.loggedInUser.member_no).then((response) => {
      if (response.data.status == 'Success') {
        this.setState({ class_list: response.data.class_id })
      } else {
        throw new Error('Server Error!');
      }
    })
    /* Get Class story */
    await this.loadClassStory(this.state.class_list, this.state.pagecount, this.state.loggedInUser.member_no, this.state.searchTerm);
    /* Display profile image */
    if (this.state.loggedInUser['image']) {
      var profileImage = config.image_url + '/assets/profile_image/' + this.state.loggedInUser['image'] + '?=' + Math.random();;
    } else {
      var profileImage = config.server_path + '/assets/images/chat_user.png';
    }
    this.setState({ "profileImage": profileImage });
  }

  /* Get class story list */
  loadClassStory(class_id, pagecount, member_no, searchTerm) {
    var obj = this;
    /* Call function in story parent to get class story data */
    ClassStoryParentServices.getClassStory(this.state.app_token, class_id, pagecount, member_no, searchTerm).then((response) => {
      if (response.data.status == 'Success') {
        var postItems = response.data.posts;
        for (var i = 0; i < response.data.posts.length; i++) {
          var teacher_ac_no = response.data['posts'][i]['teacher_ac_no'];
          var value1 = teacher_ac_no.toString();
          var res2 = value1.slice(0, 1);
          var imagefolder = '';
          /* Check student story or class story like status */
          if (res2 == '4') {
            postItems[i]['imagefolder'] = 'student_stories';
          } else {
            postItems[i]['imagefolder'] = 'class_stories';
          }
          if (response.data['posts'][i]['status']) {
            for (var j = 0; j < response.data['posts'][i]['status']['length']; j++) {
              if (response.data['posts'][i]['status'][j]['member_no'] == obj.state.loggedInUser.member_no) {
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
        obj.setState({ postCount: response.data.posts.length, items: postItems });
      } else if (response.data.status == "Failure") {
        obj.setState({ items: {} });
      } else {
        throw new Error('Server Error!');
      }
    })
  }

 /* Get Random values */
  getRandom() {
    return Math.random();
  }

 /* Get Like list and to class story parent like page */
  Likeslist(id, class_id) {
    Actions.ClassStoryParentLikes({ storyid: (id).toString(), class_id: class_id });
  }

  /* Get comment list and move class story parent comment page */
  Commentlist(id, class_id) {
    AsyncStorage.setItem('storyid', (id).toString());
    AsyncStorage.setItem('buffer_class_id', class_id);
    Actions.ClassStoryParentComments();
  }

  /* open model for parent kids list */
  openModal() {
    var obj = this;
    obj.setState({ "showLoader": 0 });
    /* Call function in parent service to get kid list */
    ClassStoryParentServices.parent_kidlist(this.state.app_token, this.state.loggedInUser.member_no).then((response) => {
      obj.setState({ "showLoader": 0 });
      if (response.status == '200') {
        obj.setState({ modalVisible: true });
        obj.setState({ kidlist: response.data.student_list });
      } else {
        throw new Error('Server Error!');
      }
    })

  }

  /* Close modal and load student story */
  closeModal(student_no) {
    this.setState({ modalVisible: false, storymenu: false }, () => { this.load_student_story(student_no) });
  }

  /* Remove modal */
  removeModal() {
    this.setState({ modalVisible: false, storymenu: false });
  }

  /* Get Student story */
  load_student_story(student_no) {
    var obj = this;
    obj.setState({ "showLoader": 0 });
    /* Call class story parent service to get student story */
    ClassStoryParentServices.student_story(this.state.app_token, this.state.pagecount, student_no, this.state.loggedInUser.member_no, this.state.searchTerm).then((response) => {
      obj.setState({ "showLoader": 0 });
      if (response.data.status == 'Success') {
        var postItems = response.data.posts;
        for (var i = 0; i < response.data.posts.length; i++) {
          var teacher_ac_no = response.data['posts'][i]['teacher_ac_no'];
          var value1 = teacher_ac_no.toString();
          var res2 = value1.slice(0, 1);
          var imagefolder = '';
          /* To check student story and class story like status */
          if (res2 == '4') {
            postItems[i]['imagefolder'] = 'student_stories';
          } else {
            postItems[i]['imagefolder'] = 'class_stories';
          }
          if (response.data['posts'][i]['status']) {
            for (var j = 0; j < response.data['posts'][i]['status']['length']; j++) {
              if (response.data['posts'][i]['status'][j]['member_no'] == obj.state.loggedInUser.member_no) {
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
        obj.setState({ postCount: response.data.posts.length, items: postItems });
      } else if (response.data.status == "Failure") {
        this.setState({ items: {} });
        this.setState({ postCount: 0 });
      }
      else {
        throw new Error('Server Error!');
      }
    })
  }

  /* Search by text values */
  SearchFilterFunction(text) {
    var objThis = this;
    let search_text = text.toLowerCase();
    let trucks = this.state.items;
    let trucks_length = this.state.items.length;
    var filteredName = {};
    if (trucks_length > 0) {
      filteredName = trucks.filter((item) => {
        return item.message.toLowerCase().match(search_text)
      })
    } else {
      filteredName = {};
    }
    if (!text || text === '') {
      this.loadClassStory(this.state.class_list, this.state.pagecount, this.state.loggedInUser.member_no, this.state.searchTerm);
    } else {
      this.setState({ items: filteredName });
    }
  }

  /* Render left header in profile picture */
  _renderLeftHeader() {
    return (
      <View style={styles.Leftheaderstyle}>
        <View style={{ width: 40, height: 40, borderRadius: 40 / 2 }}>
          <Image style={{ width: 40, height: 40, borderRadius: 40 / 2 }} source={{ uri: this.state.profileImage }}></Image>
        </View>
      </View>
    )
  }

  /* Rander middle header title */
  _renderMiddleHeader() {
    return (
      <View style={styles.Middleheaderstyle}>
        <Text style={styles.MiddleHeaderTitlestyle}>{this.state.loggedInUser.name}'s Dashboard</Text>
      </View>
    )
  }

  /* Rander right header popover */
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

/* Likes list */
  Likesstatus(status, id, class_id) {
    /* Like list */
    if (status == '0') {
      var like = '+1';
      this.setState({ "showLoader": 1 });      
      ClassStoryParentServices.likePost((id).toString(), like, this.state.loggedInUser.member_no, class_id, this.state.app_token).then((response) => {
        this.setState({ "showLoader": 0 });
        if (response.data.status == 'Success') {
          ToastAndroid.showWithGravity(
            'Liked Successfully',
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          )
          /* get class story */
          this.loadClassStory(this.state.class_list, this.state.pagecount, this.state.loggedInUser.member_no, this.state.searchTerm);
        }
      })
    } else {
      /* Dislike list */
      var like = '-1';
      this.setState({ "showLoader": 1 });
      ClassStoryParentServices.likePost((id).toString(), like, this.state.loggedInUser.member_no, class_id, this.state.app_token).then((response) => {
        this.setState({ "showLoader": 0 });
        if (response.data.status == 'Success') {
          ToastAndroid.showWithGravity(
            'DisLiked Successfully',
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          )
          /* Get class story */
          this.loadClassStory(this.state.class_list, this.state.pagecount, this.state.loggedInUser.member_no, this.state.searchTerm);
        }
      })
    }
  }

  /* Pagination */
  more(pagecount) {
    this.setState({ pagecount: pagecount + 1 });
    this.loadClassStory(this.state.class_list, this.state.pagecount, this.state.loggedInUser.member_no, this.state.searchTerm);

  }

  /* make video url */
  video(videoId, imagefolder) {
    return config.image_url + 'assets/' + imagefolder + '/' + videoId;
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
          {/* Start header parts */}
            <View style={[styles.customHeaderContainer]}>
              {this._renderLeftHeader()}
              {this._renderMiddleHeader()}
              {this._renderRightHeader()}
            </View>
            {/* End header parts */}
            {/* Start Custom bar */}
            <View>
              <CustomTabBar tabList={[{ 'title': 'Class Story', currentTab: 1, tabIcon: 'users' },
              { 'title': 'Message', actionPage: () => Actions.MessageParent(), tabIcon: 'envelope' },
              { 'title': 'Your Kids', actionPage: () => Actions.YourkidsParent(), tabIcon: 'image' }]} />
            </View>
            {/* Close Custom bar */}
            {/* Start Tab parts */}
            <View style={styles.storycontainer}>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <View style={{ flex: 1, width: '50%' }} >
                  <View style={styles.classbtn}>
                    <TouchableOpacity disabled={this.state.storymenu} onPress={() => this.loadClassStory(this.state.class_list, this.state.pagecount, this.state.loggedInUser.member_no, this.state.searchTerm)} title="Class_Story">
                      <Text style={styles.buttonText}>
                        Class Story
                </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={{ flex: 1, width: '50%' }} >
                  <View style={styles.groupbtn}>
                    <TouchableOpacity onPress={() => this.openModal()} title=" Student_Story">
                      <Text style={styles.bcolor}>
                        Student Story
                </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
              {/* Close tab parts */}
              {/* Search text filed */}
              <View style={[styles.whitebackgrounnd, styles.padding]}>
                <TextInput
                  style={styles.TextInputStyleClass}
                  onChangeText={(text) => this.SearchFilterFunction(text)}
                  underlineColorAndroid='transparent'
                  placeholder="Search Here"
                />
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
                  <View style={[styles.whitebackgrounnd, styles.marginTop15]}>

                    <View style={[styles.classstoryparents, styles.padding]}>

                      <View style={{ flexDirection: 'row' }}>
                        <View style={styles.wholeimageleft}>
                          {item.teacher_name.image === '' ? <Image style={{ flexWrap: 'wrap', width: 45, height: 45 }} source={require('../assets/images/chat_user.png')} />
                            :
                            <Image style={{ flexWrap: 'wrap', width: 45, height: 45 }} source={{ uri: imagePath + '/assets/profile_image/' + item.teacher_name.image }} />}
                        </View>
                        <View style={styles.midtextclass}>
                          <Text style={styles.title}>{item.username}</Text>
                          <Text style={styles.title}>{item.teacher_name.name}</Text>
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
                        <Text style={styles.socialBarLabel} onPress={() => this.Likeslist(item.id, item.class_id
                        )} ></Text>
                        <TouchableOpacity style={styles.socialBarButton}>
                          <Text style={styles.paddingstyle} onPress={() => this.Commentlist(item.id, item.class_id)}><FontAwesome style={styles.storyfontteacher} >{Icons.comments}</FontAwesome></Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                  </View>
                }
              />
            </View>
            {/* More button for pagination */}
            {this.state.postCount >= 10 ?
              <TouchableHighlight style={styles.classbtn}
                title="More" onPress={() => this.more(this.state.pagecount)}>
                <Text style={styles.buttonText}>More</Text>
              </TouchableHighlight> : null}
              {/* Start Modal parts */}
            <Modal
              visible={this.state.modalVisible}
              animationType={'slide'}
              onRequestClose={() => this.closeModal()}
              transparent={true}
            >
              <View style={styles.modelContainer} >
                <ScrollView>
                  <View>
                    <Text style={[styles.textchange, styles.listviewmargin]}>
                      Kid List
               </Text>
                  </View>

                  <View style={styles.backchange}>
                    <FlatList
                      data={this.state.kidlist}
                      ItemSeparatorComponent={() => {
                        return (
                          <View style={styles.separator} />
                        )
                      }}
                      renderItem={({ item }) => (
                        <View style={styles.listviewclass}>
                          <View style={styles.classstoryimage}>
                            <Image style={{ width: 50, height: 50 }} source={{ uri: config.server_path + '/assets/images/chat_user.png' }} />
                          </View>
                          <TouchableOpacity style={styles.classstorycontent} onPress={() => this.closeModal(item.student_no)}>
                            <Text>
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      )}
                      keyExtractor={(item, index) => index}
                    />
                  </View>
                  <TouchableHighlight
                    style={styles.classbtn}
                    title="Close" onPress={() => this.removeModal()}  >
                    <Text style={styles.buttonText}>Close</Text>
                  </TouchableHighlight>
                </ScrollView>
              </View>
            </Modal>
           {/* Start menu parts */}
            <Menu visible={this.state.menuVisible}
              onVisible={(isVisible) => {
                this.state.menuVisible = isVisible
              }}
              left={this.state.left}
              right={this.state.right}
              arrowPosition={this.state.arrowPosition}
              data={[
                {
                  title: 'Account',
                  onPress: () => {
                    Actions.ParentProfile()

                  }
                },
                {
                  title: 'Remove Student',
                  onPress: () => {
                    Actions.ParentRemoveStudent()
                  }
                },
                {
                  title: 'Assignment ',
                  onPress: () => {
                    Actions.ParentAssignmentKidList()
                  }
                },
                {
                  title: 'Event List',
                  onPress: () => {
                    Actions.ParentEventList()
                  }
                },
              ]}
              contentStyle={{ backgroundColor: 'teal' }} />
          </ScrollView>
        }
      </View>
    );
  }
}


