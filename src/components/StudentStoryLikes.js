import axios from 'axios';
import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, ImageBackground, Image, AsyncStorage, TextInput, TouchableWithoutFeedback, ListView, ScrollView, FlatList, TouchableOpacity, Modal } from 'react-native';
import DashboardTeacher from './DashboardTeacher';
import { Router, Scene, Actions } from 'react-native-router-flux';
import styles from '../assets/css/mainStyle';
import config from '../assets/json/config.json';
import StudentStoryServices from '../services/StudentStoryServices';
import DismissKeyboard from 'dismissKeyboard';

export default class StudentStoryLikes extends Component{
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
      likelist: {},
      storyid: '',
      class_id: '',
      app_token: '',
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
    /* Get like list */
    await this.loadLikelist();
  }

  /* Get like list */
  loadLikelist() {
   /* Call function in student story to get like list */
    StudentStoryServices.Likelist(this.props.classid, this.props.storyid, this.state.app_token).then((response) => {
      if (response.data.status == 'Success') {
        this.setState({ likelist: response.data.like_list });
      } else {
        throw new Error('Server Error!');
      }
    })
  }

  render() {
    var imagePath = config.image_url;
    return (
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.dashcontainer}>
          <FlatList
            data={this.state.likelist}
            renderItem={({ item }) =>
              <View style={[styles.listviewpage, styles.padding]} >
                {item.name.image !== '' ?
                  <Image style={{ flexWrap: 'wrap', width: 32, height: 32, borderRadius: 40 / 2 }} source={{ uri: imagePath + 'assets/profile_image/' + item.name.image + '?=' + Math.random() }} />
                  :
                  <Image style={{ flexWrap: 'wrap', width: 32, height: 32, borderRadius: 40 / 2 }} source={{ uri: config.server_path + "assets/images/chat_user.png" }} />
                }
                <View style={{ flexWrap: 'wrap',borderBottomWidth: .6,borderBottomColor: '#bbb8b8', }}>
                  {
                    item.name.name !== '' ?
                      <Text style={styles.listviewmargin}>{item.name.name}</Text>
                      :
                      <Text style={styles.listviewmargin}>{item.student_name}</Text>
                  }
                </View>
              </View>
            }
            keyExtractor={(item, index) => index}
          />
        </View>
      </ScrollView>
    );
  }
}    