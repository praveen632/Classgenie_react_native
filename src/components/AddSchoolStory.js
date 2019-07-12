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
  NativeModules, NativeEventEmitter, AsyncStorage, ToastAndroid, DeviceEventEmitter

} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { Actions } from 'react-native-router-flux';
import styles from '../assets/css/mainStyle';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import config from '../assets/json/config.json';
import SchoolStoryServices from '../services/SchoolStoryServices';
var FormData = require('form-data');
import axios from 'axios';
import Loader from './Loader';
import ChatVideo from './ChatVideo';
import DismissKeyboard from 'dismissKeyboard';
export default class AddSchoolStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: 0,
      ImageSource: null,
      post: '',
      loggedInUser: {},
      school_id: '',
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
      this.setState({ "loggedInUser": JSON.parse(value) }));
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
        /* For display image */
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
    /* Add school story only msg */
    if (this.state.section == 0) {
      var objThis = this;
      objThis.setState({ "showLoader": 0 });
      /* Call school story service for add story */
      SchoolStoryServices.addPost(this.state.app_token, this.state.post, this.state.loggedInUser.member_no, this.state.loggedInUser.school_id).then((response) => {
        objThis.setState({ "showLoader": 0 });
        if (response.data.status == 'Success') {
          ToastAndroid.showWithGravity(
            'School Story Added successfully',
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
          Actions.SchoolStory();
        }
      })

    } else if (this.state.section == '1') {
      /* Add school story only Image */
      var url = config.api_url + ':' + config.port + '/schoolstory/post?token=' + this.state.app_token;
      var configHeader = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
      const formData = new FormData();
      formData.append('upload_file', { uri: this.state.ImageSourceFist.uri, name: '1.jpg', type: "image/jpeg", chunkedMode: false });
      formData.append('message', this.state.post);
      formData.append('school_id', this.state.loggedInUser.school_id);
      formData.append('teacher_ac_no', this.state.loggedInUser.member_no);
      formData.append('sender_ac_no', this.state.loggedInUser.member_no);
      formData.append('token', this.state.app_token);
      return new Promise(resolve => {
        var objThis = this;
        objThis.setState({ "showLoader": 0 });
        axios.post(url, formData, configHeader)
          .then(function (response) {
            objThis.setState({ "showLoader": 0 });
            resolve(response);
            if (response.status == 200) {
              ToastAndroid.showWithGravity(
                'School Story Added successfully',
                ToastAndroid.LONG,
                ToastAndroid.CENTER
              );
              Actions.SchoolStory();
            }
          }
          )
          .catch((error) => {
            console.error(error);
          });

      });
    } else {
        /* Add school story only Video */
      var url = config.api_url + ':' + config.port + '/schoolstory/post?token=' + this.state.app_token;
      var configHeader = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
      const formData = new FormData();
      formData.append('upload_file', { uri: this.state.ImageSourceFist, name: '1.mp4', type: "video/mp4", chunkedMode: false });
      formData.append('message', this.state.post);
      formData.append('school_id', this.state.loggedInUser.school_id);
      formData.append('teacher_ac_no', this.state.loggedInUser.member_no);
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
             /* Move school story page */
            Actions.SchoolStory();
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
         /* For save image */
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
        {/* For pagination */}
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
          <TextInput style={styles.TextInputStyleClass} placeholder="Add School Story Post" onChangeText={(value) => this.setState({ post: value })} value={this.state.post} />
          <TouchableHighlight
            style={styles.classbtn}
            title="Add"
            onPress={() => this.addStory()} >
            <Text style={styles.buttonText}>
              Add
            </Text>
          </TouchableHighlight>
        </View>
      </View>
    );
  }
}
