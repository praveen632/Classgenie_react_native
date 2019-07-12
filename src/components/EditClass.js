import React, { Component } from 'react';
import { TouchableWithoutFeedback, TouchableHighlight, StyleSheet, Text, View, Image, Button, AsyncStorage, ScrollView, FlatList, TextInput, ToastAndroid, Alert, Picker, Modal } from 'react-native';
import { Actions } from 'react-native-router-flux';
import TeacherServices from '../services/teacherServices';
import config from '../assets/json/config.json';
import styles from '../assets/css/mainStyle';
import DismissKeyboard from 'dismissKeyboard';

export default class editClass extends Component {
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
    /* Get Local Storage values */
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
    /* if no image class then set default */
    if (!this.state.classimage) {
      this.setState({ "classimage": '6_6_c_6.png' });
    }
   /* Class image path */
    var classimage_path = config.image_url + "assets/" + "class/" + this.state.classimage;
    this.setState({ "classimage_path": classimage_path });
    /* Get grade list */
    this.getGradeList();
    /* Get Class Icon */
    this.getClassIconList();
  }

  /* Get Grade list */
  getGradeList() {
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    /* Call function in teacher service to get grade list */
    TeacherServices.getGradeList(this.state.loggedInUser.member_no, this.state.app_token).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      objThis.setState({ 'gradeList': response.data });
    });
  }

  /* Get class icon */
  getClassIconList() {
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    TeacherServices.getClassIconList(this.state.app_token).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      objThis.setState({ 'classIconList': response.data.user_list });

    });
  }

  /* Form submit to add class */
  handleSubmit() {
    var objThis = this;
    if (!this.state.classid) {
      ToastAndroid.showWithGravity(
        'This class does not exist.',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
    }
    if (!this.state.classname) {
      ToastAndroid.showWithGravity(
        'Please enter class name',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return false;
    }

    if (!this.state.classgrade) {
      ToastAndroid.showWithGravity(
        'Please select class grade',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return false;
    }
   /* Set all parameter to add class */
    var param = {
      token: this.state.app_token,
      class_id: (this.state.classid).toString(),
      class_name: (this.state.classname).toString(),
      image: (this.state.classimage).toString(),
      grade: this.state.classgrade,
      teacher_ac_no: (this.state.loggedInUser.member_no).toString(),
      school_id: (this.state.loggedInUser.school_id).toString()
    }
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    /* Call function to add class */
    TeacherServices.updateClass(param).then(function (resp) {
      objThis.setState({ "showLoader": 0 });
      if (resp['data']['status'] == "Success") {
        AsyncStorage.setItem('classname', objThis.state.classname);
        AsyncStorage.setItem('classimage', objThis.state.classimage);
        AsyncStorage.setItem('classgrade', objThis.state.classgrade);
        Actions.ClassRoom();
        ToastAndroid.showWithGravity(
          'Class Updated successfully.',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      }else {
        ToastAndroid.showWithGravity(
          'Unable to add class. Please try again later',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      }
    });
  }

  /* Alert to remove class */
  removeClassCnf() {
    Alert.alert(
      '',
      'Would you like to remove this class ?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => this.removeClass() },
      ],
    );

  }

  /* Remove student */
  removeClass() {
    var objThis = this;
    var param = {
      token: this.state.app_token,
      class_id: (this.state.classid).toString(),
    }
    objThis.setState({ "showLoader": 0 });
    TeacherServices.removeClass(param).then(function (resp) {
      objThis.setState({ "showLoader": 0 });
      if (resp['data']['status'] == "Success") {
        Actions.DashboardTeacher();
        ToastAndroid.showWithGravity(
          'Class Removed successfully.',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      }
      else {
        Alert.alert(
          '',
          'Unable to remove class. Please try again later',
          [
            { text: 'OK', style: 'cancel' },
          ],
        );
      }
    });
  }

  /* Open class icon modal */
  openIconPop() {
    this.setState({ modalVisible: true });
  }

  /* Close Modal */
  closeModal() {
    this.setState({ modalVisible: false });
  }

  /* Select class icon */
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
      <View>
        {/* Show the loader when data is loading else show the page */}
        {
          this.state.showLoader == 1 ?
            <View style={styles.loaderContainer}>
              <Loader />
            </View>
            :
            <View style={styles.dashcontainer}>
              <View style={styles.contentCenter}>
                <View style={styles.ImageContainer}>
                  <TouchableWithoutFeedback onPress={() => this.openIconPop()}>
                    <Image style={{ width: 50, height: 50 }} source={{ uri: this.state.classimage_path }} />
                  </TouchableWithoutFeedback>
                </View>
              </View>

              <View style={styles.editclassstyle}>
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
                <TouchableWithoutFeedback title="Create New Class" onPress={this.handleSubmit}>
                  <View style={styles.classbtn}>
                    <Text style={styles.buttonText}>Update Class</Text>
                  </View>
                </TouchableWithoutFeedback>
                <Text style={styles.orangetext} onPress={() => this.removeClassCnf()}>Remove Class</Text>
                </View>
              <Modal visible={this.state.modalVisible} animationType={'slide'} onRequestClose={() => this.closeModal()}>
                <ScrollView>
                  <View style={styles.editpopupimage}>
                    {
                      this.state.classIconList.map(function (item, key) {
                        return (
                          <View style={styles.containerImagePop}>
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
        }
      </View>
    );

  }
}