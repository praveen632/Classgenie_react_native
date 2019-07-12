import React, { Component } from 'react';
import {
  StyleSheet, Text, Button,
  AsyncStorage,
  ListView,
  FlatList,
  TouchableOpacity,
  Image,
  ScrollView,
  TextInput,
  View,
  TouchableWithoutFeedback,
  ToastAndroid,
  TouchableHighlight,
  Alert
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from '../assets/css/mainStyle';
import SchoolStoryServices from '../services/SchoolStoryServices';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import ChatVideo from './ChatVideo';
import config from '../assets/json/config.json';
import DismissKeyboard from 'dismissKeyboard';

export default class SchoolStoryComments extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      storyid: '',
      member_no: '',
      comment_list: {},
      refreshing: false,
      comment_message: '',
      school_id: '',
      order: 1,
      menuVisible: false,
      arrowPosition: 'topRight',
      left: 12,
      right: undefined,
      color: '#F5FCFF',
      post_message: {},
      commentCount: '',
      teachername: '',
      school_name: '',
      loggedInUser: {}
    }
  }

  async componentDidMount() {
    /* Close keypad */
    DismissKeyboard();
    /* Get local storage values */
    await AsyncStorage.getItem('app_token').then((value) =>
      this.setState({ "app_token": value })
    );

    await AsyncStorage.getItem('Schoolname').then((value) =>
      this.setState({ 'school_name': value })
    );

    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    );
     /* Get comment list on the time of page load */
    await this.loadComment();
  }

 /* Get comment list */
  loadComment() {
    var objThis = this;
     /* Call function in school story searvice to get comment list */
    SchoolStoryServices.loadComment(this.props.storyid, this.props.member_no, this.state.app_token).then((response) => {
      if (response.data.status == 'Success') {
        objThis.setState({ 
          comment_list: response.data.comment_list,
          commentCount: response.data.comment_list.length,
          teachername: response.data.teacher_name['0']['name'],
          post_message: response.data.post
        })
             
      } 
    })
  }

 /* Confirmation box for delete */
  delete_popup(id) {
    Alert.alert(
      'Class Genie',
      'Do you want to remove the Post from the School Story',
      [
        { text: 'OK', onPress: () => this.deleteStory(id) },
        { text: 'Cancel', style: 'cancel' },
      ],
      { cancelable: false }
    )
  }

   /* Delete story */
  deleteStory(id) {
    SchoolStoryServices.Deletestory((id).toString(), this.props.member_no, this.state.app_token).then((response) => {
      if (response.data.status == 'Success') {
        ToastAndroid.showWithGravity(
          'Post Deleted successfully',
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        Actions.SchoolStory();
      } 
    })
  }

 /* Create video storage */
  video(videoId) {
    return config.image_url + 'assets/school_stories/' + videoId;
  }

 /* Add comment */
  addComment() {
    this.setState({comment_message: '' });
    SchoolStoryServices.saveComment(this.state.comment_message, this.props.storyid, this.props.member_no, this.props.school_id, this.state.app_token).then((response) => {
      if (response.data.status == 'Success') {
        ToastAndroid.showWithGravity(
          'Comment Added successfully',
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        // this.textInput.clear();
        this.loadComment();
      } else {
        this.textInput.clear();
        }
    })
  }

  render() {
    var imagePath = config.image_url;
    var server_path = config.server_path;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View>
            {/* Reander story part */}
            <View style={styles.storycontainer}>
              <FlatList
                data={this.state.post_message}
                renderItem={({ item }) =>
                  <View style={[styles.whitebackgrounnd, styles.marginTop15]}>
                    <View style={[styles.listviewclass, styles.padding]}>
                      <View style={styles.classstoryimage}>
                        {item.teacher_name.image == '' ? <Image style={{ flexWrap: 'wrap', width: 45, height: 45 }} source={{ uri: config.server_path + '/assets/images/chat_user.png' }} />
                          :
                          <Image style={{ flexWrap: 'wrap', width: 45, height: 45 }} source={{ uri: imagePath + '/assets/profile_image/' + this.state.loggedInUser['image'] + '?=' + Math.random() }} />}
                      </View>
                      <View style={styles.storttext}>
                        <Text>{this.state.school_name}</Text>
                        <Text>{this.state.teachername} </Text>
                      </View>
                    </View>
                    <View style={[styles.padding, styles.borderbottomstyle]}>
                      <Text> {item.message} </Text>

                      {item.ext == 'mp4' || item.ext == '3gp' ?
                        <ChatVideo videoUrl={this.video(item.image)} videoClass={styles.VideoContainer} />
                        : <Text></Text>}
                      {item.ext == 'jpg' ? <Image style={styles.storyImg} source={{ uri:imagePath + 'assets/school_stories/' + item.image +'?=' + Math.random() }} /> : <Text></Text>}
                      <View style={styles.commentclass}>
                        {/* new code here  */}
                        <View style={styles.likecommentstyle}>
                          <Text style={styles.paddingstyle}> {item.likes}Like</Text>
                          <Text style={styles.paddingleft} >{this.state.commentCount}Comment </Text>
                        </View>
                        <View style={styles.editdeleteicon}>
                          <TouchableHighlight>
                            <Text style={styles.paddingstyle} onPress={() => Actions.EditSchoolStory({ storyid: item.id })}>
                              <FontAwesome style={styles.editicon} >{Icons.edit}</FontAwesome>
                            </Text>
                          </TouchableHighlight>
                          <TouchableHighlight>
                            <Text style={styles.paddingleft} onPress={() => this.delete_popup(item.id)}>
                              <FontAwesome style={styles.deleteicon}>{Icons.trash}</FontAwesome>
                            </Text>
                          </TouchableHighlight>
                        </View>
                        {/* new code here   end */}
                      </View>
                    </View>
                  </View>
                }
                keyExtractor={(item, index) => index}
              />
              {/* Reander comment list */}
              <FlatList
                data={this.state.comment_list}
                renderItem={({ item }) =>
                  <View>

                    <View style={[styles.whitebackgrounnd, styles.marginTop15]}>
                      <View style={[styles.listviewclass, styles.padding]}>
                        <View style={styles.classstoryimage}>
                        {item.name.image == '' ?
                          <Image style={{ flexWrap: 'wrap', width: 45, height: 45 }} source={{ uri: server_path + '/assets/images/chat_user.png' }} />
                          : <Image style={{ flexWrap: 'wrap', width: 45, height: 45 }} source={{ uri: imagePath + '/assets/profile_image' + '/' + item.name.image +'?=' + Math.random() }} />
                        }
                        </View>
                        <View style={styles.storycomment}>
                         
                          {item.name.name == '' ?
                            <Text style={{fontWeight:'bold'}}>
                              {item.student_name}
                            </Text>
                            : <Text style={{fontWeight:'bold'}}>
                             {item.name.name}
                            </Text>}
                            <Text >
                            {item.comment}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </View>
                }
                keyExtractor={(item, index) => index}
              />
            </View>
          </View>
        </ScrollView>

        <View>
          <View style={styles.commentstory}>
            <View style={{ flexWrap: 'wrap', flex: 2 }}>
              <TextInput style={{ height: 40, width: '100%' }} placeholder="Add Your Comment" onChangeText={(value) => this.setState({ comment_message: value })} value={this.state.comment_message} />
            </View>
            <FontAwesome style={styles.sendiconstory}> <Text onPress={() => this.addComment()}>{Icons.arrowCircleRight}</Text></FontAwesome>
          </View>
        </View>

      </View>
    );
  }
}