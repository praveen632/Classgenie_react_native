import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage,
  FlatList,
  Image,
  TextInput,
  Alert,
  ScrollView,
  TouchableHighlight,
  style,
  Modal,
  TouchableWithoutFeedback,
  ToastAndroid,
  WebView,
  YourCustomizedFunction,
  TouchableOpacity
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import ChatServices from '../services/ChatServices';
import config from '../assets/json/config.json';
import TimeAgo from 'react-native-timeago';
import styles from '../assets/css/mainStyle';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import ImagePicker from 'react-native-image-picker';
var FormData = require('form-data');
import axios from 'axios';
import ChatVideo from './ChatVideo';
import DismissKeyboard from 'dismissKeyboard';
// import VideoPlayer from 'awesome-react-native-video-controls';
export default class Chat extends Component {

  constructor(props) {
    super(props);
    this.state = {
      loggedInUser: {},
      class_ids: '',
      member_no_msg: '',
      class_id_chat: '',
      imageName: '',
      Name: '',
      sender_ac_no: '',
      sender_name: '',
      parent_id: '',
      teacher_id: '',
      class_id: '',
      receiver_ac_no: '',
      receiver_name: '',
      page_number: '',
      user_details: [],
      callByLoadMore: 0,
      paginations: '',
      message_val: '',
      modalVisible: false,
      smilyImageList: [],
      classimage: '',
      classimage_path: '',
      ImageSource: '',
      navigator
    }
    this.getChatList = this.getChatList.bind(this);
    this.updateNotification = this.updateNotification.bind(this);
    this.loadMessages = this.loadMessages.bind(this);
    this.removeChat = this.removeChat.bind(this);
    this.loadPrevious = this.loadPrevious.bind(this);
    this._sendMessage = this._sendMessage.bind(this);
    this.sendMessageInit = this.sendMessageInit.bind(this);
    this.updateDBMedia = this.updateDBMedia.bind(this);
    this.updateDBVedio = this.updateDBVedio.bind(this);
    this.updateDB = this.updateDB.bind(this);
    this.getSmilyImageList = this.getSmilyImageList.bind(this);
    this.showEmotionList = this.showEmotionList.bind(this);
    this.selectedImage = this.selectedImage.bind(this);
    this.showPicturePopup = this.showPicturePopup.bind(this);
  }

