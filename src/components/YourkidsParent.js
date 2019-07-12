import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, ScrollView, AsyncStorage, FlatList, Image, TouchableOpacity } from 'react-native';
import config from '../assets/json/config.json';
import CustomTabBar from "./CustomTabBar";
import styles from '../assets/css/mainStyle';
import axios from 'axios';
import { Actions } from 'react-native-router-flux';
import AddParentCodeKidService from '../services/AddParentCodeKidService';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Loader from './Loader';
export default class YourkidsParent extends Component {
  constructor() {
    super();
    this.state = {
      showLoader:0,
      loggedInUser: {},
      kidList: [],
      school_list: '',
      member_no: {},
      profileImage: '',

    }
  }
  async componentDidMount() {
    /* Get local storage values */
    await AsyncStorage.getItem('app_token').then((value) =>
    this.setState({ "app_token": value })
    );
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    )
    /* set profile image */
    if (this.state.loggedInUser['image']) {
      var profileImage = config.image_url + '/assets/profile_image/' + this.state.loggedInUser['image']+ '?=' + Math.random();;
    }
    else {
      var profileImage = config.server_path + '/assets/images/chat_user.png';
    }
    this.setState({ "profileImage": profileImage })
    /* get kid list */    
    this.getkidList();
  }

  /* Get kid list */  
  getkidList() {
    var objThis = this;
    this.setState({ "showLoader": 0 });
    AddParentCodeKidService.parentkidlist( objThis.state.app_token, objThis.state.loggedInUser.member_no).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      objThis.setState({ 'kidList': response.data.student_list });
    });
  }

  /* get parent kid list */  
  parentKidList(class_id, class_name, name, parent_ac_no, id, student_no, image) {
    Actions.YourkidsParent({ class_id: class_id, class_name: class_name, name: name, parent_ac_no: parent_ac_no, id: id, student_no: student_no, image: image })
  }

   /* Display profile in left side header */  
  _renderLeftHeader() {
    return (
      <View style={styles.Leftheaderstyle}>        
        <View style={{ width: 40, height: 40, borderRadius: 40/2}}>
            <Image style={{ width: 40, height: 40, borderRadius: 40/2 }} source={{ uri: this.state.profileImage  }}></Image>
          </View>
      </View>
    )
  } 

  /* Display content in middle header */  
  _renderMiddleHeader() {
    return (
      <View style={styles.MiddleheaderstyleLeft}>
        <Text style={[styles.MiddleHeaderTitlestyle,styles.padding5]}>{this.state.loggedInUser.name}'s Dashboard</Text>
      </View>
    )
  }

  render() {
    var imagePath = config.image_url;
    return (
      <ScrollView keyboardShouldPersistTaps="handled">
        {/* Start header */}
        <View style={[styles.customHeaderContainer]}>
          {this._renderLeftHeader()}
          {this._renderMiddleHeader()}
        </View>
        {/* End header */}
        <View>
          <CustomTabBar tabList={[{ 'title': 'Class Story', actionPage: () => Actions.ClassStoryParent(), tabIcon: 'users' }, { 'title': 'Message', actionPage: () => Actions.MessageParent(), tabIcon: 'envelope' }, { 'title': 'Your Kids', currentTab: 1, tabIcon: 'image' }]} />
          <View style={styles.dashcontainer}>
            <View>
              <Text style={styles.textchange}>
                Your Kid
            </Text>
            </View>
            <FlatList style={styles.backchange}
              data={this.state.kidList}
              renderItem={
                ({ item }) =>
                  <TouchableOpacity style={styles.listviewclass} onPress={() => Actions.ParentReport({ student_no: item.student_no, student_name: item.name })} key={this.index} >
                    <Image style={{ flexWrap: 'wrap', width: 32, height: 32 }} source={{ uri: imagePath + 'assets/student/' + item.image }} />
                    <View style={{ flexWrap: 'wrap' }}>
                      <Text style={styles.listclassmargin} >{item.name} ({item.class_name})</Text>
                    </View>
                  </TouchableOpacity>
              }
              keyExtractor={(item, index) => index}
            />
             <View style={[styles.listviewpage, styles.padding]} >
                  <FontAwesome style={styles.addclassstyle}>{Icons.plusCircle}</FontAwesome>
                  <View style={{ flexWrap: 'wrap' }}>
                    <Text style={styles.listviewmargin}  onPress={() => Actions.AddParentCode()} >Add New parent Code</Text>
                  </View>
                </View>
          </View>
        </View>
      </ScrollView>       
    );
  }
}
