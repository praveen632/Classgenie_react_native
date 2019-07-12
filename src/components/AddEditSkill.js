import React, { Component } from 'react';
import { TouchableWithoutFeedback, TouchableHighlight, StyleSheet, Text, View, Image, Button, AsyncStorage, ScrollView, FlatList, TextInput, ToastAndroid, Alert, Picker, Modal } from 'react-native';
import { Actions } from 'react-native-router-flux';
import TeacherServices from '../services/teacherServices';
import config from '../assets/json/config.json';
import styles from '../assets/css/mainStyle';
import HideableView from 'react-native-hideable-view';
import base64 from 'base-64';
import Loader from './Loader';
import DismissKeyboard from 'dismissKeyboard';
export default class AddEditSkill extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showLoader: 0,
      loggedInUser: {},
      classid: '',
      skill_id: 0,
      skill_weight: 0,
      skill_name: '',
      skill_image: '',
      skill_type: '',
      skillimage_path: '',
      pointList: [],
      skillIconList: [],
      modalVisible: false,
    }
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getSkillPointList = this.getSkillPointList.bind(this);
    this.getSkillIconList = this.getSkillIconList.bind(this);
    this.openIconPop = this.openIconPop.bind(this);
    this.selectedImage = this.selectedImage.bind(this);
  }

  async componentWillMount() {
    /* close keypad */
    DismissKeyboard();
    await AsyncStorage.getItem('app_token').then((value) =>
      this.setState({ "app_token": value })
    );
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    )
    await AsyncStorage.getItem('classid').then((value) =>
      this.setState({ "classid": value })
    )
    var skill_weight = this.props.skill_weight;
    if (skill_weight) {
      skill_weight = (skill_weight).toString()
    }
     /* Get values that pass to other page */
    var param = {
      skill_id: this.props.skill_id,
      skill_weight: skill_weight,
      skill_name: this.props.skill_name,
      skill_image: this.props.skill_image,
      skill_type: this.props.skill_type
    }
    this.setState(param);

    /* if no image  then set default */
    if (!this.state.skill_image) {
      this.setState({ "skill_image": '20_39_icon_2.png' });
    }
    var skillimage_path = config.image_url + "assets/skill/" + this.state.skill_image;
    this.setState({ "skillimage_path": skillimage_path });
   /* if positive skill then open page */
    if (this.state.skill_type == 'positive') {
      var pointListApiUrl = '/classlist/positivepointweight';
    }
    else {
       /* if nigative skill then open page */
      var pointListApiUrl = '/classlist/negativepointweight';
    }

    if (this.state.skill_id) {
      Actions.refresh({ title: 'Edit Skill' });
    }
    else {
      Actions.refresh({ title: 'Add Skill' });
    }
    this.getSkillPointList(pointListApiUrl);
    this.getSkillIconList();

  }

 /* point list */
  getSkillPointList(pointListApiUrl) {
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    /* Call the teacher services for point list */
    TeacherServices.getSkillPointList(pointListApiUrl, this.state.app_token).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      objThis.setState({ 'pointList': response.data });

    });
  }

  /* skill list */
  getSkillIconList() {
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    TeacherServices.getSkillIconList(this.state.app_token).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      objThis.setState({ 'skillIconList': response.data.user_list });

    });
  }


   /* Form submit add skill */
  handleSubmit() {
    var objThis = this;
    if (!this.state.skill_name) {
      ToastAndroid.showWithGravity(
        'Please enter skill name',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER
      );
      return false;
    }

    if (!this.state.skill_weight) {
      ToastAndroid.showWithGravity(
        'Please select skill point',
        ToastAndroid.SHORT,
        ToastAndroid.CENTER

      );
      return false;
    }

    if (this.state.skill_id) {
      /* Make url for edit skill */
      var apiUrl = '/editskills/update';
      var successMessage = "Skill Updated successfully."
      var param = {
        token: this.state.app_token,
        id: (this.state.skill_id).toString(),
        name: base64.encode(this.state.skill_name),
        image: (this.state.skill_image).toString(),
        pointweight: this.state.skill_weight
      }
    }
    else {
      /* Make url for add skill */
      var objThis = this;
      var apiUrl = '/editskills';
      var successMessage = "Skill Added successfully."
      var param = {
        token: this.state.app_token,
        name: base64.encode(this.state.skill_name),
        image: (this.state.skill_image).toString(),
        pointweight: this.state.skill_weight,
        member_no: (this.state.loggedInUser.member_no).toString(),
        class_id: (this.state.classid).toString()
      }
    }
    objThis.setState({ "showLoader": 0 });
     /* Call the teacher services for add skill/ update skill */
    TeacherServices.addUpdateSkill(param, apiUrl).then(function (resp) {
      objThis.setState({ "showLoader": 0 });
      if (resp['data']['status'] == "Success") {
        Actions.FeedbackManager({ awardTo: 'editSkill' });
        Alert.alert(
          '',
          successMessage,
          [
            { text: 'OK', style: 'cancel' },
          ],
        );

      }
      else {
        ToastAndroid.showWithGravity(
          'Unable to add skill. Please try again later',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER

        );
      }
    });
  }

   /* Delete skill Confirm box */
  removeSkillCnf() {
    Alert.alert(
      '',
      'Would you like to remove this skill ?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => this.removeSkill() },
      ],
    );

  }

   /* Delete skill */
  removeSkill() {
    var objThis = this;
    var param = {
      token: this.state.app_token,
      id: (this.state.skill_id).toString(),
    }
    objThis.setState({ "showLoader": 0 });
    TeacherServices.removeSkill(param).then(function (resp) {
      objThis.setState({ "showLoader": 0 });
      if (resp['data']['status'] == "Success") {
        Actions.FeedbackManager({ awardTo: 'editSkill' });
        ToastAndroid.showWithGravity(
          'Skill Removed successfully.',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      }
      else {
        ToastAndroid.showWithGravity(
          'Unable to remove skill. Please try again later',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER
        );
      }
    });
  }

   /* Open modale */
  openIconPop() {
    this.setState({ modalVisible: true });
  }

   /* Close modale */
  closeModal() {
    this.setState({ modalVisible: false });
  }

   /* Select imgae */
  selectedImage(imageName) {
    this.closeModal();
    this.setState({ "skill_image": imageName });
    var skillimage_path = config.image_url + "assets/skill/" + imageName;
    this.setState({ "skillimage_path": skillimage_path });
  }

  render() {
    var imagePath = config.image_url;
    var objThis = this;
    return (
      <View>
        <View style={styles.dashcontainer}>
          <View style={styles.contentCenter}>
            <View style={styles.ImageContainer}>
              <TouchableWithoutFeedback onPress={() => this.openIconPop()}>
                <Image style={{ width: 50, height: 50 }} source={{ uri: this.state.skillimage_path }} />
              </TouchableWithoutFeedback>
            </View>
          </View>
          <View style={styles.editstudentclasss}>
            <TextInput style={styles.selectbottomborder} placeholder="Skill Name" onChangeText={(skill_name) => this.setState({ skill_name: skill_name })} value={this.state.skill_name} />
            <View style={styles.selectbottomborder}>
              <Picker selectedValue={this.state.skill_weight} onValueChange={(itemValue, itemIndex) => this.setState({ skill_weight: itemValue })}>
                <Picker.Item label="Select Point" value={0} />
                {
                  this.state.pointList.map(function (item, key) {
                    return (
                      <Picker.Item label={item.value} value={item.value} key={key} />
                    )
                  })
                }
              </Picker>
            </View>
            <TouchableWithoutFeedback title="Save Skill" onPress={this.handleSubmit} >
              <View style={styles.classbtn}>
                <Text style={styles.buttonText}>Save Skill</Text>
              </View>
            </TouchableWithoutFeedback>
            <HideableView visible={this.state.skill_id} removeWhenHidden={true}>
              <Text onPress={() => this.removeSkillCnf()} style={styles.orangetext} >Remove Skill</Text>
            </HideableView>
          </View>
          <Modal visible={this.state.modalVisible} animationType={'slide'} onRequestClose={() => this.closeModal()}>
            <ScrollView>
              <View style={styles.editpopupimage}>
                {
                  this.state.skillIconList.map(function (item, key) {
                    return (
                      <View style={styles.containerImagePop}>
                        <TouchableWithoutFeedback onPress={() => objThis.selectedImage(item.image)} key={key}>
                          <View style={styles.editimage}>
                            <Image style={{ width: 50, height: 50 }} source={{ uri: imagePath + "assets/skill/" + item.image }} key={key} />
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    )
                  })
                }
              </View>
              <TouchableWithoutFeedback onPress={() => this.closeModal()} title="Close">
                <View style={styles.classbtn}>
                  <Text style={styles.buttonText}>Close</Text>
                </View>
              </TouchableWithoutFeedback>
            </ScrollView>
          </Modal>
        </View>
      </View>
    );
  }
}
