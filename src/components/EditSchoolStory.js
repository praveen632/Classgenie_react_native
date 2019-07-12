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
  NativeModules, NativeEventEmitter, AsyncStorage, ToastAndroid
} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import { Actions } from 'react-native-router-flux';
import styles from '../assets/css/mainStyle';
import config from '../assets/json/config.json';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import SchoolStoryServices from '../services/SchoolStoryServices';
import axios from 'axios';
import Loader from './Loader';
import ChatVideo from './ChatVideo';
import DismissKeyboard from 'dismissKeyboard';
var FormData = require('form-data');

export default class EditSchoolStory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: 0,
      ImageSource: null,
      post: '',
      loggedInUser: {},
      classid: '',
      storyid: '',
      member_no: '',
      ImageSourceFist: null,
      section:0,
      loadsection:0
    };
  }

  async componentDidMount() {
    /* Close Keypad */
    DismissKeyboard();
    /* Get local storage values */
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    );

    await AsyncStorage.getItem('app_token').then((value) =>
      this.setState({ "app_token": value })
    );
    /* Get school story */
    this.loadStory();
  }

  /* Create video url */
  video(videoId) {
    return config.image_url + 'assets/school_stories/' + videoId;
  }

  /* Get school story */
  loadStory() {
    var objThis = this;
    /* Call function in school story services to get school story */
     SchoolStoryServices.loadPost_id(this.state.app_token, this.props.storyid, this.state.loggedInUser.member_no).then((response) => {
      if (response.data.status == 'Success') {
        var post_data = response.data.post['0'];
        this.setState({ 'post': post_data.message })    
      if (response.data.post['0']['image'] == '' || response.data.post['0']['image'] == 'undefined') {
          this.setState({
            ImageSourceFist: null
          });
          this.setState({ loadsection: 0 });
        }
         else if (response.data.post['0']['ext'] == 'mp4' || response.data.post['0']['ext'] == '3gp') 
        {
          var img = '';
          var imgage = config.image_url + 'assets/school_stories/' + response.data.post['0']['image'] + '?=' + Math.random();
         this.setState({
            ImageSourceFist: imgage
          });
          this.setState({ loadsection: 2 });
        } else {
          var img = '';
          var imgage = config.image_url + 'assets/school_stories/' + response.data.post['0']['image'] + '?=' + Math.random();
          let source = { uri: imgage };
          this.setState({
            ImageSourceFist: source
          });
          this.setState({ loadsection: 1 });
        }
      }
    })
  }

  /* Open image picker */
  selectPhotoTapped() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };
    this.setState({ loadsection: 1});
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
        /* Set local to upload image */
        let sourcedes = { uri: response.uri };
        /* Set local to display image */
        this.setState({
          ImageSourceFist: sourcedes
        });        
        this.setState({ section: 1 });               
      }
    });
  }

  /* Open video picker */
  selectVideoTapped(){
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

  /* Edit school story */
  EditStory() {
    if (this.state.section == 0) {
      /* Update only text school story */
      var objThis = this;
      objThis.setState({ "showLoader": 0 });
      SchoolStoryServices.UpdatePost(this.state.app_token,this.state.post,this.state.loggedInUser.member_no, this.props.storyid).then((response) => {
        objThis.setState({ "showLoader": 0 });
        if (response.status == 200) {
          ToastAndroid.showWithGravity(
            'School Story Updated successfully',
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
          Actions.SchoolStory();
        }
      })

    } else if(this.state.section == 2)
    {
      /* Update only image */
      var obj = this;
      var url = config.api_url + ':' + config.port + '/schoolstory/post_update?token=' + this.state.app_token;
      var configHeader = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
      const formData = new FormData();
      formData.append('upload_file', { uri: this.state.ImageSourceFist, name: '1.mp4', type: "video/mp4", chunkedMode: false });
      formData.append('message',this.state.post);
      formData.append('id',(this.props.storyid).toString());
      formData.append('sender_ac_no',this.state.loggedInUser.member_no);
      return new Promise(resolve => {
        axios.post(url, formData, configHeader)
          .then(function (response) {
            resolve(response);
            ToastAndroid.showWithGravity(
              'School Story Updated successfully',
              ToastAndroid.LONG,
              ToastAndroid.CENTER
            );
            Actions.SchoolStory();
  
          }
          )
          .catch((error) => {
            console.error(error);
          });
      });
   } else {
    /* Update only video */
    var url = config.api_url + ':' + config.port + '/schoolstory/post_update?token=' + this.state.app_token;
      var configHeader = {
        headers: {
          'content-type': 'multipart/form-data'
        }
     }
    const formData = new FormData();
      formData.append('upload_file', { uri: this.state.ImageSourceFist.uri, name: '1.jpg', type: "image/jpeg", chunkedMode: true });
      formData.append('message',this.state.post);
      formData.append('id',(this.props.storyid).toString());
      formData.append('sender_ac_no',this.state.loggedInUser.member_no);
      return new Promise(resolve => {
        axios.post(url, formData, configHeader)
          .then(function (response) {
            resolve(response);
            if (response.status == 200) {
              ToastAndroid.showWithGravity(
                'School Story Updated successfully',
                ToastAndroid.LONG,
                ToastAndroid.CENTER
              );
              Actions.SchoolStory();
            } else {
              ToastAndroid.showWithGravity(
                'School Story not Updated',
                ToastAndroid.LONG,
                ToastAndroid.CENTER
              );
            }
          }
          )
          .catch((error) => {
            console.error(error);
          });
      });
    }
  }


  render() {
    let button_pagination = null;
    if(this.state.loadsection == 0)
    {
      button_pagination = <Text>Select a Photo</Text>;
    } else if (this.state.loadsection == 2)
    {
      button_pagination = <ChatVideo videoUrl={this.state.ImageSourceFist} videoClass={styles.VideoContainer} />;
    } else
    {
      button_pagination = <Image style={styles.ImageContainer} source={this.state.ImageSourceFist} />;
    }
    return (
      <View style={styles.container}>
      <View style={styles.ImageContainer}>
       {button_pagination}
      </View>
      <View style={{ flexDirection:'row',marginBottom:10,marginTop:-15}}>
        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>          
            <FontAwesome style={styles.angleicon}>{Icons.camera}</FontAwesome>           
        </TouchableOpacity>
        <TouchableOpacity onPress={this.selectVideoTapped.bind(this)}> 
            <FontAwesome style={styles.angleicon}> {Icons.videoCamera} </FontAwesome>
        </TouchableOpacity>  
      </View>
      <View style={styles.profilestyle}>
        <TextInput style={[styles.styleinput, styles.profileinput]} placeholder="" onChangeText={(value) => this.setState({ post:value })} value={this.state.post} />
         <TouchableHighlight
            style={styles.classbtn}
            title="Add" onPress={() => this.EditStory()}  >
            <Text style={styles.buttonText}>Add</Text>
         </TouchableHighlight>
      </View>
      </View>
    );
  }
}
