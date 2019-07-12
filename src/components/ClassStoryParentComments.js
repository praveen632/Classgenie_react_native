import axios from 'axios';
import React, { Component } from 'react';
import { ToastAndroid, StyleSheet, Text, View, Button, ImageBackground, Image, AsyncStorage, TextInput, ListView, ScrollView, FlatList, TouchableOpacity, Modal } from 'react-native';
import DashboardTeacher from './DashboardTeacher';
import { Router, Scene, Actions } from 'react-native-router-flux';
import styles from '../assets/css/mainStyle';
import config from '../assets/json/config.json';
import ClassStoryParentServices from '../services/ClassStoryParentServices';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Loader from './Loader';
import ChatVideo from './ChatVideo';
import DismissKeyboard from 'dismissKeyboard';

export default class ClassStoryParentComments extends Component{

  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      showLoader: 0,
      loggedInUser: {},
      class_list: "",
      pagecount: '1',
      searchTerm: '',
      index: 0,
      items: {},
      postCount: '',
      teacher_ac_no: '',
      imagefolder: '',
      dataSource: {},
      Commentlist: {},
      storyid: '',
      class_id: '',
      post: {},
      modalVisible: false,
      comment_message: '',
      post_message: {},
      commentCount: '',
      teachername: '',
      school_name: '',
      teacherimage: '',
      comment_list: {},
      imagefolder:''
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

    await AsyncStorage.getItem('storyid').then((value) =>
      this.setState({ "storyid": value })
    );

    await AsyncStorage.getItem('buffer_class_id').then((value) =>
      this.setState({ "class_id": value })
    );
    /* Get comment list */
    await this.loadCommentlist();
  }

  /* Get comment list */
  loadCommentlist() {
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    /* Call function in class story parent searvice to get comment list */
    ClassStoryParentServices.Commentlist(this.state.app_token, this.state.storyid, this.state.loggedInUser.member_no).then((response) => {
      objThis.setState({ "showLoader": 0 });
      if (response.data.status == 'Success') {
        /* Set local storage */
        objThis.setState({ comment_list: response.data.comment_list });
        objThis.setState({ post_message: response.data.post })
        objThis.setState({ commentCount: response.data.comment_list.length })
        objThis.setState({ teachername: response.data.teacher_name['0']['name'] })
        objThis.setState({ teacherimage: response.data.teacher_name['0']['image'] })
        objThis.setState({ teacher_ac_no: response.data.post['0']['teacher_ac_no'] })
        var value1= objThis.state.teacher_ac_no.toString();
        var res = value1.slice(0,1);      
      /* Check student story or class story */
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

  /* Submit comment */
  addComment() {
    var objThis = this;
    objThis.setState({comment_message: '' });
    /* Call function in class story parent service to save submit comment */
     ClassStoryParentServices.commentSave(this.state.app_token, this.state.comment_message, this.state.storyid, this.state.loggedInUser.member_no, this.state.class_id).then((response) => {
     if (response.data.status == 'Success') {
        objThis.setState({'comment_message':''});
            objThis.loadCommentlist();
        ToastAndroid.showWithGravity(
          'Comment Added successfully',
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      } else {
        throw new Error('Server Error!');
      }
    })

  }

  /* Create video path */
  video(videoId,imagefolder) {
    return config.image_url + 'assets/'+ imagefolder +'/' + videoId;
  }

  render() {
    var imagePath = config.image_url;
    var server_path = config.server_path;
    return (
      <View style={{ flex: 1 }}>
        <ScrollView keyboardShouldPersistTaps="handled">
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
                      <Text>{this.state.teachername} </Text>
                      <Text>{this.state.school_name}</Text>
                    </View>
                  </View>
                  <View style={[styles.padding, styles.borderbottomstyle]}>
                    <Text> {item.message} </Text>
                    {item.ext == 'mp4' || item.ext == '3gp' ?
                        <ChatVideo videoUrl={this.video(item.image,this.state.imagefolder)} videoClass={styles.VideoContainer} />
                        : <Text></Text>}
                      {item.ext == 'jpg' ? <Image style={styles.storyImg} source={{ uri: imagePath + 'assets/'+ this.state.imagefolder +'/'+ item.image + '?=' + Math.random() }} /> : <Text></Text>}

                    <View style={styles.commentclass} >
                      <Text style={styles.paddingstyle}> {item.likes}Like</Text>
                      <Text style={styles.paddingleft} >{this.state.commentCount}Comment </Text>
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
                        </Text>

                      </View>
                    </View>
                  </View>
                </View>
              }
              keyExtractor={(item, index) => index}
            />
          </View>
        </ScrollView>        
          <View>
          <View style={styles.commentstory}>
            <View style={{ flexWrap: 'wrap', flex: 2 }}>
              <TextInput style={{ height: 40, width: '100%' }} placeholder="Add Your Comment" onChangeText={(value) => this.setState({ comment_message: value })} value={this.state.comment_message} />
            </View>
            <TouchableOpacity onPress={() => this.addComment()}>
              <FontAwesome style={styles.sendiconstory}> {Icons.arrowCircleRight}</FontAwesome>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}    