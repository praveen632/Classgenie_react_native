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
  ToastAndroid,
  TouchableWithoutFeedback,
  TouchableHighlight
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from '../assets/css/mainStyle';
import Loader from './Loader';
import ClassStoryTeacherServices from '../services/ClassStoryTeacherServices';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import config from '../assets/json/config.json';
import ChatVideo from './ChatVideo';
import DismissKeyboard from 'dismissKeyboard';
export default class TeacherClassStoryComments extends Component {

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      showLoader: 0,
      storyid: '',
      member_no: '',
      comment_list: {},
      refreshing: false,
      comment_message: '',
      classid: '',
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
      teacherimage: '',
      token: '',
      teacher_ac_no:'',
      imagefolder:''
    }
  }

  async componentDidMount() {
    /* Close keypad */
    DismissKeyboard();
    /* Get local sstorage values */
    await AsyncStorage.getItem('app_token').then((value) =>
      this.setState({ "app_token": value })
    );
    await this.setState({ 'storyid': this.props.storyid })
    await AsyncStorage.getItem('member_no').then((value) =>
      this.setState({ 'member_no': value })
    );

    await AsyncStorage.getItem('classname').then((value) =>
      this.setState({ "classname": value })
    )
    /* Set title */
    Actions.refresh({ title: this.state.classname });

    await AsyncStorage.getItem('classid').then((value) =>
      this.setState({ 'classid': value })
    );

    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    );
    /* Get comment on the time of page load */
    await this.loadComment();
  }

