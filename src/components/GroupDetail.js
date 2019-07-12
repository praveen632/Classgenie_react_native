import React, { Component } from 'react';
import { TouchableWithoutFeedback, StyleSheet, Text, View, Image, Button, AsyncStorage, ScrollView, FlatList, TouchableHighlight, TouchableOpacity, Alert } from 'react-native';
import { Actions } from 'react-native-router-flux';
import CustomTabBar from "./CustomTabBar";
import TeacherServices from '../services/teacherServices';
import config from '../assets/json/config.json';
import HideableView from 'react-native-hideable-view';
import styles from '../assets/css/mainStyle';
import Menu from 'react-native-pop-menu';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Loader from './Loader';
import DismissKeyboard from 'dismissKeyboard';

export default class GroupDetail extends Component {

  constructor(props) {
    super(props);
    this.state = {
      showLoader: 0,
      loggedInUser: {},
      studentList: [],
      groupList: [],
      classid: '',
      classname: '',
      group_id: '',
      group_name: '',
      currentTab: 'group',
      menuVisible: false,
      arrowPosition: 'topRight',
      left: 12,
      right: undefined,
      color: '#F5FCFF',
    }
  }

  async componentDidMount() {
    /* Close keypad */
    DismissKeyboard();
    /* Get local storage values */
    await AsyncStorage.getItem('app_token').then((value)=> 
      this.setState({"app_token": value})
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

    this.setState({ "group_id": this.props.group_id });
    this.setState({ "group_name": this.props.group_name })
    /* Set title */
    Actions.refresh({ title: this.state.group_name });
    /* Get student list in the time to page load */
    this.getStudentListOfGroup();

  }

  /* Display header left side the back button */
  _renderLeftHeader() {
    return (      
      <View style={styles.Leftheaderstyle}>
        <TouchableWithoutFeedback onPress={() => Actions.pop()}>         
          <View><FontAwesome style={styles.LeftheaderIconStyle}>{Icons.times}</FontAwesome></View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  /* Display header middle title */
  _renderMiddleHeader() {
    return (
      <View style={styles.Middleheaderstyle}>
        <Text style={styles.MiddleHeaderTitlestyle}>{this.props.title}</Text>
      </View>
    )
  }

  /* Display drower in right side in header */
  _renderRightHeader() {
    return (
      <View style={styles.Rightheaderstyle}>
        <TouchableWithoutFeedback  onPress={() => {
            this.setState({
              menuVisible: true,
              arrowPosition: 'topRight',
              left: undefined,
              right: 12,
            });
          }}
        >
          <View>
            <FontAwesome style={styles.RightheaderIconStyle}>{Icons.ellipsisV}</FontAwesome>
          </View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  /* Give feedback in group */
  openGroupFeedback() {
    Actions.FeedbackManager({ group_id: this.state.group_id, group_name: this.state.group_name });
  }

  /* Remove feedback confirometion box */
  removeGroupCnf() {
    Alert.alert(
      '',
      'Are you sure you want to delete this group ?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => this.removeGroup() },
      ],
    );

  }

  /* Remove group */
  removeGroup() {
    var param = {
      token: this.state.app_token,
      class_id: (this.state.classid).toString(),
      group_id: (this.state.group_id).toString(),
    }
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    TeacherServices.removeGroup(param).then(function (resp) {
      objThis.setState({ "showLoader": 0 });
      if (resp['data']['status'] == "Success") {
        Actions.ClassRoom({ 'currentTab': 'group' });
        Alert.alert(
          '',
          'Group Removed successfully.',
          [
            { text: 'OK', style: 'cancel' },
          ],
        );

      } else {
        Alert.alert(
          '',
          'Unable to remove. Please try again later',
          [
            { text: 'OK', style: 'cancel' },
          ],
        );
      }
    });
  }

  /* Get student list */
  getStudentListOfGroup() {
    var objThis = this;
    var objThis = this;
    objThis.setState({ "showLoader": 0 });
    TeacherServices.getStudentListOfGroup(this.state.classid, this.state.group_id,this.state.app_token).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      objThis.setState({ 'studentList': response.data.student_info });
    });
  }

  /* Get point list in class */
  getPointClsBg(pointWeight) {
    if (pointWeight > 0) {
      return styles.classstyles;
    }
    else if (pointWeight < 0) {
      return styles.classtyl;
    }
    else {
      return styles.graystyle;
    }
  }

  render() {
    var imagePath = config.image_url;
    var server_path = config.server_path;
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
        <View style={[styles.customHeaderContainer]}>
          {this._renderLeftHeader()}
          {this._renderMiddleHeader()}
          {this._renderRightHeader()}
        </View>
        <View style={styles.dashcontainer}>
          <FlatList
            data={this.state.studentList}
            renderItem={({ item }) =>
              <View style={styles.addback}>
                <View style={{ flexDirection: 'row' }}>
                  <View style={styles.textstylebtn}   >
                    <Text style={objThis.getPointClsBg(item.pointweight)}  >
                      {item.pointweight}
                    </Text>
                  </View>
                </View>
                <View>
                  <Text>
                    <Image style={{ width: 220, height: 220 }} source={{ uri: imagePath + 'assets/student/' + item.image }} />
                  </Text>
                  <Text style={{ textAlign: 'center' }} >
                    {item.name}
                  </Text>
                </View>
              </View>
            }
            keyExtractor={(item, index) => index}
          />
          <TouchableWithoutFeedback onPress={() => this.openGroupFeedback()} style={styles.classbtn}>
            <View style={styles.classbtn}>
              <Text style={styles.buttonText}>Award Group</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
        <Menu visible={this.state.menuVisible}
          onVisible={(isVisible) => {
            this.state.menuVisible = isVisible
          }}
          left={this.state.left}
          right={this.state.right}
          arrowPosition={this.state.arrowPosition}
          data={[
            {
              title: 'Edit Group',
              onPress: () => { Actions.AddGroup({ group_id: this.state.group_id, group_name: this.state.group_name }); }
            },

            {
              title: 'Delete Group',
              onPress: () => { this.removeGroupCnf(); }
            }
          ]}
          contentStyle={{ backgroundColor: 'teal' }} />
      </ScrollView>
      }
      </View>
    );
  }
}
