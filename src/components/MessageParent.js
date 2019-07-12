import React, { Component } from 'react';
import {TouchableWithoutFeedback, StyleSheet, Text, View, Button, AsyncStorage, TouchableOpacity, FlatList, Image,ScrollView, TouchableHighlight} from 'react-native';
import MassegeServices from '../services/massegeServices';
import { Actions } from 'react-native-router-flux';
import CustomTabBar from "./CustomTabBar";
import styles from '../assets/css/mainStyle';
import axios from 'axios';
import config from '../assets/json/config.json';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Loader from './Loader';
import DismissKeyboard from 'dismissKeyboard';

export default class MessageParent extends Component {
  constructor()
  {
    super();
    this.state ={
      showLoader: 0,
      loggedInUser: {},
      class_id:'',
      classname:'',
      user_list:{},
      chat_notification:{},
      parentDetails:{},
      no_of_parent:0,
      profileImage: '',   
    }
    this.getTeacherchatlist = this.getTeacherchatlist.bind(this);
    this.fillParentMessageHtml = this.fillParentMessageHtml.bind(this);     
  }

  async componentDidMount()
  { 
    /* Close keypad */
    DismissKeyboard();
    /* Get local storage values */
    await AsyncStorage.getItem('loggedInUser').then((value)=>
    this.setState({"loggedInUser": JSON.parse(value)})
    ),
    await AsyncStorage.getItem('classid').then((value)=>
      this.setState({"class_id": value})     
    )    
    await AsyncStorage.getItem('classname').then((value)=>
      this.setState({"classname": value})     
    )    
    await AsyncStorage.getItem('app_token').then((value)=> 
      this.setState({"app_token": value})
    );
    /* Set profile image */
    if (this.state.loggedInUser['image']) {
      var profileImage = config.image_url + '/assets/profile_image/' + this.state.loggedInUser['image']+ '?=' + Math.random();;
    } else {
      var profileImage = config.server_path + '/assets/images/chat_user.png';
    }
    this.setState({ "profileImage": profileImage });
    /* Get teacher list on page load */
    this.getTeacherchatlist(); 
  }

  /*get techer list */
  getTeacherchatlist(){  
  var obj = this;  
  var member_no = this.state.loggedInUser.member_no;
  obj.setState({ "showLoader": 0 });
  /* Call function in massege service to get teacher msg list */
  MassegeServices.getTeacherMessgList(this.state.app_token, member_no).then(function(response){ 
    obj.setState({ "showLoader": 0 });
    if(response.data.status == 'Failure')
     { 
       Alert.alert(
         '',
         response.data.comments,
         [ 
           {text: 'OK', style: 'cancel'},
         ],
       )       
     }
     else
     {       
       if((response.data).length > 0 ){
        obj.fillParentMessageHtml(response.data);
       }
       }
   });
  }

  /* Send notification to teacher */
  fillParentMessageHtml(datas){
    var member_no = this.state.loggedInUser.member_no;
    var obj = this;
    var notification_sender_ac_no = '';
    var no_of_users = 1;
     for(var i=0;i<datas.length;i++){      
       if(typeof datas[i].teacher_info !== 'undefined'){
         notification_sender_ac_no += ','+datas[i].class_info.teacher_ac_no;
     }
     }
     if(notification_sender_ac_no != ''){
       notification_sender_ac_no = notification_sender_ac_no.substring(1);          
       }
      
       var chat_notification = {};
       obj.setState({ "showLoader": 0 });
       MassegeServices.teacherChat_notification(this.state.app_token, notification_sender_ac_no, member_no).then(function(response){         
        obj.setState({ "showLoader": 0 });
        var responseData = response.data;
        for(var i=0;i<(responseData).length;i++){
         if(typeof  chat_notification[responseData[i].sender_ac_no] == 'undefined'){
                var chatData = chat_notification[responseData[i].sender_ac_no] = [];
                obj.setState({'chat_notification':chatData});
           }
           if(typeof chat_notification[responseData[i].sender_ac_no][responseData[i].receiver_class_id]  == 'undefined'){
             var chatData = chat_notification[responseData[i].sender_ac_no][responseData[i].receiver_class_id] = [];
             obj.setState({'chat_notification':chatData});
           }
            var chatData = chat_notification[responseData[i].sender_ac_no][responseData[i].receiver_class_id].push(responseData[i]);
            obj.setState({'chat_notification':chatData});
           }             
        }); 
        obj.setState({'parentDetails':datas});
        for(var i=0; i<datas.length; i++){
         if(typeof datas[i].teacher_info != 'undefined'){            
                 var parent_conn  = no_of_users++; 
                 obj.setState({'no_of_parent':parent_conn});        
              }                     
        }        
  }

  /* Set teacher details and to move chat page */
  setTeacherDetail(name,teacher_ac_no,class_id){
       AsyncStorage.removeItem('classid');
       AsyncStorage.setItem('classid', class_id);
       AsyncStorage.setItem('message_account_name', JSON.stringify(name));
       AsyncStorage.removeItem('class_id_chat');
       AsyncStorage.setItem('member_no_chat',  JSON.stringify(teacher_ac_no));
       Actions.Chat();

  }  

  /* Left side header to move back */
  _renderLeftHeader() {
    return (
      <View style={styles.Leftheaderstyle}>        
        <View style={{ width: 40, height: 40, borderRadius: 40/2}}>
            <Image style={{ width: 40, height: 40, borderRadius: 40/2 }} source={{ uri: this.state.profileImage  }}></Image>
          </View>
      </View>
    )
  } 

  /* Middle header content */
  _renderMiddleHeader() {
    return (
      <View style={styles.MiddleheaderstyleLeft}>
        <Text style={[styles.MiddleHeaderTitlestyle,styles.padding5]}>{this.state.loggedInUser.name}'s Dashboard</Text>
      </View>
    )
  }

  render() {   
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
        {/* start header part */}
        <View style={[styles.customHeaderContainer]}>
          {this._renderLeftHeader()}
          {this._renderMiddleHeader()}        
        </View>  
        {/* End header part  */}
          <View>
          <CustomTabBar tabList={[{ 'title': 'Class Story',  actionPage: () => Actions.ClassStoryParent(), tabIcon: 'users' },{ 'title': 'Message', currentTab: 1, tabIcon: 'envelope' },{ 'title': 'Your Kids', actionPage: () => Actions.YourkidsParent(), tabIcon: 'image' }]} />
        </View>        
        <View style={styles.classcontainer}  >
          <View>
            <Text style={styles.textchange}>
              Message
          </Text>      
          </View> 
          <View style={styles.backchange}>           
        <FlatList
            data={ this.state.parentDetails }
            renderItem={({item}) => ( 
              <View style={styles.listviewclass}>
                  <View style={styles.classstoryimage}>
                    <Image style={{ width: 50, height: 50 }} source={{ uri: config.server_path + '/assets/images/chat_user.png' }} />
                  </View>
                  <View style={styles.classstorycontent} >
                <View>{item.teacher_info !== undefined ? <Text style={styles.listmsgmargin} onPress={() => this.setTeacherDetail(item.teacher_info.name,item.class_info.teacher_ac_no,item.class_id) }>              
                {item.teacher_info.name}{'\n'}           
                <Text style={styles.msgClasssList}>{item.class_info.class_name}</Text>              
                </Text>: null}</View>
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


