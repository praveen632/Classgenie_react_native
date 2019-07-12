import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  PixelRatio,
  TouchableOpacity,
  Platform,
  Image,
  TextInput,
  Button,
  Alert,
  TouchableHighlight,
  NativeModules, NativeEventEmitter, AsyncStorage, ToastAndroid,
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { Actions } from 'react-native-router-flux';
import styles from '../assets/css/mainStyle';
import config from '../assets/json/config.json';
import StudentStoryServices from '../services/StudentStoryServices';
var FormData = require('form-data');
import axios from 'axios';
import Loader from './Loader';
import ChatVideo from './ChatVideo';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import DismissKeyboard from 'dismissKeyboard';
export default class AddStudentStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: 0,
      ImageSource: null,
      post: '',
      loggedInUser: {},
      classid: '',
      student_no: '',
      section: 0,
      ImageSourceFist: null,
      VideoSource: 0
    };
  }

  async componentDidMount() {
    DismissKeyboard();
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    );

    await AsyncStorage.getItem('app_token').then((value) =>
      this.setState({ "app_token": value })
    );

    await AsyncStorage.getItem('studentNo').then((value) =>
      this.setState({ "student_no": value })
    );
  }

  /* Open photo picker */
  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {

        let source = response.uri;
        this.setState({ ImageSource: source });
        /* For save image */
        let sourcedes = { uri: response.uri };
        /* for display iamge */
        this.setState({
          ImageSourceFist: sourcedes
        });
        this.setState({ loadsection: 1 });
        this.setState({ section: 1 });
      }
    });
  }

  /* Add story */
  addStory() {
    if (this.state.section == 0) {
      /* add story only msg */
      var objThis = this;
      objThis.setState({ "showLoader": 0 });
      /* Call student story services for add post */
      StudentStoryServices.addPost(this.state.app_token, this.props.classid, this.state.student_no, this.state.post, this.state.loggedInUser.member_no, this.state.loggedInUser.username).then((response) => {
        objThis.setState({ "showLoader": 0 });
        if (response.data.status == 'Success') {
          ToastAndroid.showWithGravity(
            'Student Story Added successfully',
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
          /* Move to your student story */
          Actions.YourStoryStudent()
        }
      })

    } else if (this.state.section == '1') {
      /* add story only image */
      var url = config.api_url + ':' + config.port + '/studentstory/post?token=' + config.api_token;
      var configHeader = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
      const formData = new FormData();
      formData.append('upload_file', { uri: this.state.ImageSourceFist.uri, name: '1.jpg', type: "image/jpeg", chunkedMode: false });
      formData.append('message', this.state.post);
      formData.append('class_id', this.props.classid);
      formData.append('member_no', this.state.loggedInUser.member_no);
      formData.append('student_no', this.state.student_no);
      formData.append('username', this.state.loggedInUser.username);
      formData.append('sender_ac_no', this.state.loggedInUser.member_no);
      formData.append('token', this.state.app_token);
      return new Promise(resolve => {
        axios.post(url, formData, configHeader)
          .then(function (response) {
            resolve(response);
            ToastAndroid.showWithGravity(
              'Class Story Added successfully',
              ToastAndroid.LONG,
              ToastAndroid.CENTER
            );
            /* Move to your student story */
            Actions.YourStoryStudent();
          }
          )
          .catch((error) => {
            console.error(error);
          });
      });
    } else {
      /* add story only video */
      var url = config.api_url + ':' + config.port + '/studentstory/post?token=' + this.state.app_token;
      var configHeader = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
      const formData = new FormData();
      formData.append('upload_file', { uri: this.state.ImageSourceFist, name: '1.mp4', type: "video/mp4", chunkedMode: false });
      formData.append('message', this.state.post);
      formData.append('class_id', this.props.classid);
      formData.append('member_no', this.state.loggedInUser.member_no);
      formData.append('student_no', this.state.student_no);
      formData.append('username', this.state.loggedInUser.username);
      formData.append('sender_ac_no', this.state.loggedInUser.member_no);
      formData.append('token', this.state.app_token);
      return new Promise(resolve => {
        axios.post(url, formData, configHeader)
          .then(function (response) {
            resolve(response);
            ToastAndroid.showWithGravity(
              'Video Added successfully',
              ToastAndroid.LONG,
              ToastAndroid.CENTER
            );
            Actions.YourStoryStudent();
          }
          )
          .catch((error) => {
            console.error(error);
          });
      });
    }
  }

  /* Open video picker */
  selectVideoTapped() {
    const options = {
      title: 'Video Picker',
      takePhotoButtonTitle: 'Take Video...',
      mediaType: 'video',
      videoQuality: 'medium'
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled video picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        let sourcedes = response.uri;
        /* For upload video */
        this.setState({
          ImageSourceFist: sourcedes
        });
        /* for display video */
        this.setState({ loadsection: 2 });
        this.setState({ section: 2 });
      }
    });
  }

  render() {
    var server_path = config.server_path;
    var server_path = config.server_path;
    let button_pagination = null;
    if (this.state.section == 0) {
      button_pagination = <Text>Select a Photo</Text>;
    } else if (this.state.section == 2) {
      button_pagination = <ChatVideo videoUrl={this.state.ImageSourceFist} videoClass={styles.VideoContainer} />;
    } else {
      button_pagination = <Image style={styles.ImageContainer} source={this.state.ImageSourceFist} />;
    }
    return (
      <View style={styles.container}>
        <View style={styles.selectimage}>
        {/* Show pagination */}
          {button_pagination}
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
            <FontAwesome style={styles.angleicon}>{Icons.camera}</FontAwesome>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.selectVideoTapped.bind(this)}>
            <FontAwesome style={styles.angleicon}> {Icons.videoCamera} </FontAwesome>
          </TouchableOpacity>
        </View>

        <View style={styles.profilestyle}>
          <Text style={styles.marginLeft20}>{this.props.class_name}</Text>
          <TextInput style={[styles.styleinput, styles.profileinput]} placeholder="Add Student Story Post" onChangeText={(value) => this.setState({ post: value })} value={this.state.post} />
          <TouchableHighlight style={styles.classbtn} title="Add" onPress={() => this.addStory()} >
            <Text style={styles.buttonText}> Add</Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}
