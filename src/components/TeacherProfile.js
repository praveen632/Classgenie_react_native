import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage,
  TextInput,
  Alert,
  PixelRatio,
  TouchableHighlight,
  TouchableOpacity,
  Platform,
  Image,
  ScrollView,
  ToastAndroid,
  WebView,
  Linking

} from 'react-native';
import Loader from './Loader';
import { Actions } from 'react-native-router-flux';
import ProfileService from '../services/ProfileService';
import ImagePicker from 'react-native-image-picker';
import styles from '../assets/css/mainStyle';
import config from '../assets/json/config.json';
var FormData = require('form-data');
import axios from 'axios';
import DismissKeyboard from 'dismissKeyboard';

export default class TeacherProfile extends Component {
  constructor() {
    super();
    this.state = {
      showLoader: 0,
      loggedInUser: {},
      email: '',
      name: '',
      ImageSource: null,
      section: 0,
      ImageSourceFist: null,
      school:{},
      app_token: ''
    }
    this.logoutTeacher = this.logoutTeacher.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
    this.logoutpop = this.logoutpop.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  async componentWillMount() {
    /* Close keypad */
    DismissKeyboard();
    /* Get local storage values */
    await AsyncStorage.getItem('app_token').then((value) =>
      this.setState({ "app_token": value })
    );
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value), name: (JSON.parse(value)).name })
    )
    /* Set profile image */
    if (this.state.loggedInUser['image']) {
      var profileImage = config.image_url + '/assets/profile_image/' + this.state.loggedInUser['image'] + '?=' + Math.random();
    }
    else {
      var profileImage = config.server_path + '/assets/images/6_6_c_6.png';
    }
    this.setState({ "profileImage": profileImage })
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
        /* Set state for upload image */
        let sourcedes = { uri: response.uri };
        /* Set state for display image */
        this.setState({
          ImageSourceFist: sourcedes
        });
        this.setState({ section: 1 });
      }
    });
  }

  /* Function For Edit Name and Image */
  handleSubmit() {
    var letter = /^[a-zA-Z '.-]+$/;
    if (!this.state.name.match(letter)) {
      Actions.TeacherProfile();
      ToastAndroid.showWithGravity(
        'Please enter the name with alphabetically character only ',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );     
      return (false);
    }
    if (this.state.section == 0) {
      /* Upload only text story */
      var obj = this;
      var member_no = obj.state.loggedInUser.member_no;
      var name = obj.state.name;
      this.setState({ "showLoader": 0 });
      ProfileService.editAcc(member_no, name, this.state.app_token).then(function (response) {
        obj.setState({ "showLoader": 0 });
        if (response.data.status == 'Success') {
          var loggedInUser = obj.state.loggedInUser;
          loggedInUser.name = response.data.student_name[0].name;
          AsyncStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
          Actions.DashboardTeacher()
          ToastAndroid.showWithGravity(
            'Profile updated successfully',
            ToastAndroid.LONG,
            ToastAndroid.CENTER

          );
        }
        else if (response.data.status == 'Failure') {
          Alert.alert(
            '',
            'Profile not Updated Successfully',
            [
              { text: 'OK', onPress: () => console.log('') },

            ],
          )
        }

      });
    } else {
      /* Upload text and image */
      var obj = this;
      var url = config.api_url + ':' + config.port + '/student/updateimage?token=' + this.state.app_token;
      var configHeader = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      }
      const formData = new FormData();
      formData.append('upload_file', { uri: this.state.ImageSource, name: '1.jpg', type: "image/jpeg", chunkedMode: false });
      formData.append('name', this.state.name);
      formData.append('member_no', this.state.loggedInUser.member_no);
      formData.append('token', this.state.app_token);
      return new Promise(resolve => {
        axios.post(url, formData, configHeader)
          .then(function (response) {
            resolve(response);

            var loggedInUser = obj.state.loggedInUser;
            loggedInUser.name = response.data.name[0].name;
            loggedInUser.image = response.data.name[0].image;
            AsyncStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));
            Actions.DashboardTeacher()
            ToastAndroid.showWithGravity(
              'Profile updated successfully',
              ToastAndroid.LONG,
              ToastAndroid.CENTER
            );

          }
          )
          .catch((error) => {
            console.error(error);
          });
      });
    }
  }

  /* Function For LogOut Teacher */
  logoutTeacher() {
    AsyncStorage.removeItem('loggedInUser');
    AsyncStorage.removeItem('school');
    Actions.login()
    ToastAndroid.showWithGravity(
      'Successfully Logout',
      ToastAndroid.LONG,
      ToastAndroid.CENTER
    )
  }
    
  /* Delete confirmation box */
  deleteAccount() {
    Alert.alert(
      '',
      'Are you sure want to delete Account',
      [
        { text: 'Cancel', onPress: () => this.cancelDelete() },
        { text: 'OK', onPress: () => this.sureDeletethem() },
      ],
    )

  }

  /* Go to teacher profile image */
  cancelDelete() {
    Actions.teacherProfile();
  }

  /* Delete teacher */
  sureDeletethem() {
    var obj = this;
    var type = obj.state.loggedInUser.type;
    var url = "";
    if (type == 1) {
      url = 'principal';
    } else if (type == 2) {
      url = 'teacher';
    }
    else if (type == 3) {
      url = 'parent';
    }
    else if (type == 4) {
      url = 'student';
    }
    else if (type == 5) {
      url = 'vice-principal';
    }   
    ProfileService.deleteAcc(obj.state.loggedInUser.member_no, url, this.state.app_token).then(function (response) {
      Alert.alert(
        '',
        ' Account sucessfully deleted.',
        [
          { text: 'OK', onPress: () => obj.logoutpop() },
        ],
      )
    });
  }

  /* Logout */
  logoutpop() {
    AsyncStorage.removeItem('loggedInUser');
    Actions.login();
  }

  render() {
    return (
      <View>
        {/* Show the loader when data is loading else show the page */}

        {
          this.state.showLoader == 1 ?

            <View style={styles.loaderContainer}>
              <Loader />
            </View>
            :
            <ScrollView keyboardShouldPersistTaps="handled">
              <View style={styles.container}>
                <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
                  <View style={styles.ImageContainer}>
                    {this.state.ImageSource == null ? <Image style={{ width: 100, height: 100 }} source={{ uri: this.state.profileImage  }}></Image> :
                      <Image style={{ width: 100, height: 100 }} source={this.state.ImageSourceFist} />
                    }
                    <Text>Select a Photo</Text>
                  </View>
                </TouchableOpacity>              
                <View style={styles.profilestyle}>
                  <TextInput style={[styles.styleinput, styles.profileinput]} placeholder='Name' value={this.state.name}
                    onChangeText={(text) => this.setState({ name: text })}
                  />
                  <Text style={[styles.styleinput, styles.profileinput]}>{this.state.loggedInUser.email} </Text>
                 <TouchableHighlight
                    style={styles.classbtn}
                    title="Save Changes" onPress={this.handleSubmit}  >
                    <Text style={styles.buttonText}>Save Changes</Text>
                  </TouchableHighlight>
                  <Text onPress={() => Actions.ChangePassword()} >Change Password</Text>
                  <Text style={styles.linkprofile} onPress={() => this.deleteAccount()}>Delete Account</Text>
                  <Text style={styles.linkprofile} onPress={() => { Linking.openURL('http://classgenie.in/terms') }}>Terms & Condition</Text>
                  <Text style={styles.linkprofile} onPress={() => { Linking.openURL('http://classgenie.in/privecy') }}>Privacy & policy</Text>
                  <Text style={styles.linkprofile} onPress={() => Actions.Notifications()}>Notification Setting</Text>
                  <Text style={styles.signlink} onPress={() => this.logoutTeacher()}>Sign Out</Text>
                </View>
                </View>
            </ScrollView>
        }
      </View>
    );
  }
}