  async componentDidMount() {
    DismissKeyboard();
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    ),
      await AsyncStorage.getItem('classid').then((value) =>
        this.setState({ "class_ids": value })
      ),
      await AsyncStorage.getItem('member_no_chat').then((value) =>
        this.setState({ "member_no_msg": value }),
      ),
      await AsyncStorage.getItem('class_id_chat').then((value) =>
        this.setState({ "class_id_chat": value }),
      ),
      await AsyncStorage.getItem('classIcon').then((value) =>
        this.setState({ "imageName": value })
      )
    this.setState({ "sender_ac_no": this.state.loggedInUser.member_no });
    this.setState({ "sender_name": this.state.loggedInUser.name });
    this.setState({ "page_number": 1 });
    this.getSmilyImageList();
    this.getChatList();
  }

  getChatList() {
    if (this.state.member_no_msg) {
      this.setState({ "Name": 'Message' });
      //Check teacher or parent login for one parent
      if ((this.state.sender_ac_no).substr(0, 1) == '2') {
        var parent_ids = this.state.member_no_msg;
        var teacher_ids = this.state.sender_ac_no;
        this.setState({ "parent_id": parent_ids });
        this.setState({ "teacher_id": teacher_ids });
      }
      else {
        var class_ids = this.state.class_ids;
        var teacher_ids = this.state.member_no_msg;
        var parent_ids = this.state.sender_ac_no;
        this.setState({ "class_id": class_ids });
        this.setState({ "teacher_id": teacher_ids });
        this.setState({ "parent_id": parent_ids });
      }
      this.updateNotification(this.state.sender_ac_no, this.state.member_no_msg, this.state.class_ids); //update notification
      var member_no = this.state.member_no_msg;
      var obj = this;
      ChatServices.parentSearch(this.state.member_no_msg).then(function (response) {
        if (response.data.status == 'Success') {
          var receiver_ac_nos = member_no;
          var receiver_names = response.data.user_list[0].name;
          obj.setState({ "receiver_ac_no": receiver_ac_nos });
          obj.setState({ "receiver_name": receiver_names });
        }
        obj.loadMessages({ teacher_id: obj.state.teacher_id, parent_id: obj.state.parent_id });
      });
    } else {
      this.setState({ "Name": 'All Parents' });
      var teacher_ids = this.state.sender_ac_no;
      this.setState({ 'teacher_id': teacher_ids });
      var parent_ac_nos = '', receiver_names = '', receiver_ac_nos = '';
      var obj = this;
      var class_idss = (obj.state.class_id_chat).toString();
      ChatServices.studentMsgListss(class_idss).then(function (response) {
        if (response.data['user_list'] != '') {
          var data = response.data['user_list'];


          for (var i = 0; i < data.length; i++) {
            if (data[i].parent_ac_no != '0') {
              parent_ac_nos += ',' + data[i].parent_ac_no;
              receiver_names += ',' + data[i].parent_detail.name;
              receiver_ac_nos += ',' + data[i].parent_ac_no;
            }
          }
          if (parent_ac_nos != '') {
            var parent_ids = parent_ac_nos.substring(1);
            var receiver_names = receiver_names.substring(1);
            var receiver_ac_nos = receiver_ac_nos.substring(1);
            obj.setState({ 'parent_id': parent_ids });
            obj.setState({ 'receiver_name': receiver_names });
            obj.setState({ 'receiver_ac_no': receiver_ac_nos });
            obj.loadMessages({ teacher_id: obj.state.sender_ac_no, parent_id: obj.state.parent_id });
          }
          else {
            obj.setState({ 'parent_id': '' });
          }
        }
      });
    }
    Actions.refresh({ title: this.state.Name, initial: true });
  }

  updateNotification(sender_ac_no, member_no, class_id) {

  }

  loadMessages(resp) {
    var obj = this;
    ChatServices.chatList(resp.teacher_id, resp.parent_id, obj.state.class_ids, obj.state.page_number).then(function (response) {
      var user_info = response.data['user_list'];
      var data = response.data['user_list'];
      if (data.length > 0) {
        for (var i = 0; i < data.length; i++) {
          var message = '';
          if (data[i].message.indexOf('image#$#') > -1) {
            var msg = data[i].message.split('#$#');
            message = <Image style={{ width: 60, height: 60 }} source={{ uri: config.image_url + 'assets/chat/' + msg[1] }} />;
          } else if (data[i].message.indexOf('video#$#') > -1) {
            var msg = data[i].message.split('#$#');
            var arr_video = msg[1].split('.');
            message = <ChatVideo videoUrl={config.image_url + 'assets/chat/' + msg[1]} />
          } else if (data[i].message.indexOf('emotion_image') > -1) {
            var msg = data[i].message.split('~');
            message = <Image style={{ width: 60, height: 60 }} source={{ uri: config.image_url + 'assets/chaticon/' + msg[1] }} />;
          } else {
            message = <Text style={styles.chatmsg} >data[i]['message']</Text>
          }
          user_info[i]['message'] = message;
        }
        var create = data[0]['created_at'];
        if ((obj.state.user_details).length > 0 && obj.state.callByLoadMore == 1) {
          for (let k = 0; k < (user_info).length; k++) {
            (obj.state.user_details).push(user_info[k]);
            obj.setState({ 'user_details': obj.state.user_details });
          }

        }
        else {
          var user_detail = user_info;
          obj.setState({ 'user_details': user_detail });
        }
        obj.setState({ 'callByLoadMore': 0 });
      }
      if (data.length > 9) {
        obj.setState({ 'paginations': true });
      } else {
        obj.setState({ 'paginations': false });
      }
    });
  }

  removeChat(id, receiver_ac_no, message) {
    alert(11);
    var obj = this;
    ChatServices.removeChat(id, receiver_ac_no, message).then(function (response) {
      Alert.alert(
        '',
        'Massege has been deleted',
        [
          { text: 'OK', onPress: () => obj.getChatList() },
        ],
      )
    });
  }

  loadPrevious() {
    var obj = this;
    var page = obj.state.page_number + 1;
    obj.setState({ 'callByLoadMore': 1 });
    obj.setState({ "page_number": page });
    obj.getChatList();
  }


  _sendMessage() {
    var obj = this;
    var message_v = obj.state.message_val;
    obj.sendMessageInit(0, message_v);
    obj.setState({ 'message': '' });
  }

  sendMessageInit(source, imgData) {
    var obj = this;
    if (obj.state.member_no_msg) {
      if (source == 1) {
        //source 1 means for image or video
        obj.updateDBMedia(obj.state.teacher_id, obj.state.parent_id, imgData);
      } else if (source == 2) {
        obj.updateDBVedio(obj.state.teacher_id, obj.state.parent_id, imgData);
      }
      else {
        obj.updateDB(obj.state.teacher_id, obj.state.parent_id, imgData);
      }
    } else {
      if (source == 1) {
        obj.updateDBMedia(obj.state.teacher_id, obj.state.parent_id, imgData);
      }
      else if (source == 2) {
        obj.updateDBVedio(obj.state.teacher_id, obj.state.parent_id, imgData);
      }
      else {
        obj.updateDB(obj.state.teacher_id, obj.state.parent_id, imgData);
      }
    }
    obj.setState({ 'message': '' });
  }

  updateDBMedia(teacher_id, parent_id, imgData) {
    var obj = this;
    var url = config.api_url + ':' + config.port + '/chats/chat_media?token=' + config.api_token;
    var configHeader = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
    const formData = new FormData();
    formData.append('upload_file', { uri: imgData, name: '1.jpg', type: "image/jpeg", chunkedMode: false });
    formData.append('teacher_id', teacher_id);
    formData.append('parent_id', parent_id);
    formData.append('sender_name', obj.state.sender_name);
    formData.append('receiver_name', obj.state.receiver_name);
    formData.append('sender_ac_no', obj.state.sender_ac_no);
    formData.append('receiver_ac_no', obj.state.receiver_ac_no);
    formData.append('class_id', obj.state.class_ids);
    formData.append('token', config.api_token);
    return new Promise(resolve => {
      axios.post(url, formData, configHeader)
        .then(function (response) {
          resolve(response);
          ToastAndroid.showWithGravity(
            'Class Story Added successfully',
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
          obj.setState({ "page_number": 1 });
          obj.getChatList();

        }
        )
        .catch((error) => {
          console.error(error);
        });
    });
  }

  updateDBVedio(teacher_id, parent_id, imgData) {
    var obj = this;
    var s = imgData;
    var fields = s.split('/');
    var nameOfVideo = fields.slice(-1)[0];
    console.log(nameOfVideo);
    var url = config.api_url + ':' + config.port + '/chats/chat_media?token=' + config.api_token;
    var configHeader = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    }
    const formData = new FormData();
    formData.append('upload_file', { uri: imgData, name: '1.mp4', type: "video/mp4", chunkedMode: false });
    formData.append('teacher_id', teacher_id);
    formData.append('parent_id', parent_id);
    formData.append('sender_name', obj.state.sender_name);
    formData.append('receiver_name', obj.state.receiver_name);
    formData.append('sender_ac_no', obj.state.sender_ac_no);
    formData.append('receiver_ac_no', obj.state.receiver_ac_no);
    formData.append('class_id', obj.state.class_ids);
    formData.append('token', config.api_token);
    return new Promise(resolve => {
      axios.post(url, formData, configHeader)
        .then(function (response) {
          resolve(response);
          ToastAndroid.showWithGravity(
            'Video Added successfully',
            ToastAndroid.LONG,
            ToastAndroid.CENTER
          );
          obj.setState({ "page_number": 1 });
          obj.getChatList();

        }
        )
        .catch((error) => {
          console.error(error);
        });
    });
  }

  updateDB(teacher_id, parent_id, message) {
    var obj = this;
    var data = {
      teacher_id: teacher_id,
      parent_id: parent_id,
      message: message,
      sender_name: obj.state.sender_name,
      receiver_name: obj.state.receiver_name,
      sender_ac_no: obj.state.sender_ac_no,
      receiver_ac_no: obj.state.receiver_ac_no,
      class_id: obj.state.class_ids,
      token: config.api_token
    }
    ChatServices.updateDB(data).then(function (response) {
      if (response.data.message == 1) {
        obj.setState({ "page_number": 1 });
        obj.textInput.clear();
        obj.getChatList();
      }

    });

  }

  getSmilyImageList() {
    var objThis = this;
    ChatServices.getSmilyImageList().then(function (response) {
      objThis.setState({ 'smilyImageList': response.data });

    });
  }

  showEmotionList() {
    var obj = this;
    obj.setState({ modalVisible: true });
  }

  closeModal() {
    this.setState({ modalVisible: false });
  }

  selectedImage(imageName) {
    var obj = this;
    obj.closeModal();
    var message_v = 'emotion_image~' + imageName;
    obj.sendMessageInit(0, message_v);
  }

  showPicturePopup() {
    const options = {
      quality: 1.0,
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
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
        var imageData = response.uri;
        this.sendMessageInit(1, imageData);
      }
    });
  }

  showVideo() {
    const options = {
      title: 'Video Picker',
      takePhotoButtonTitle: 'Take Video...',
      mediaType: 'video',
      videoQuality: 'medium'
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled video picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        var imageData = response.uri;
        this.sendMessageInit(2, imageData);
      }
    });
  }

  toggleClass(sender_ac_no) {
    if (sender_ac_no !== this.state.sender_ac_no) {
      return styles.chatstyle;
    }
    else {
      return styles.leftchat;
    }
  }

  render() {
    var imagePath = config.image_url;
    var objThis = this;
    const invButt = this.state.paginations;
    let button_pagination = null;
    if (invButt) {
      button_pagination =
        // <Button  onPress={()=>this.loadPrevious()} title="Load Previous Data" /> ; 
        <TouchableHighlight style={styles.classbtn} onPress={() => this.loadPrevious()} title="Load Previous Data">
          <Text style={styles.buttonText}>
            Load Previous Data
       </Text>
        </TouchableHighlight>;
    }

    return (
      <View style={{ flex: 1 }}>

        <View style={[styles.dashcontainer, styles.marginbottom100]}>

          {button_pagination}
          <FlatList
            style={[style, { transform: [{ scaleY: -1 }, { perspective: 1280 }] }]}
            data={this.state.user_details}
            renderItem={({ item }) => (
              <View style={{ transform: [{ scaleY: -1 }, { perspective: 1280 }] }}>
                <View style={this.toggleClass(item.sender_ac_no)}>
                  <View style={{ flexDirection: 'row' }}>
                    <View style={styles.chattext}>
                      {item.message}
                    </View>
                    <View style={styles.crosschaticon}>
                      <Text style={{ textAlign: 'right' }}> {item.sender_ac_no === this.state.sender_ac_no ? <FontAwesome style={styles.fontmsgstyle}><Text onPress={() => this.removeChat(item.id, item.message, item.receiver_ac_no)}>{Icons.times}</Text></FontAwesome > : null}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.chatmsg} >
                      {item.sender_name} ,
                        </Text>
                    <Text style={styles.chathour} >
                      <TimeAgo time={item.created_at} />
                    </Text>
                  </View>
                </View>
              </View>

            )}
            keyExtractor={(item, index) => index}
          />

        </View>

        <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
          <View style={styles.chatviewmsg}>
            <TouchableHighlight onPress={() => this.showPicturePopup()}>
              <FontAwesome style={styles.chaticon}>
                {Icons.camera}
              </FontAwesome>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => this.showVideo()}>
              <FontAwesome style={styles.chaticon}>
                {Icons.videoCamera}
              </FontAwesome>
            </TouchableHighlight>

            <TouchableHighlight onPress={() => this.showEmotionList()}>
              <FontAwesome style={styles.chaticon}>
                {Icons.smileO}
              </FontAwesome>
            </TouchableHighlight>
            <View style={{ flexWrap: 'wrap' }}>
              <TextInput style={{ height: 40, width: 300 }} placeholder="Type your message" ref={input => { this.textInput = input }} onChangeText={(text) => this.setState({ message_val: text })} />
            </View>
            <TouchableHighlight onPress={() => this._sendMessage()}>
              <FontAwesome style={styles.angleicon}>
                {Icons.arrowCircleRight}
              </FontAwesome>
            </TouchableHighlight>
          </View>
        </View>


        {/* modal popup start here */}
        <Modal visible={this.state.modalVisible} animationType={'slide'} onRequestClose={() => this.closeModal()}>
          <ScrollView>
            <View style={styles.editpopupimage}>
              {
                this.state.smilyImageList.map(function (item, key) {
                  return (
                    <View style={styles.containerImagePop}>
                      <TouchableWithoutFeedback onPress={() => objThis.selectedImage(item.value)} key={key}>
                        <View style={styles.editimage}>
                          <Image style={{ width: 50, height: 50 }} source={{ uri: imagePath + "assets/chaticon/" + item.value }} key={key} />
                        </View>
                      </TouchableWithoutFeedback>

                    </View>

                  )
                })
              }

            </View>
            {/* <Button onPress={() => this.closeModal()} title="Close" /> */}
            <TouchableHighlight style={styles.classbtn} title="Close" onPress={() => this.closeModal()}>
              <Text style={styles.buttonText}>Close</Text>
            </TouchableHighlight>

          </ScrollView>
        </Modal>

        {/* modal popup start here  end */}





      </View>
    );
  }
}

