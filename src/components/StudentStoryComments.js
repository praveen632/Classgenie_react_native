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
  ToastAndroid
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from '../assets/css/mainStyle';
import config from '../assets/json/config.json';
import Menu from 'react-native-pop-menu';
import StudentStoryServices from '../services/StudentStoryServices';
import Loader from './Loader';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import ChatVideo from './ChatVideo';
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
      studentnoLike: '',
      post_message: {},
      commentCount: '',
      teachername: '',
      school_name: '',
      teacherimage: '',
      showLoader: 0,
      token: '',
      imagefolder:''
    }
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
    await AsyncStorage.getItem('studentNo').then((value) =>
      this.setState({ "studentnoLike": value })
    );
     /* get comment list on the time of page load */
    await this.loadComment();
  }

  /* Get comment */
  loadComment() {
    var objThis = this;
    /* Call function in student story services to get comment */
    StudentStoryServices.loadComment(this.props.storyid, this.state.loggedInUser.member_no, this.state.app_token).then((response) => {
      if (response.data.status == 'Success') {
        /* Set state values */
        this.setState({ comment_list: response.data.comment_list })
        this.setState({ post_message: response.data.post })
        this.setState({ commentCount: response.data.comment_list.length })
        this.setState({ teachername: response.data.teacher_name['0']['name'] })
        this.setState({ teacherimage: response.data.teacher_name['0']['image'] })
        objThis.setState({ teacher_ac_no: response.data.post['0']['teacher_ac_no'] })
        var value1= objThis.state.teacher_ac_no.toString();
        var res = value1.slice(0,1);   
      /* Check image folder */
       if(res==4){
        objThis.setState({ imagefolder: "student_stories" })            
       }else{
        objThis.setState({ imagefolder: "class_stories" })         
       }
      } else if (response.data.status == 'Failure') {
        ToastAndroid.showWithGravity(
          'Comment is not loaded successfully',
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
      } else {
        throw new Error('Server Error!');
      }
    })
  }

/* Add comment */
  addComment() {
    var objThis = this;
    objThis.setState({comment_message: '' });
    StudentStoryServices.saveComment(this.props.storyid, this.state.loggedInUser.member_no, this.props.classid, this.state.comment_message, this.state.studentnoLike, this.state.app_token).then((response) => {
      if (response.data.status == 'Success') {
        ToastAndroid.showWithGravity(
          'Comment Added successfully',
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        this.loadComment();

      } else if (esponse.data.status == 'Failure') {
        ToastAndroid.showWithGravity(
          'Comment is not able to added',
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        this.loadComment();
      }
      else {
        throw new Error('Server Error!');
      }
    })
  }

  /* Create image url */
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
           {/* Reander story details */}
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
                      {item.ext == 'jpg' ? <Image style={styles.storyImg} source={{uri: imagePath + 'assets/'+ this.state.imagefolder +'/'+ item.image + '?=' + Math.random() }} /> : <Text></Text>}

                      <View style={styles.commentclass} >
                        <Text style={styles.paddingstyle}> {item.likes}Like</Text>
                        <Text style={styles.paddingleft} >{this.state.commentCount}Comment </Text>

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
                          <Image style={{ flexWrap: 'wrap', width: 45, height: 45 }} source={{ uri: config.server_path + '/assets/images/chat_user.png' }} />
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

        <View style={styles.commentstory}>
          <View style={{ flexWrap: 'wrap', flex: 2 }}>
            <TextInput style={{ height: 40, width: '100%' }} placeholder="Add Your Comment" onChangeText={(value) => this.setState({ comment_message: value })} value={this.state.comment_message} />
          </View><TouchableOpacity onPress={() => this.addComment()}>
            <FontAwesome style={styles.sendiconstory}> {Icons.arrowCircleRight}</FontAwesome></TouchableOpacity>
        </View>
      </View>
    );
  }
}