/* Get comment */
  loadComment(token) {
    var objThis = this;
    this.setState({ "showLoader": 0 });
    /* Call function in class story services to get comment list */
    ClassStoryTeacherServices.Commentlist(this.state.storyid, this.state.member_no, this.state.app_token).then((response) => {
      objThis.setState({ "showLoader": 0 });
      if (response.status == 200) {
        objThis.setState({ comment_list: response.data.comment_list })
        objThis.setState({ post_message: response.data.post })
        objThis.setState({ commentCount: response.data.comment_list.length })
        objThis.setState({ teachername: response.data.teacher_name['0']['name'] })
        objThis.setState({ teacherimage: response.data.teacher_name['0']['image'] })
        objThis.setState({ teacher_ac_no: response.data.post['0']['teacher_ac_no'] })
        var value1= objThis.state.teacher_ac_no.toString();
        var res = value1.slice(0,1);  
       if(res==4){
        objThis.setState({ imagefolder: "student_stories" })            
       }else{
        objThis.setState({ imagefolder: "class_stories" }) 
      }
      } else {
        throw new Error('Server Error!');
      }
    })
  }

  /* Delete comment */
  deleteComment(id, token) {
    var objThis = this;
    this.setState({ "showLoader": 0 });
    ClassStoryTeacherServices.deletecomment(id, this.state.app_token).then((response) => {
      objThis.setState({ "showLoader": 0 });
      if (response.data.status == 'Success') {
        ToastAndroid.showWithGravity(
          'Comment Delete successfully',
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        this.loadComment()
      } else {
        throw new Error('Server Error!');
      }
    })

  }

  /* Delete story */
  deleteStory() {
    var objThis = this;
    this.setState({ "showLoader": 0 });
    ClassStoryTeacherServices.Deletestory(this.state.storyid, this.state.classid, this.state.app_token).then((response) => {
      objThis.setState({ "showLoader": 0 });
      if (response.data.status == 'Success') {
        Actions.pop();
      } else {
        throw new Error('Server Error!');
      }
    })

  }

  /* Add Comment for Class Story */
  addComment() {
    var objThis = this;
    objThis.setState({comment_message: '' });
    this.setState({ "showLoader": 0 });
    ClassStoryTeacherServices.savecomment(this.state.comment_message, this.state.storyid, this.state.member_no, this.state.classid, this.state.app_token).then((response) => {
      objThis.setState({ "showLoader": 0 });
      if (response.data.status == 'Success') {
        ToastAndroid.showWithGravity(
          'Comment Added successfully',
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        this.loadComment();
      } else {
        throw new Error('Server Error!');
      }
    })
  }

  /* End Comment for Class Story */
  video(videoId,imagefolder) {
    return config.image_url + 'assets/'+ imagefolder +'/' + videoId;
  }

  render() {
    var imagePath = config.image_url;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
          <View>
            <View style={styles.storycontainer}>
              <FlatList
                data={this.state.post_message}
                renderItem={({ item }) =>
                  <View style={[styles.whitebackgrounnd, styles.marginTop15]}>
                    <View style={[styles.listviewclass, styles.padding]}>
                      <View style={styles.classstoryimage}>
                          {this.state.teacherimage == '' ? 
                          <Image style={{ flexWrap: 'wrap', width: 45, height: 45 }} source={{ uri: config.server_path + '/assets/images/chat_user.png' }} />
                          :
                          <Image style={{ flexWrap: 'wrap', width: 45, height: 45 }} source={{ uri: imagePath + '/assets/profile_image/' + this.state.loggedInUser['image'] + '?=' + Math.random()}} />}
                      </View>
                      <View style={styles.storttext}>
                        <Text>{this.state.school_name}</Text>
                        <Text>{this.state.teachername} </Text>
                      </View>
                    </View>
                    <View style={[styles.padding, styles.borderbottomstyle]}>
                      <Text> {item.message} </Text>
                      {item.ext == 'mp4' || item.ext == '3gp' ?
                        <ChatVideo videoUrl={this.video(item.image,this.state.imagefolder)} videoClass={styles.VideoContainer} />
                        : <Text></Text>}
                      {item.ext == 'jpg' ? 
                      <Image style={styles.storyImg} source={{ uri: imagePath + 'assets/'+ this.state.imagefolder +'/'+ item.image + '?=' + Math.random() }} /> 
                      : <Text>                        
                      </Text>
                    }
                      <View style={styles.commentclass}>
                        {/* new code here  */}
                        <View style={styles.likecommentstyle}>
                          <Text style={styles.paddingstyle}> {item.likes}Like</Text>
                          <Text style={styles.paddingleft} >{this.state.commentCount}Comment </Text>
                        </View>
                        <View style={styles.editdeleteicon}>
                          <TouchableHighlight>
                            <Text style={styles.paddingstyle} onPress={() => Actions.EditClassStory({ storyid: item.id })}>
                              <FontAwesome style={styles.editicon} >{Icons.edit}</FontAwesome>
                            </Text>
                          </TouchableHighlight>
                          <TouchableHighlight>
                            <Text style={styles.paddingleft} onPress={() => this.deleteStory(item.id)}>
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
              <FlatList
                data={this.state.comment_list}
                renderItem={({ item }) =>
                  <View>
                    <View style={[styles.whitebackgrounnd, styles.marginTop15]}>
                      <View style={[styles.listviewclass, styles.padding]}>
                        <View style={styles.classstoryimage}>
                        {item.name.image == '' ?
                          <Image style={{ flexWrap: 'wrap', width: 45, height: 45 }} source={{ uri: config.server_path + '/assets/images/chat_user.png' }} />
                          : 
                          <Image style={{ flexWrap: 'wrap', width: 45, height: 45 }} source={{ uri: imagePath + '/assets/profile_image' + '/' + item.name.image +'?=' + Math.random() }} />
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
                          </Text >
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
        <View style={styles.commentstory}>
          <View style={{ flexWrap: 'wrap', flex: 2 }}>
            <TextInput style={{ height: 40, width: '100%' }} placeholder="Add Your Comment" onChangeText={(value) => this.setState({ comment_message: value })} value={this.state.comment_message} />
          </View>
          <FontAwesome style={styles.sendiconstory}> <Text onPress={() => this.addComment()}>{Icons.arrowCircleRight}</Text></FontAwesome>
        </View>
      </View>
      );
  }
}
