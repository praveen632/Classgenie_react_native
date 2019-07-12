import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage,
  ListView,
  FlatList,
  Image,
  Alert,
  TouchableWithoutFeedback,
  ScrollView,
  Modal,
  TextInput,
  TouchableHighlight

} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ClassStoryTeacherServices from '../services/ClassStoryTeacherServices';
import PropTypes from 'prop-types';
import Prompt from 'react-native-prompt';
import styles from '../assets/css/mainStyle';
import Loader from './Loader';
import config from '../assets/json/config.json';
import DismissKeyboard from 'dismissKeyboard';

export default class InviteParents extends Component {
  constructor(props) {
    super(props);
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 })
    this.state = {
      showLoader: 0,
      loggedInUser: {},
      classid: '',
      class_list: "",
      pagecount: '1',
      searchTerm: '',
      index: 0,
      items: {},
      postCount: '',
      teacher_ac_no: '',
      imagefolder: '',
      dataSource: {},
      student_list: {},
      modalVisible: false,
      message: '',
      student_no: '',
      parent_no: '',
      promptVisible: false,
      buttons: ['Class Story', 'Student Story'],
      totalStudent: '',
      student_name: '',      
    };
  }

  async componentDidMount() {
    /* Close keypad */
    DismissKeyboard();
    /* Get local storage values */
    await AsyncStorage.getItem('classid').then((value) =>
      this.setState({ "classid": value })
    );
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    );
    await AsyncStorage.getItem('app_token').then((value) =>
      this.setState({ "app_token": value })
    );
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    /* Get class student list on the time of load page */
    await ClassStoryTeacherServices.getclassStudentlist_parent(this.state.app_token, this.state.classid).then((response) => {
      objThis.setState({ "showLoader": 0 });
      if (response.status == 200) {
        objThis.setState({ student_list: response.data.class_details.student_list })
        objThis.setState({ totalStudent: response.data.class_details.student_list.length })
        var count = response.data.class_details.student_list;
        var connected = 0;
        count.forEach(function (count) {
          if (count.request_status > 0) {
            connected++;
          }        
          objThis.setState({ connected: connected })
          /* Check how many student already invited */
          var comp = ((connected / objThis.state.totalStudent) * 100);
          if (connected > 0) {
            comp = comp + '%';           
          } else if (connected < 1) {
            comp = '0' + '%';           
          }
        });
      } else {
        throw new Error('Server Error!');
      }
    })

  }

  /* Invite parent */
  Inviteparent() {
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    /* Call function in class story teacher services to invite parent */
    ClassStoryTeacherServices.inviteTeacherParent(this.state.message, this.state.student_no, this.state.parent_no, this.state.student_name, this.state.app_token).then((response) => {
      objThis.setState({ "showLoader": 0 });
      if (response.data.status == "Failure") {
        Alert.alert(
          response.data.status.comment,
          [
            { text: 'OK' },
            { text: 'Cancel', style: 'cancel' },
          ],
          { cancelable: false }
        )
      } else if (response.data.mail_flage == "teacher") {
        Alert.alert(
          'This email id already exists as a teacher id',
          [
            { text: 'OK' },
            { text: 'Cancel', style: 'cancel' },
          ],
          { cancelable: false }
        )
      } else {
        objThis.setState({'modalVisible': false});
        Alert.alert(
          'invitation sent successfully  to ' + this.state.student_name + "'s" + ' parent',
          [           
            { text: 'Cancel', style: 'cancel' },
            { text: 'OK' },
          ],
          { cancelable: false }
        )
      }
    })
  }

  /* Open confirmation box to send pdf of invitation  */
  getpdf() {
    Alert.alert(
      'Class Genie',
      'Great We just emailed the parent invites for class',
      [       
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => this.generateInvitationPdf() },
      ],
      { cancelable: false }
    )
  }

  /* Generated pdf of invitation */
  generateInvitationPdf() {
    var obj = this;
    obj.setState({ "showLoader": 0 });
    ClassStoryTeacherServices.generatepdf(this.state.app_token, this.state.classid, this.state.loggedInUser.member_no).then((response) => {
      obj.setState({ "showLoader": 0 });
      if (response.data.status == 'Success') {
        obj.sendmail();
      } else {
        throw new Error('Server Error!');
      }
    })
  }

  /* Send mail to teacher with pdf */
  sendmail() {
    var obj = this;
    obj.setState({ "showLoader": 0 });
    ClassStoryTeacherServices.sendMail(this.state.app_token, this.state.classid, this.state.loggedInUser.member_no).then((response) => {
      obj.setState({ "showLoader": 0 });
      if (response.data.status == 'Success') {
        Actions.DashboardTeacher();
      } else {
        throw new Error('Server Error!');
      }
    })
  }

  /* Close Modal */
  closeModal() {
    this.setState({ 'modalVisible': false });    
  }

  render() {
    var server_path = config.server_path;
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
              {/* Download pdf and send pdf */}
              <View style={styles.invitebgimage}>
                <Image style={{ height: 179, width: '100%' }} source={{ uri: server_path + 'assets/images/invite_back.png' }} />
                <View style={[styles.contentCenter, styles.inviteparentmar]}>
                  <Text> You've connected {this.state.connected} of {this.state.totalStudent} parents </Text>
                  <View style={styles.invitedownloadbtn}>
                    <TouchableWithoutFeedback title="Invite">
                      <View>
                        <Text style={styles.buttonText} onPress={() => this.getpdf()} >
                          Download and print all invites
                  </Text>
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                </View>
              </View>
              <View style={styles.marginTop40}>
                <FlatList
                  data={this.state.student_list}
                  renderItem={({ item }) =>
                    <View style={[styles.whitebackgrounnd, styles.padding]}>
                      <View style={styles.listviewclass}>
                        <View style={styles.classstoryimage}>
                          <Image source={{ uri: server_path + 'assets/images/addimg.png' }} style={styles.listMidSizeImg} />
                        </View>
                        <View style={styles.invitemidcontent}>
                          <Text >
                            {item.name}
                          </Text>
                        </View>
                        {item.request_status == '0' ?
                          <View style={styles.inviterightbtn}>
                            <View style={styles.invitebtn}>
                              <TouchableWithoutFeedback title="Invite">
                                <View>
                                  <Text style={styles.invitetext} onPress={() => this.setState({ modalVisible: true, student_no: item.student_no, parent_no: item.parent_no, student_name: item.name })}>Invite</Text>
                                </View>
                              </TouchableWithoutFeedback>
                            </View>
                          </View>
                          : null
                        }
                      </View>
                    </View>
                  }

                  keyExtractor={(item, index) => index} />
              </View>       
              {/* Open modal for invitation */}
              <Modal
                visible={this.state.modalVisible}
                animationType={'slide'}
                onRequestClose={() => this.closeModal()}
                transparent={false}
                presentationStyle='formSheet'
              >
                <View style={styles.modalContainerpopup}>
                  <View style={[styles.dashstucontainer, styles.padding]}>
                    <Text style={styles.viewreport} >Enter Parent Email address</Text>
                    <TextInput style={styles.styleinput} onChangeText={(email) => this.setState({ 'message': email })} placeholder="Enter Parent Email id" />
                    <View style={{ flexDirection: 'row' }}>
                      <TouchableHighlight style={styles.attenbutton} title="Ok" onPress={() => this.Inviteparent()}>
                        <Text style={styles.buttonText}>Ok</Text>
                      </TouchableHighlight>
                      <TouchableHighlight style={styles.attensavebtn} title="Cancel" onPress={() => this.closeModal()}>
                        <Text style={styles.buttonText}>Cancel</Text>
                      </TouchableHighlight>
                    </View>
                  </View>
                </View>
              </Modal>
            </ScrollView>
        }
      </View>
    );
  }
}


