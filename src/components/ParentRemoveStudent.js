import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, AsyncStorage, FlatList, Image, Alert, TouchableOpacity, ToastAndroid } from 'react-native';
import config from '../assets/json/config.json';
import CustomTabBar from "./CustomTabBar";
import styles from '../assets/css/mainStyle';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import AddParentCodeKidService from '../services/AddParentCodeKidService';
import Loader from './Loader';
import DismissKeyboard from 'dismissKeyboard';
export default class YourkidsParent extends Component {
  constructor() {
    super();
    this.state = {
      loggedInUser: {},
      kidList: {},
      school_list: '',
      member_no: {},
      student_no: ''
    }
    this.removeKids = this.removeKids.bind(this);
  }
  async componentDidMount() {
    /* Close keypad */
    DismissKeyboard();
    /* Get all local storage values */
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    )
    await AsyncStorage.getItem('app_token').then((value)=> 
      this.setState({"app_token": value})
    );
    this.getkidList();
  }

  /* Get kid list */
  getkidList() {
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    AddParentCodeKidService.parentkidlist(this.state.app_token, this.state.loggedInUser.member_no).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      objThis.setState({ 'kidList': response.data.student_list });
    });
  }

  /* Get parent kid list */
  parentKidList(class_id, class_name, name, parent_ac_no, id, student_no, image) {
    Actions.YourkidsParent({ class_id: class_id, class_name: class_name, name: name, parent_ac_no: parent_ac_no, id: id, student_no: student_no, image: image })
  }

  /* Remove kid */
  removeKids(item) {
    var obj = this;
    Alert.alert(
      '',
      'Student will be removed!',
      [
        { text: 'OK', onPress: () => obj.removeStud(item) },
        { text: 'Cancel', onPress: () => obj.getkidList() }
      ],
    )
  }

  /* Student Removed by Parent */ 
  removeStud(student_no) {
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    AddParentCodeKidService.removeKids(student_no, this.state.app_token).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      if (response.data.status == "Success") {
        ToastAndroid.showWithGravity(
          'kid removed successfully',
          ToastAndroid.LONG,
          ToastAndroid.CENTER
        );
        objThis.getkidList();
      } else {
        throw new Error('Server Error!');
      }
    });
  }

  render() {
    var imagePath = config.image_url;
    var objThis = this;
    return (
      <View>
      {/* Show the loader when data is loading else show the page */}
      {
        this.state.showLoader == 1 ?
          <View style={styles.loaderContainer}>
            <Loader />
          </View>
          :
          <ScrollView>
            <View style={styles.storycontainer}>
              <FlatList
                data={this.state.kidList}
                renderItem={
                  ({ item }) =>
                  <View style={[styles.dashlist, styles.whitebackgrounnd, styles.padding5]}>
                  <View style={styles.removeimg}>
                    <Image
                      source={{ uri: imagePath + 'assets/student/' + item.image }}
                      style={{ width: 50, height: 50 }}
                    />
                  </View>                 
                  <View style={styles.listremoveparent}>
                    <Text style={styles.listviewmargin} onPress={() => this.openAddClassPage()}>{item.name} ({item.class_name})</Text>
                  </View>             
                  {/* Remove kid  */}
                  <View style={{flex:.5,alignItems:'flex-end',alignSelf: 'center',paddingRight:10}}>
                    <Text onPress={() => objThis.removeKids(item.student_no)}><FontAwesome style={styles.crossstyle}>{Icons.times}</FontAwesome></Text>
                  </View>
                </View>
            }
            keyExtractor={(item, index) => index}
          />
        </View>
      </ScrollView>
      }
      </View>
    );
  }

}
