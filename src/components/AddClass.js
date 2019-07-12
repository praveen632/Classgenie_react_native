import React, { Component } from 'react';
import { TouchableWithoutFeedback, TouchableHighlight, StyleSheet, Text, View, Image, Button, AsyncStorage, ScrollView, FlatList, TextInput, ToastAndroid, Alert, Picker, Modal } from 'react-native';
import { Actions } from 'react-native-router-flux';
import TeacherServices from '../services/teacherServices';
import config from '../assets/json/config.json';
import styles from '../assets/css/mainStyle';
import Loader from './Loader';
import DismissKeyboard from 'dismissKeyboard';

export default class addClass extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: 0,
      loggedInUser: {},
      classid: '',
      classname: '',
      classimage: '',
      classimage_path: '',
      classgrade: '',
      gradeList: [],
      classIconList: [],
      modalVisible: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getGradeList = this.getGradeList.bind(this);
    this.getClassIconList = this.getClassIconList.bind(this);
    this.openIconPop = this.openIconPop.bind(this);
    this.selectedImage = this.selectedImage.bind(this);
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
    )
    await AsyncStorage.getItem('classid').then((value) =>
      this.setState({ "classid": value })
    )
    await AsyncStorage.getItem('classname').then((value) =>
      this.setState({ "classname": value })
    )
    await AsyncStorage.getItem('classimage').then((value) =>
      this.setState({ "classimage": value })
    )
    await AsyncStorage.getItem('classgrade').then((value) =>
      this.setState({ "classgrade": value })
    )

    /*no image class then set default */ 
    if (!this.state.classimage) {
      this.setState({ "classimage": '6_6_c_6.png' });
    }
    var classimage_path = config.image_url + "assets/" + "class/" + this.state.classimage;
    this.setState({ "classimage_path": classimage_path });
    this.getGradeList();
    this.getClassIconList();
  }

   /* Get Class list */ 
  getGradeList() {
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    TeacherServices.getGradeList(this.state.loggedInUser.member_no, this.state.app_token).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      objThis.setState({ 'gradeList': response.data });

    });
  }

  /* Get Class icon list */
  getClassIconList() {
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    TeacherServices.getClassIconList(this.state.app_token).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      objThis.setState({ 'classIconList': response.data.user_list });

    });
  }

 /* Add Class */
  handleSubmit() {
    var objThis = this;
    if (!this.state.classname) {
      Alert.alert(
        '',
        'Please enter class name',
        [
          { text: 'OK', style: 'cancel' },
        ],
      );
      return false;
    }

    if (!this.state.classgrade) {
      Alert.alert(
        '',
        'Please select class grade',
        [
          { text: 'OK', style: 'cancel' },
        ],
      );
      return false;
    }

    var param = {
      token: this.state.app_token,
      class_name: (this.state.classname).toString(),
      image: (this.state.classimage).toString(),
      grade: this.state.classgrade,
      teacher_ac_no: (this.state.loggedInUser.member_no).toString(),
      school_id: (this.state.loggedInUser.school_id).toString()
    }
    objThis.setState({ "showLoader": 0 });
    /* Call teacher Services */
    TeacherServices.addClass(param).then(function (resp) {
      objThis.setState({ "showLoader": 0 });
      if (resp['data']['status'] == "Success") {
        let class_id = resp['data']['user_list'][0]['class_id'];
        AsyncStorage.setItem('classid', class_id);
        Actions.AddStudent({ cameFrom: 'addNewClass' });
      }
      else {
        Alert.alert(
          '',
          'Unable to add class. Please try again later',
          [
            { text: 'OK', style: 'cancel' },
          ],
        );
      }
    });
  }

   /* Open the icon popup */
  openIconPop() {
    this.setState({ modalVisible: true });
  }
  
  /* Close the icon popup */
  closeModal() {
    this.setState({ modalVisible: false });
  }

  /* Select image */
  selectedImage(imageName) {
    this.closeModal();
    this.setState({ "classimage": imageName });
    var classimage_path = config.image_url + "assets/" + "class/" + imageName;
    this.setState({ "classimage_path": classimage_path });
  }

  render() {
    var imagePath = config.image_url;
    var objThis = this;
    return (
      <ScrollView keyboardShouldPersistTaps="handled">
        <View style={styles.dashcontainer}>
          <TouchableWithoutFeedback onPress={() => this.openIconPop()}>
            <View style={{ justifyContent: 'center', alignItems: 'center', padding: 30 }}>
              <Image style={styles.imagestyle} source={{ uri: this.state.classimage_path }} />
            </View>
          </TouchableWithoutFeedback>
          <View style={styles.editstudentclasss}>
            <TextInput style={styles.selectbottomborder} placeholder="Class Name" onChangeText={(classname) => this.setState({ classname: classname })} value={this.state.classname} />
            <View style={styles.selectbottomborder}>
              <Picker selectedValue={this.state.classgrade} onValueChange={(itemValue, itemIndex) => this.setState({ classgrade: itemValue })}>
                <Picker.Item label="Select Grade" value={0} key={0} />
                {
                  this.state.gradeList.map(function (item, key) {
                    return (
                      <Picker.Item label={item.value} value={item.key} key={key} />
                    )
                  })
                }
              </Picker>
            </View>
            <TouchableHighlight style={styles.classbtn} title="Create New Class" onPress={this.handleSubmit} >
              <Text style={styles.buttonText}>Create New Class</Text>
            </TouchableHighlight>
          </View>

          {/* Open modal for image select  */}
          <Modal visible={this.state.modalVisible} animationType={'slide'} onRequestClose={() => this.closeModal()}>
            <ScrollView>
              <View style={styles.editpopupimage}>
                {
                  this.state.classIconList.map(function (item, key) {
                    return (
                      <View style={styles.containerImagePop} key={key}>
                        <TouchableWithoutFeedback onPress={() => objThis.selectedImage(item.image)} key={key}>
                          <View style={styles.editimage}>
                            <Image style={{ width: 50, height: 50 }} source={{ uri: imagePath + "assets/class/" + item.image }} key={key} />
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    )
                  })
                }
              </View>
              <TouchableHighlight style={styles.classbtn} title="Close" onPress={() => this.closeModal()}>
                <Text style={styles.buttonText}>Close</Text>
              </TouchableHighlight>
            </ScrollView>
          </Modal>
        </View>
      </ScrollView>
    );

  }
}
