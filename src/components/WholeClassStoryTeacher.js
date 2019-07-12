import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage,Alert, ToastAndroid, TouchableHighlight, TouchableWithoutFeedback, ListView, FlatList, TouchableOpacity, Image, ScrollView, Modal, TextInput } from 'react-native';
import { Actions } from 'react-native-router-flux';
import config from '../assets/json/config.json';
import styles from '../assets/css/mainStyle';
import ClassStoryTeacherServices from '../services/ClassStoryTeacherServices';
import HideableView from 'react-native-hideable-view';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Loader from './Loader';
import ChatVideo from './ChatVideo';
import ZoomImage from './ZoomImage';
import DismissKeyboard from 'dismissKeyboard';

export default class WholeClassStory extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      loggedInUser: {},
      showLoader: 0,
      classid: '',
      class_list: "",
      pagecount: 1,
      searchTerm: '',
      modalVisible: false,
      index: 0,
      items: {},
      postCount: 1,
      teacher_ac_no: '',
      imagefolder: '',
      dataSource: {},
      posts: {},
      likes: '',
      unlike: 0,
      modalVisible: false,
      visible: false,
      likeslist: {},
      storyid: '',
      member_no: '',
      searchText: '',
      items: '',
      menuVisible: false,
      buttons: ['Class Story', 'Student Story'],
      app_token: '',
    };
  }

  async componentDidMount() {
    /* Close keypad */
    DismissKeyboard();
    /* Get loacal storage values */
    await AsyncStorage.getItem('app_token').then((value) =>
      this.setState({ "app_token": value })
    );

    await AsyncStorage.getItem('classid').then((value) => 
      this.setState({ "classid": value })
    );
    await AsyncStorage.getItem('app_token').then((value) => 
      this.setState({ "app_token": value })
    );
    await AsyncStorage.getItem('classname').then((value) =>
      this.setState({ "classname": value })
    )
     /* Set title */
    Actions.refresh({ title: this.state.classname });
    await AsyncStorage.getItem('loggedInUser').then((value) => 
       this.setState({ "loggedInUser": JSON.parse(value) })
    );
    if (this.props.parent_ac_no == null) {
      /* Get whole class story */
      await this.getwhole_classstory(this.state.classid, this.state.loggedInUser.member_no, this.state.pagecount, this.state.searchTerm);
    } else {
      /* Get student base class story */
      await this.getclassstory_student(this.state.classid, this.props.parent_ac_no, this.state.loggedInUser.member_no, this.props.student_no);
    }
  }

  /* get Whole Class Story */
  getwhole_classstory(classid, member_no, pagecount, search) {
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    ClassStoryTeacherServices.getwhole_classstory(classid, member_no, pagecount, search, objThis.state.app_token).then((response) => {
      objThis.setState({ "showLoader": 0 });
      if (response.data.comments == 'Success') {
        objThis.setState({ postCount: response.data.posts.length });
        var postItems = response.data.posts;
        for (var i = 0; i < objThis.state.postCount; i++) {
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
          /* Check like status */
          if (response.data['posts'][i]['status']) {
            for (var j = 0; j < response.data['posts'][i]['status']['length']; j++) {
              if (response.data['posts'][i]['status'][j]['member_no'] == objThis.state.loggedInUser.member_no) {
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
        objThis.setState({ items: postItems });
      } else if (response.data.status == 'Failure') {        
        objThis.setState({ items: {}});
        objThis.setState({ postCount: 1});      
      } else {
        throw new Error('Server Error!');
      }
    })
  }

  removeDollerChar(string) {
    return string.replace('$', '?');
  }

  getRandom() {
    return Math.random();
  }

  /* Get student story */
  getclassstory_student(classid, parent_ac_no, member_no, student_no) {
    var objThis = this;
    ClassStoryTeacherServices.getclassstory_student(classid, parent_ac_no, member_no, student_no, this.state.app_token).then((response) => {
      if (response.data.status == 'Success') {
        objThis.setState({ postCount: response.data.posts.length });
        objThis.setState({ items: response.data.posts });
        for (var i = 0; i < objThis.state.postCount; i++) {
          var teacher_ac_no = response.data['posts'][i]['teacher_ac_no'];
          var value1 = teacher_ac_no.toString();
          var res2 = value1.slice(0, 1);
          var imagefolder = '';
          /* Check image folder */
          if (res2 == '4') {
            objThis.state.items[i]['imagefolder'] = 'student_stories';
          } else {
            objThis.state.items[i]['imagefolder'] = 'class_stories';
          }
          /* Check like status */
         if (response.data['posts'][i]['status']) {
            for (var j = 0; j < response.data['posts'][i]['status']['length']; j++) {
              if (response.data['posts'][i]['status'][j]['member_no'] == objThis.state.loggedInUser.member_no) {
                if (response.data['posts'][i]['status'][j]['status'] == '0') {
                  objThis.state.items[i]['liked'] = 0;
                }
                else {
                  objThis.state.items[i]['liked'] = 1;
                }
              }
              else {
                objThis.state.items[i]['liked'] = 0;
              }
            }
          } else {
            objThis.state.items[i]['liked'] = 0;
          }
        }
      } else if (response.data.status == 'Failure') {
        objThis.setState({ items: {} })
        objThis.setState({ postCount: 1});
      }else {
        throw new Error('Server Error!');
      }
    })
  }

  /* Pagination on the click of more button */
  more(pagecount) {
    this.setState({ pagecount: pagecount + 1 });
    this.getwhole_classstory(this.state.classid, this.state.loggedInUser.member_no, this.state.pagecount, this.state.searchTerm);

  }

  /* Get like list */
  Likeslist(storyid, classid) {
    ClassStoryTeacherServices.Likeslist(storyid, classid, this.state.app_token).then((response) => {
      if (response.data.status == 'Success') {
        this.setState({ likeslist: response.data.like_list })
      }
    })
    this.setState({ modalVisible: true });
  }

  /* Get comment list */
  Commentlist(storyid) {
    AsyncStorage.setItem('member_no', (this.state.loggedInUser.member_no).toString());
    Actions.TeacherClassStoryComments({ storyid: storyid });
  }

  /* Close Modal */
  closeModal() {
    this.setState({ modalVisible: false });
  }

  /* Searching on the basis of text */
  SearchFilterFunction(text) {    
     var objThis =this;
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
       this.getwhole_classstory(this.state.classid, this.state.loggedInUser.member_no, this.state.pagecount, this.state.searchTerm);
    } else {
      this.setState({ items: filteredName });
    }    
  }

  /* Create video url */
  video(videoId, imagefolder) {
    return config.image_url + 'assets/' + imagefolder + '/' + videoId;
  }

  /* Like in story */
  Likesstatus(status, id) {
    /* Check lisk or dislike */
    if (status == '0') {
      var like = '+1';
      this.setState({ "showLoader": 1 });
      ClassStoryTeacherServices.likePost((id).toString(), like, this.state.loggedInUser.member_no, this.state.classid, this.state.app_token).then((response) => {
        this.setState({ "showLoader": 0 });
        if (response.data.status == 'Success') {
          ToastAndroid.showWithGravity(
            'Like successfully',
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          )
          this.getwhole_classstory(this.state.classid, this.state.loggedInUser.member_no, this.state.pagecount, this.state.searchTerm)
        }
      })
    } else {
      var like = '-1';
      this.setState({ "showLoader": 1 });
      ClassStoryTeacherServices.likePost((id).toString(), like, this.state.loggedInUser.member_no, this.state.classid, this.state.app_token).then((response) => {
        this.setState({ "showLoader": 0 });
        if (response.data.status == 'Success') {
          ToastAndroid.showWithGravity(
            'DisLike successfully',
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          )
          this.getwhole_classstory(this.state.classid, this.state.loggedInUser.member_no, this.state.pagecount, this.state.searchTerm)
        }
      })
    }
  }

/* Delete story confirmation box */
  delete_popup(id) {
    Alert.alert(
      'Class Genie',
      'Would you like to remove this class story ?',
      [
        { text: 'OK', onPress: () => this.deleteStory(id) },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: false }
    )
  }

/* Delete story */
  deleteStory(id) {
    ClassStoryTeacherServices.Deletestory(id, this.state.classid, this.state.app_token).then((response) => {

      if (response.data.status == 'Success') {
        ToastAndroid.showWithGravity(
          'Delete Successfully',
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        )
        this.getwhole_classstory(this.state.classid, this.state.loggedInUser.member_no, this.state.pagecount, this.state.searchTerm);
      } else {
        throw new Error('Server Error!');
      }
    })
  }

  render() {
    var imagePath = config.image_url;
    return (
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.storycontainer}>
        {/* Search box */}
          <View style={[styles.whitebackgrounnd, styles.padding, styles.marginBottom10]}>
            <TextInput
              style={styles.TextInputStyleClass}
              onChangeText={(text) => this.SearchFilterFunction(text)}
              underlineColorAndroid='transparent'
              placeholder="Search Here"
            />
          </View>
          {/* Add class story */}
          <View style={styles.whitebackgrounnd}>
            <View style={styles.wholeborder}>
              <View style={styles.classiconleft}>
                <Text >
                  <FontAwesome style={styles.fontwholeicon}>{Icons.userCircle}</FontAwesome>
                </Text>
              </View>
              <View style={styles.schoolstorystyle}>
                <Text style={styles.paddingTop10} onPress={() => Actions.AddClassStory({ student_no: this.props.student_no, parent_ac_no: this.props.parent_ac_no })}> What's happening in your classroom?</Text>
              </View>
              <View style={styles.whotestoryright}>
                <Text style={styles.textright}>
                  <FontAwesome style={styles.fontwholeicon}>{Icons.camera}</FontAwesome>
                </Text>
              </View>
            </View>
          </View>
         {/* Display class story */}
          <FlatList
            data={this.state.items}
            ItemSeparatorComponent={() => {
              return (
                <View style={styles.separator} />
              )
            }}
            renderItem={({ item }) =>
              <View style={[styles.whitebackgrounnd, styles.marginTop15]}>
              {/* Display post header */}
                <View style={[styles.classstoryparents, styles.padding]}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={styles.wholeimageleft}>
                      {item.teacher_name.image === '' ? <Image style={{ flexWrap: 'wrap', width: 45, height: 45 }} source={require('../assets/images/chat_user.png')} />
                        :
                        <Image style={{ flexWrap: 'wrap', width: 45, height: 45 }} source={{ uri: imagePath + '/assets/profile_image/' + item.teacher_name.image + '?=' + Math.random() }} />}

                    </View>
                    <View style={styles.midtextclass}>
                      <Text> {item.username} </Text>
                      <Text> {item.teacher_name.name} </Text>
                      <Text> {item.class_name.class_name}({item.class_name.grade})</Text>
                    </View>
                  </View>
                  <View style={styles.datestory}>
                    <Text style={[styles.datetext, styles.paddingTop10]} >
                      {item.date}
                    </Text>
                  </View>
                </View>

                {/* Display image and video */}
                <View style={[styles.padding, styles.borderbottomstyle]}>
                  <Text> {item.message} </Text>
                  {item.ext == 'mp4' || item.ext == '3gp' ?
                    <ChatVideo videoUrl={this.video(item.image, item.imagefolder)} videoClass={styles.VideoContainer} />
                    : <Text></Text>}
                  {item.ext == 'jpg' ? <ZoomImage style={styles.storyImg} imageUrl={imagePath + 'assets/' + item.imagefolder + '/' + item.image + '?=' + Math.random()} /> : null}

                  <View style={styles.commentclass}>
                    <Text style={styles.paddingstyle} onPress={() => this.Likeslist(item.id, item.class_id
                    )}> {item.likes} Like</Text>
                    <Text style={styles.paddingleft} >{item.comment_count} Comments </Text>
                  </View>
                </View>
                {/* Like and comment list */}
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
                      <Text style={styles.socialBarLabel} onPress={() => this.Likeslist(item.id, item.class_id
                      )} ></Text>
                      <TouchableOpacity style={styles.socialBarButton}>
                        <Text style={styles.paddingstyle} onPress={() => this.Commentlist(item.id)}><FontAwesome style={styles.storyfontteacher} >{Icons.comments}</FontAwesome></Text>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.editdeleteicon}>
                    {/* Edit class story */}
                      <TouchableHighlight>
                        <Text style={styles.paddingstyle} onPress={() => Actions.EditClassStory({ storyid: item.id })}>
                          <FontAwesome style={styles.editicon} >{Icons.edit}</FontAwesome>
                        </Text>
                      </TouchableHighlight>
                      {/* Delete story */}
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
            keyExtractor={(item, index) => index} />
            {/* Open modal */}
            <Modal transparent={true} visible={this.state.modalVisible} animationType={'slide'} onRequestClose={() => this.closeModal()} >
            <View style={styles.modelContainer} >
              <ScrollView>
                <Text style={styles.eventlistcolor}>Like Lists</Text>
                <View style={styles.dashcontainer}>
                  <FlatList
                    data={this.state.likeslist}
                    renderItem={({ item }) =>
                      <TouchableWithoutFeedback onPress={() => this.closeModal()}>
                        <View style={[styles.listviewpage, styles.classstoryparents]} >
                          {
                            item.name.image !== '' ?
                              <Image source={{ uri: imagePath + 'assets/profile_image/' + item.name.image + '?=' + Math.random() }} style={{ flexWrap: 'wrap', width: 32, height: 32, borderRadius: 40 / 2 }} />
                              :
                              <Image source={{ uri: config.server_path + "assets/images/chat_user.png" }} style={{ flexWrap: 'wrap', width: 32, height: 32, borderRadius: 40 / 2 }} />
                          }
                        <View style={{ flexWrap: 'wrap' }}>

                            {
                              item.name.name !== '' ?
                                <Text style={styles.listviewmargin}>{item.name.name}</Text>
                                :
                                <Text style={styles.listviewmargin}>{item.student_name}</Text>
                            }
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
    );
  }
}
