import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, AsyncStorage, FlatList, Image, ScrollView } from 'react-native';
import CustomTabBar from "./CustomTabBar";
import { Actions } from 'react-native-router-flux';
import MassegeServices from '../services/massegeServices';
import config from '../assets/json/config.json';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import styles from '../assets/css/mainStyle';
import Loader from './Loader';
import DismissKeyboard from 'dismissKeyboard';

export default class MessageTeacher extends Component {
  constructor() {
    super();
    this.state = {
      showLoader: 0,
      loggedInUser: {},
      classid: '',
      classname: '',
      user_list: {},
      chat_notification: {},
      parentDetails: {},
      no_of_parent: 0
    }
    this.getStudentMessgList = this.getStudentMessgList.bind(this);
    this.chat_notifications = this.chat_notifications.bind(this);
    this.Inviteparent = this.Inviteparent.bind(this);
    this.setParentDetail = this.setParentDetail.bind(this);
    this.setParentDetailAll = this.setParentDetailAll.bind(this);
  }

  async componentDidMount() {
    /* Close keypad */
    DismissKeyboard();
    /* Get local storage values */
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    ),
      await AsyncStorage.getItem('classid').then((value) =>
        this.setState({ "classid": value })
      )
    await AsyncStorage.getItem('classname').then((value) =>
      this.setState({ "classname": value })
    )
    Actions.refresh({ title: this.state.classname });
    await AsyncStorage.getItem('app_token').then((value)=> 
      this.setState({"app_token": value})
    );
     /* Get student list on page load */
    this.getStudentMessgList();
  }

  /* get student list */
  getStudentMessgList() {
    var class_id = this.state.classid;
    var val = this;
    val.setState({ "showLoader": 0 });
    MassegeServices.getStudentMessgLists(this.state.app_token,class_id).then(function (response) {
      val.setState({ "showLoader": 0 });
      if (response.data.status == 'Failure') {
        Alert.alert(
          '',
          response.data.comments,
          [
            { text: 'OK', style: 'cancel' },
          ],
        )
      }
      else {
        val.setState({ 'user_list': response.data.user_list })
        if ((response.data.user_list).length > 0) {
          val.chat_notifications(response.data.user_list);
        }
      }
    });
  }

  /* Send chat notification to parent */
  chat_notifications(datas) {
    var member_no = this.state.loggedInUser.member_no;
    var obj = this;
    var notification_sender_ac_no = '';
    var no_of_users = 1;
    for (var i = 0; i < datas.length; i++) {
      if (typeof datas[i].parent_detail !== 'undefined') {
        notification_sender_ac_no += ',' + datas[i].parent_ac_no;
      }
    }
    if (notification_sender_ac_no != '') {
      notification_sender_ac_no = notification_sender_ac_no.substring(1);
    }
    var chat_notification = {};
    obj.setState({ "showLoader": 0 });
    MassegeServices.teacherChat_notification(this.state.app_token, notification_sender_ac_no, member_no).then(function (response) {
      obj.setState({ "showLoader": 0 });
      var responseData = response.data;
      for (var i = 0; i < (responseData).length; i++) {
        if (typeof chat_notification[responseData[i].sender_ac_no] == 'undefined') {
          var chatData = chat_notification[responseData[i].sender_ac_no] = [];
          obj.setState({ 'chat_notification': chatData });
        }
        if (typeof chat_notification[responseData[i].sender_ac_no][responseData[i].receiver_class_id] == 'undefined') {
          var chatData = chat_notification[responseData[i].sender_ac_no][responseData[i].receiver_class_id] = [];
          obj.setState({ 'chat_notification': chatData });
        }
        var chatData = chat_notification[responseData[i].sender_ac_no][responseData[i].receiver_class_id].push(responseData[i]);
        obj.setState({ 'chat_notification': chatData });
      }
    });

    obj.setState({ 'parentDetails': datas });
    for (var i = 0; i < datas.length; i++) {
      if (typeof datas[i].parent_detail != 'undefined') {
        var parent_conn = no_of_users++;
        obj.setState({ 'no_of_parent': parent_conn });
      }
    }

    if (this.state.no_of_parent > '1') {
      obj.setState({ 'all_parent': true });
    } else {
      obj.setState({ 'all_parent': false });
    }
  }

  /* Invite parent */
  Inviteparent() {
    Actions.InviteParents();
  }

  /* Set parent details only one parent and move chat page */
  setParentDetail(name, parent_ac_no) {
    AsyncStorage.setItem('message_account_name', JSON.stringify(name));
    AsyncStorage.removeItem('class_id_chat');
    AsyncStorage.setItem('member_no_chat', JSON.stringify(parent_ac_no));
    Actions.Chat();
  }

  /* Set all parent details and move chat page */
  setParentDetailAll() {
    AsyncStorage.removeItem('member_no_chat');
    AsyncStorage.setItem('class_id_chat', this.state.classid);
    Actions.Chat();
  }


  render() {
    var noParent = this.state.no_of_parent;
    const all_par = this.state.all_parent;
    let view_p = null;
    /* Check and all parent msg send tap */    
    if (all_par) {
      view_p = <View style={styles.listviewclass}>
        <View style={styles.classstoryimage}>
          <Image style={{ width: 50, height: 50 }} source={{ uri: config.server_path + '/assets/images/all_parent.png' }} />
        </View>
        <View style={styles.classstorycontent}>
          <Text onPress={() => this.setParentDetailAll()} >
            All Parents
            </Text>
          <Text> {noParent} parents connected</Text>
        </View>
      </View>;
    }
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
        <View>
          <CustomTabBar tabList={[{ 'title': 'Class Room', tabIcon: 'users', actionPage: () => Actions.ClassRoom() }, { 'title': 'Message', currentTab: 1, tabIcon: 'comments' }, { 'title': 'Class Story', actionPage: () => Actions.ClassStoryTeacher(), tabIcon: 'image' }]} />
        </View>

        <View style={styles.classcontainer}  >
          <View>
            <Text style={styles.textchange}>
              Message
          </Text>
          </View>
          {/* All parent msg send  */}
          {view_p}
          <View style={styles.backchange}>
            <FlatList
              data={this.state.parentDetails}
              renderItem={({ item }) => (
                <View style={styles.listviewclass}>
                  <View style={styles.classstoryimage}>
                    <Image style={{ width: 50, height: 50 }} source={{ uri: config.server_path + '/assets/images/chat_user.png' }} />
                  </View>
                  <View style={styles.classstorycontent} >
                    <Text onPress={() => this.setParentDetail(item.name, item.parent_ac_no)}>
                      {item.name}'s Parent
                  </Text>
                    <Text style={styles.invitelink}> {item.parent_detail === undefined ? <Text onPress={() => this.Inviteparent()}>Invite parent</Text>
                      : null}</Text>
                  </View>
                </View>
              )}
              keyExtractor={(item, index) => index}
            />
          </View>
        </View>
      </ScrollView>
      }
      </View>
    );
  }
}

