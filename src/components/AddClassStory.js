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
  TouchableWithoutFeedback,
  NativeModules, NativeEventEmitter, AsyncStorage, ToastAndroid

} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { Actions } from 'react-native-router-flux';
import styles from '../assets/css/mainStyle';
import config from '../assets/json/config.json';
import ClassStoryTeacherServices from '../services/ClassStoryTeacherServices';
var FormData = require('form-data');
import axios from 'axios';
import Loader from './Loader';
import ChatVideo from './ChatVideo';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import DismissKeyboard from 'dismissKeyboard';
export default class AddClassStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: 0,
      ImageSource: null,
      post: '',
      loggedInUser: {},
      classid: '',
      section: 0,
      ImageSourceFist: null,
      VideoSource: 0
    };
  }

  async componentDidMount() {
    DismissKeyboard();
    await AsyncStorage.getItem('app_token').then((value) =>
      this.setState({ "app_token": value })
    );
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    );
    await AsyncStorage.getItem('classid').then((value) =>
      this.setState({ 'classid': value })
    );    
  }

  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    /* Opne image picker */
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
        /* For image upload */
        let sourcedes = { uri: response.uri };
        /* For Display image in time to browse */
        this.setState({
          ImageSourceFist: sourcedes
        });
        this.setState({ loadsection: 1 });
        this.setState({ section: 1 });
      }
    });
  }

  /* Add class story */
  addStory() {
    if (this.props.student_no == null) {
      if (this.state.section == 0) {
        /* Add class story only msg and call teacher service */
        ClassStoryTeacherServices.addPost(this.state.app_token, this.state.classid, this.state.post, this.state.loggedInUser.member_no, this.state.loggedInUser.username).then((response) => {
          if (response.data.status == 'Success') {
            ToastAndroid.showWithGravity(
              'Class Story Added successfully',
              ToastAndroid.LONG,
              ToastAndroid.CENTER
            );
            Actions.WholeClassStory();
          }
        })
        /* Add class story only image */
      } else if (this.state.section == '1') {
        var url = config.api_url + ':' + config.port + '/upload?token=' + this.state.app_token;
        var configHeader = {
          headers: {
            'content-type': 'multipart/form-data'
          }
        }
        const formData = new FormData();
        formData.append('upload_file', { uri: this.state.ImageSourceFist.uri, name: '1.jpg', type: "image/jpeg", chunkedMode: false });
        formData.append('message', this.state.post);
        formData.append('class_id', this.state.classid);
        formData.append('teacher_ac_no', this.state.loggedInUser.member_no);
        formData.append('sender_ac_no', this.state.loggedInUser.member_no);
        formData.append('teacher_name', this.state.loggedInUser.name);
        formData.append('token', this.state.app_token);
        return new Promise(resolve => {
          var objThis = this;
          objThis.setState({ "showLoader": 0 });
          axios.post(url, formData, configHeader)
            .then(function (response) {
              resolve(response);
              objThis.setState({ "showLoader": 0 });
              if (response.status == 200) {
                ToastAndroid.showWithGravity(
                  'Class Story Added successfully',
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER
                );
                Actions.WholeClassStory();
              }
            }
            )
            .catch((error) => {
              console.error(error);
            });
        });
      /* Add class story only video */
      } else {
        var url = config.api_url + ':' + config.port + '/upload?token=' + this.state.app_token;
        var configHeader = {
          headers: {
            'content-type': 'multipart/form-data'
          }
        }
        const formData = new FormData();
        formData.append('upload_file', { uri: this.state.ImageSourceFist, name: '1.mp4', type: "video/mp4", chunkedMode: false });
        formData.append('message', this.state.post);
        formData.append('class_id', this.state.classid);
        formData.append('teacher_ac_no', this.state.loggedInUser.member_no);
        formData.append('sender_ac_no', this.state.loggedInUser.member_no);
        formData.append('teacher_name', this.state.loggedInUser.name);
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
              Actions.WholeClassStory();
            }
            )
            .catch((error) => {
              console.error(error);
            });
        });
      }
    } else { 
       /* Add student story only msg */     
      if (this.state.section == 0) {
        ClassStoryTeacherServices.addPost_student(this.state.app_token, this.state.classid, this.state.post, this.state.loggedInUser.member_no, this.state.loggedInUser.username, this.props.parent_ac_no, this.props.student_no).then((response) => {
          if (response.data.status == 'Success') {
            ToastAndroid.showWithGravity(
              'Student Story Added successfully',
              ToastAndroid.LONG,
              ToastAndroid.CENTER
            );
            Actions.WholeClassStory();
          }
        })
      } else if (this.state.section == '1') {
        /* Add student story only image */
        var url = config.api_url + ':' + config.port + '/upload?token=' + this.state.app_token;
        var configHeader = {
          headers: {
            'content-type': 'multipart/form-data'
          }
        }
        const formData = new FormData();
        formData.append('upload_file', { uri: this.state.ImageSourceFist.uri, name: '1.jpg', type: "image/jpeg", chunkedMode: false });
        formData.append('message', this.state.post);
        formData.append('class_id', this.state.classid);
        formData.append('teacher_ac_no', this.state.loggedInUser.member_no);
        formData.append('parent_ac_no', this.props.parent_ac_no);
        formData.append('student_no', this.props.student_no);
        formData.append('sender_ac_no', this.state.loggedInUser.member_no);
        formData.append('teacher_name', this.state.loggedInUser.name);
        formData.append('token', this.state.app_token);
        return new Promise(resolve => {
          var objThis = this;
          objThis.setState({ "showLoader": 0 });
          axios.post(url, formData, configHeader)
            .then(function (response) {
              resolve(response);
              objThis.setState({ "showLoader": 0 });
              if (response.status == 200) {
                ToastAndroid.showWithGravity(
                  'Student Story Added successfully',
                  ToastAndroid.LONG,
                  ToastAndroid.CENTER
                );
                Actions.WholeClassStory();
              }
            }
            )
            .catch((error) => {
              console.error(error);
            });
        });
      } else {
       /* Add student story only video */
        var url = config.api_url + ':' + config.port + '/upload?token=' + this.state.app_token;
        var configHeader = {
          headers: {
            'content-type': 'multipart/form-data'
          }
        }
        const formData = new FormData();
        formData.append('upload_file', { uri: this.state.ImageSourceFist, name: '1.mp4', type: "video/mp4", chunkedMode: false });
        formData.append('message', this.state.post);
        formData.append('class_id', this.state.classid);
        formData.append('teacher_ac_no', this.state.loggedInUser.member_no);
        formData.append('sender_ac_no', this.state.loggedInUser.member_no);
        formData.append('parent_ac_no', this.props.parent_ac_no);
        formData.append('student_no', this.props.student_no);
        formData.append('teacher_name', this.state.loggedInUser.name);
        formData.append('token', this.state.app_token);
        return new Promise(resolve => {
          axios.post(url, formData, configHeader)
            .then(function (response) {
              resolve(response);
              ToastAndroid.showWithGravity(
                'Student Story Added successfully',
                ToastAndroid.LONG,
                ToastAndroid.CENTER
              );
              Actions.WholeClassStory();

            }
            )
            .catch((error) => {
              console.error(error);
            });
        });
      }

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
        this.setState({
          ImageSourceFist: sourcedes
        });
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
          {button_pagination}
        </View>
        <View style={{ flexDirection: 'row', marginBottom: 20 }}>
          <TouchableOpacity onPress={() => this.selectPhotoTapped()}>
            <FontAwesome style={styles.angleicon}>{Icons.camera}</FontAwesome>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.selectVideoTapped()}>
            <FontAwesome style={styles.angleicon}> {Icons.videoCamera} </FontAwesome>
          </TouchableOpacity>
        </View>
        <View style={styles.profilestyle}>
          <TextInput style={styles.TextInputStyleClass} placeholder="Add Class Story Post" onChangeText={(value) => this.setState({ post: value })} value={this.state.post} />
          <TouchableWithoutFeedback title="Add" onPress={() => this.addStory()}>
            <View style={styles.classbtn}>
              <Text style={styles.buttonText}>Add</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    );
  }
}
