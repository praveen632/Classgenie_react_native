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
  TouchableOpacity,
  Platform,
  Image,
  TouchableHighlight,
  ToastAndroid,
  WebView,
  Linking
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ProfileService from '../services/ProfileService';
import ImagePicker from 'react-native-image-picker';
import styles from '../assets/css/mainStyle';
var FormData = require('form-data');
import axios from 'axios';
import config from '../assets/json/config.json';
import Loader from './Loader';
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
      section:0,
      ImageSourceFist:null,
    }
    this.logoutStudent = this.logoutStudent.bind(this);
    this.deleteAccount = this.deleteAccount.bind(this);
    this.logoutpop = this.logoutpop.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);   
    this.cancelDelete = this.cancelDelete.bind(this); 
  }

  async componentWillMount() {
    /* Close keypad */
    DismissKeyboard();
    /* Get local storage values */
    await AsyncStorage.getItem('app_token').then((value) =>
      this.setState({ "app_token": value })
    );  
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    )
    /* Show profile image */
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
        let source =  response.uri;
        this.setState({ImageSource: source});
        /* Set state for upload image */
        let sourcedes = { uri: response.uri };
        /* Set state for display image */
        this.setState({
          ImageSourceFist: sourcedes
        });
        this.setState({section: 1});
      }
    });
  }

 /* Function For Edit Profile Student */
 handleSubmit() {
  if(this.state.section == 0){
    ToastAndroid.showWithGravity(
      'Please Select the photo first',
      ToastAndroid.LONG,
      ToastAndroid.CENTER    
    );
  }else{
    /* Upload image and name */ 
    var obj =this;
    var url = config.api_url+':'+config.port+'/student/updateimage?token='+config.api_token;     	
    var configHeader = {
    headers: {
    'content-type': 'multipart/form-data'
    }
  }
  const formData = new FormData();
  formData.append('upload_file',{uri:this.state.ImageSource,name:'1.jpg',type:"image/jpeg",chunkedMode:false}); 
  formData.append('member_no',this.state.loggedInUser.member_no);	  	
  formData.append('token',this.state.app_token);	   	
  return new Promise(resolve => {     
     axios.post(url, formData, configHeader)
     .then(function (response) {
       resolve(response);        
       var loggedInUser = obj.state.loggedInUser;     
       loggedInUser.image = response.data.name[0].image;
       AsyncStorage.setItem('loggedInUser', JSON.stringify(loggedInUser));  
        Actions.DashboardStudent()
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
 
  /* Function For LogOut Student */
  logoutStudent() {
      AsyncStorage.removeItem('loggedInUser');
       Actions.login()
      ToastAndroid.showWithGravity(
        'Successfully Logout',
        ToastAndroid.LONG,
        ToastAndroid.CENTER
      )
    }
  
    /* move login page */
    closeModal() {
      Actions.login();
    }

  /* Function For Delete Student  Account */
  deleteAccount() {
    Alert.alert(
      '',
      'Are you sure want to delete Account',
      [
        { text: 'OK', onPress: () => this.sureDeletethem() },
        { text: 'Cancel', onPress: () => this.cancelDelete() },
      ],
    )
  }

   /* move student profile page */
  cancelDelete() {
    Actions.StudentProfile();
  }

   /* Delete student */
  sureDeletethem() {
    var obj = this;
    var type = obj.state.loggedInUser.type;
    var url = "";
     /* Set type for deleting */
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
   /* Call function for delete */
    ProfileService.deleteAcc(obj.state.loggedInUser.member_no, url,obj.state.app_token).then(function (response) {
      Alert.alert(
        '',
        ' Account sucessfully deleted.',
        [
          { text: 'OK', onPress: () => obj.logoutpop() },
        ],
      )
    });
  }

   /* Log out */
  logoutpop() {
    AsyncStorage.removeItem('loggedInUser');
    Actions.login();
  }

  render() {
    var server_path = config.server_path;
     /* Set profile image */
    if (this.state.loggedInUser['image']) {
      var profileImage = config.image_url + '/assets/profile_image/' + this.state.loggedInUser['image'];
    }
    else {
      var profileImage = config.server_path + '/assets/images/6_6_c_6.png';
    }
    return (
      <View style={styles.container}>
       <Text >{this.state.loggedInUser.username} </Text>
        <Text onPress={() => Actions.ChangePasswordStudent()} >Change Password</Text>
         <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
           <View style={styles.ImageContainer}>
          
            {this.state.ImageSource == null ? <Image style={{ width: 100, height: 100 }} source={{ uri: profileImage+'?='+Math.random() }}></Image> :
              <Image style={{ width: 100, height: 100 }} source={this.state.ImageSourceFist} />
            }
            <Text>Select a Photo</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.profilestyle}>      
           <TouchableHighlight
            style={styles.classbtn}
            title="Save Changes" onPress={this.handleSubmit}  >
            <Text style={styles.buttonText}>Change Photo</Text>
          </TouchableHighlight>
          <Text style={styles.linkprofile} onPress={() => this.deleteAccount()}>Delete Account</Text>
          <Text style={styles.linkprofile} onPress={ ()=>{ Linking.openURL('http://classgenie.in/terms')}}>Terms & Privacy</Text>
          <Text  style={styles.linkprofile} onPress={() => Actions.Notifications()}>Notification Setting</Text>
          <Text style={styles.signlink} onPress={() => this.logoutStudent()}>Sign Out / Switch Account</Text>
        </View>
      </View>
    );
  }
}
