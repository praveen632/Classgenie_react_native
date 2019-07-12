/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {Platform, StyleSheet, Text, View,NetInfo,Alert,AsyncStorage} from 'react-native';
import { Router, Scene,Actions } from 'react-native-router-flux';
import SplashScreen from 'react-native-splash-screen';
//var DeviceInfo = require('react-native-device-info');
import FCM, {FCMEvent, RemoteNotificationResult, WillPresentNotificationResult, NotificationType} from 'react-native-fcm';
import axios from 'axios';
import SignupServices from '../services/signupServices';
import Login from './Login';
import ForgetPassword from './ForgetPassword';
import Signup from './Signup';
import SignupTeacher from './SignupTeacher';
import SignupParent from './SignupParent';
import SignupStudent from './SignupStudent';
import SignupLeader from './SignupLeader';
import DashboardTeacher from './DashboardTeacher';
import CheckParentCode from './CheckParentCode';
import DashboardStudent from './DashboardStudent';
import MessageParent from './MessageParent';
import ClassStoryParent from './ClassStoryParent';
import YourkidsParent from './YourkidsParent';
import SignupStudentStage2 from './SignupStudentStage2';
import CustomNavBarWithLeft from "./CustomNavBarWithLeft";
import AddClass from "./AddClass";
import ClassRoom from "./ClassRoom";
import MessageTeacher from "./MessageTeacher";
import ClassStoryTeacher from "./ClassStoryTeacher";
import Chat from "./Chat";
import TeacherProfile from './TeacherProfile';
import ChangePassword from './ChangePassword';
import AddStudent from './AddStudent';
import InviteParents from './InviteParents';
import WholeClassStory from './WholeClassStoryTeacher';
import AddClassStory from './AddClassStory';
import TeacherClassStoryComments from './TeacherClassStoryComments';
import AddGroup from './AddGroup';
import JoinYourSchool from './JoinYourSchool';
import SchoolStory from './SchoolStory';
import EditClassStory from './EditClassStory';
import EditClass from './EditClass';
import EditStudent from './EditStudent';
import PendingStories from './PendingStories';
import PendingStoriesPost from './PendingStoriesPost';
import SchoolStoryComments from './SchoolStoryComments';
import AddSchoolStory from './AddSchoolStory';
import EditSchoolStory from './EditSchoolStory';
import FeedbackManager from './FeedbackManager';
import ClassStoryParentLikes from './ClassStoryParentLikes';
import ClassStoryParentComments from './ClassStoryParentComments';
import ChooseSchool from './ChooseSchool';
import TeacherList from './TeacherList';
import StudentListing from './StudentListing';
import GroupDetail from './GroupDetail';
import AddEditSkill from './AddEditSkill';
import ManageAttendance from './ManageAttendance';
import AddNewSchool from './AddNewSchool';
import AddNewSchoolDetail from './AddNewSchoolDetail';
import PerformanceStudentListing from './PerformanceStudentListing';
import PerformanceGraph from './PerformanceGraph';
import StudentStory from './StudentStory';
import ParentProfile from './ParentProfile';
import ChangePasswordParent from './ChangePasswordParent';
import StudentProfile from './StudentProfile';
import ChangePasswordStudent from './ChangePasswordStudent';
import StudentSchoolStory from './StudentSchoolStory';
import config from '../assets/json/config.json';
import StudentReport from './StudentReport';
import AddParentCode from './AddParentCode';
import ParentRemoveStudent from './ParentRemoveStudent';
import ParentReport from './ParentReport'
import YourStoryStudent from './YourStoryStudent'
import AddStudentStory from './AddStudentStory'
import EditStudentStory from './EditStudentStory'
import AwardMultiStudent from './AwardMultiStudent';
import StudentStoryLikes from './StudentStoryLikes';
import StudentStoryComments from './StudentStoryComments';
import ManualSlide from './ManualSlide';
import Notifications from './Notifications';
import EventManagement from './EventManagement';  
import ParentEventList from './ParentEventList';
import ParentAssignmentKidList from './ParentAssignmentKidList';
import AssignmentListTeacher from './AssignmentListTeacher';
import AddEvent from './AddEvent';
import CreateAssignment from './CreateAssignment';
import SubmittedAssignmentList from './SubmittedAssignmentList';
import EditEvent from './EditEvent';
import StudentEventList from './StudentEventList';
import AssignmentNotification from './AssignmentNotification';
import EditTeacherAssingnment from './EditTeacherAssingnment';
import ParentAssignment from './ParentAssignment';
import AssignmentStudentClassList from './AssignmentStudentClassList';
import AssignmentStudent from './AssignmentStudent';
import EventNotification from './EventNotification';
// this shall be called regardless of app state: running, background or not running. Won't be called when app is killed by user in iOS
FCM.on(FCMEvent.Notification, async (notif) => {
  // there are two parts of notif. notif.notification contains the notification payload, notif.data contains data payload
  if(notif.local_notification){
    //this is a local notification
  }
  if(notif.opened_from_tray){
    //iOS: app is open/resumed because user clicked banner
    //Android: app is open/resumed because user clicked banner or tapped app icon
  }
  // await someAsyncCall();

  if(Platform.OS ==='ios'){
    if (notif._actionIdentifier === 'com.myapp.MyCategory.Confirm') {
      // handle notification action here
      // the text from user is in notif._userText if type of the action is NotificationActionType.TextInput
    }
    //optional
    //iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1623013-application.
    //This library handles it for you automatically with default behavior (for remote notification, finish with NoData; for WillPresent, finish depend on "show_in_foreground"). However if you want to return different result, follow the following code to override
    //notif._notificationType is available for iOS platfrom
    switch(notif._notificationType){
      case NotificationType.Remote:
        notif.finish(RemoteNotificationResult.NewData) //other types available: RemoteNotificationResult.NewData, RemoteNotificationResult.ResultFailed
        break;
      case NotificationType.NotificationResponse:
        notif.finish();
        break;
      case NotificationType.WillPresent:
        notif.finish(WillPresentNotificationResult.All) //other types available: WillPresentNotificationResult.None
        break;
    }
  }
});
FCM.on(FCMEvent.RefreshToken, (token) => {
  console.log(token)

  // fcm token may not be available on first load, catch it here
});
   

export default class App extends Component<{}> {
  constructor() {
  super()
    this.state = {
    isConnected:false,
    id: '',
    loggedInUser:{},
    app_token:'',
    das_device_id:''
    }
  }
 
  async componentDidMount() {
   SplashScreen.hide();
   await this.getToken();    /* generate the Token for application*/  

   NetInfo.addEventListener(   /* Check the internet Connection through event Request*/
      'connectionChange',
      this.handleConnectivityChange.bind(this)
    );

    FCM.requestPermissions().then(()=>console.log('granted')).catch(()=>console.log('notification permission rejected'));
    FCM.getFCMToken().then(token => {
        console.log(token)
        AsyncStorage.setItem('das_device_id', token);
        this.setState({'das_device_id': token });

        /* getting the device id as a token abd set in stoarge*/
        // store fcm token in your server
    });
    
    this.notificationListener = FCM.on(FCMEvent.Notification, async (notif) => {
        this.loadNotification(notif); 
        // optional, do some component related stuff
    });
    
    // initial notification contains the notification that launchs the app. If user launchs app by clicking banner, the banner notification info will be here rather than through FCM.on event
    // sometimes Android kills activity when app goes to background, and when resume it broadcasts notification before JS is run. You can use FCM.getInitialNotification() to capture those missed events.
    // initial notification will be triggered all the time even when open app by icon so send some action identifier when you send notification
    FCM.getInitialNotification().then(notif => {    
    });

 }

    loadNotification(notification){
      var member_no=notification.additionalData.member_no;
      var loggedInUser = this.state.loggedInUser;
        if(loggedInUser == null){
          SignupServices.searchDevice(member_no,this.state.das_device_id).then((response) => {
            if (response.data.status == 'Success') {
              let jsonresponse = response.data['user_list'];
              AsyncStorage.setItem('loggedInUser', JSON.stringify(jsonresponse));
              this.redirectModule(notification);             
             } else {
               throw new Error('Server Error!');
             }
           })
         }
         else
    {
       this.redirectModule(notification);
    }
}

redirectModule(notification)
{
  var module_id=notification.additionalData.module_id;
  var member_no=notification.additionalData.member_no;
  if(module_id==1){
    Actions.WholeClassStory();       
   }
   if(module_id==2){
      Actions.DashboardTeacher();
    }
    if(module_id==3){
       if(member_no.substr(0,1)=='2')
     {      Actions.DashboardTeacher();
      } else{
           Actions.MessageParent();
      }
    }
   if(module_id==4){
      if(member_no.substr(0,1)=='2')
      {
      Actions.DashboardTeacher();
       } else
{      Actions.WholeClassStory();}
  }
}

  componentWillUnmount() {
    NetInfo.removeEventListener('connectionChange', handleConnectivityChange);  /* release the Event of Internet Request*/
    this.notificationListener.remove();
  }
/* Start Token request */
  getToken()
  {
    SignupServices.getToken().then((response) => {
      
      if (response.status == 200) {
        AsyncStorage.setItem('app_token', response.data.token);
       
       } else {
         throw new Error('Server Error!');
       }
     })
  }
/* end the Token request*/

/* start the Evnet Handler function for internet infromation*/
  handleConnectivityChange(connectionInfo) {
    console.log('First change, type: ' + connectionInfo.type + ', effectiveType: ' + connectionInfo.effectiveType);
    if(connectionInfo.type === 'none') {
       this.setState({
         isConnected:false,
         });
         Alert.alert(
          'Internet Connection',
          'Internet Is not found in device',
          [
            {text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel'},
            {text: 'OK', onPress: () => console.log('OK Pressed')},
          ],
          { cancelable: false }
        )
     } else {
       this.setState({
         isConnected:true,
       });
     }
   }
 /* End event request */


  render() {
    return (
       <Router>
  		  <Scene key="root">
          
          {/* Root Screne start*/}
    			<Scene  key="login" 
    			  component={Login}
    			  title="Login"           
            navBar={CustomNavBarWithLeft}
            hideLeft = {1}
            initial 			  
    			/>

        {/* Route forget password*/}  
  			<Scene
    			  key="forgetPassword"
    			  component={ForgetPassword}          
            title="Reset password"
            navBar={CustomNavBarWithLeft}
    			/>

          {/* Signup Screne start*/}   
          <Scene
            key="signup"
            component={Signup}
            title="Sign Up"
            navBar={CustomNavBarWithLeft}           
          />

           {/* Root Screne End*/}
           {/* Route Signup teacher*/} 
          <Scene
            key="signupTeacher"
            component={SignupTeacher}
            title="Signup Teacher"
            navBar={CustomNavBarWithLeft}
          />

           {/* Route Signup parent*/}
          <Scene
            key="signupParent"
            component={SignupParent}
            title="Signup Parent"
            navBar={CustomNavBarWithLeft}
          />

           {/* Route Signup student*/}
          <Scene
            key="signupStudent"
            component={SignupStudent}
            title="Student Signup"
            navBar={CustomNavBarWithLeft}
          />

           {/* Route Check parent code in time to login*/} 
          <Scene
            key="CheckParentCode"
            component={CheckParentCode}
            title="Check Parent Code"
            navBar={CustomNavBarWithLeft}
          />

           {/* Route Signup Student in input username and password*/}
           <Scene
            key="SignupStudentStage2"
            component={SignupStudentStage2}
            title="Signup Student"
            navBar={CustomNavBarWithLeft}
          />

           {/* Route Signup Leader*/}
          <Scene
            key="signupLeader"
            component={SignupLeader}
            title="Signup Leader"
            navBar={CustomNavBarWithLeft}
          />

          {/* Dashboard for teacher start */}  
           <Scene
            key="DashboardTeacher"
            component={DashboardTeacher}
            title="Classgenie"
            hideNavBar={true}
          />
          {/* Dashboard for teacher End */}

           {/* Class story parent */}
          <Scene
            key="ClassStoryParent"
            component={ClassStoryParent}
            hideNavBar={true}          
          />

          {/* Message parent list */}
          <Scene key="MessageParent"
            component={MessageParent}
            hideNavBar={true}
          />

          {/* Parent kid list */}
          <Scene
            key="YourkidsParent"
            component={YourkidsParent}
            hideNavBar={true}
          />

          {/* Dashboard student */}               
           <Scene
            key="DashboardStudent"
            component={DashboardStudent}
            hideNavBar={true}           
          />

          {/* Student story */}
          <Scene
            key="StudentStory"
            component={StudentStory}
            hideNavBar={true}                      
          />

          {/* Add class by teacher */}         
          <Scene
            key="AddClass"
            component={AddClass}
            title="Add New Class"
            navBar={CustomNavBarWithLeft}
          />

          {/* Class list in techer module */}
          <Scene
            key="ClassRoom"
            component={ClassRoom}
            title="Class"
            hideNavBar={true}
          />

          {/* Message in teacher module */}
          <Scene
            key="MessageTeacher"
            component={MessageTeacher}           
            navBar={CustomNavBarWithLeft} 
            actionPage = {()=>Actions.DashboardTeacher()}           
          />

          {/* Class story list in teacher */}
          <Scene
            key="ClassStoryTeacher"
            component={ClassStoryTeacher}
            navBar={CustomNavBarWithLeft} 
            actionPage = {()=>Actions.DashboardTeacher()}   
          />

          {/* Teacher setting */}
         <Scene
            key="teacherProfile"
            component={TeacherProfile}
            title="Profile"
            navBar={CustomNavBarWithLeft}
          />

          {/* Invite parent by techer */}
          <Scene
            key="InviteParents"
            component={InviteParents}
            title="Invite Parents"
            navBar={CustomNavBarWithLeft}
          />

          {/* Add student by tecaher */}
          <Scene
            key="AddStudent"
            component={AddStudent}
            title="Add New Student" 
            hideNavBar={true}                       
          />

          {/* Add group by tecaher */}
          <Scene
            key="AddGroup"
            component={AddGroup}
            title="Add Group"
            navBar={CustomNavBarWithLeft}                                    
          />

          {/* Change Password by tecaher */}
          <Scene
            key="ChangePassword"
            component={ChangePassword}
            title="Change Password"
            navBar={CustomNavBarWithLeft}                       
          />

          {/* Class story comment */}
          <Scene
            key="TeacherClassStoryComments"
            component={TeacherClassStoryComments}
            title="TeacherClassStoryComments"
            navBar={CustomNavBarWithLeft}
            actionPage = {()=>Actions.WholeClassStory()}           
          />

          {/* Whole class story list */}
           <Scene
            key="WholeClassStory"
            component={WholeClassStory}
            title="WholeClassStory"
            navBar={CustomNavBarWithLeft}           
          />
           
           <Scene
            key="EditClass"
            component={EditClass}
            title="Edit Class"
            navBar={CustomNavBarWithLeft}
          />
            
            <Scene
            key="EditStudent"
            component={EditStudent}
            title="Edit Student"
            navBar={CustomNavBarWithLeft}
          />
   
           <Scene
            key="PendingStories"
            component={PendingStories}
            title="Pending Stories"
            navBar={CustomNavBarWithLeft}
           />
           
          <Scene
            key="PendingStoriesPost"
            component={PendingStoriesPost}
            title="Pending Stories Post"
            navBar={CustomNavBarWithLeft}
          />
          
          <Scene
           key="AddClassStory"
           component={AddClassStory}
           title="Add Class Story"
           navBar={CustomNavBarWithLeft}
          />

           <Scene
            key="EditClassStory"
            component={EditClassStory}
            title="Class Story"
            navBar={CustomNavBarWithLeft}
          />

         <Scene
            key="Chat"
            component={Chat}
            title="Chat"
            navBar={CustomNavBarWithLeft}                               
          />

          <Scene
            key="JoinYourSchool"
            component={JoinYourSchool}
            title="Join Your School"
            navBar={CustomNavBarWithLeft}                        
          />

          <Scene
            key="SchoolStory"
            component={SchoolStory}
            title="School Story"
            hideNavBar={true}                        
          />

           <Scene
            key="SchoolStoryComments"
            component={SchoolStoryComments}
            title="School Story Comments"
            navBar={CustomNavBarWithLeft} 
            actionPage = {()=>Actions.SchoolStory()}                       
          />

         <Scene
            key="AddSchoolStory"
            component={AddSchoolStory}
            title="Add School Story"
            navBar={CustomNavBarWithLeft}                                  
          />

          <Scene
            key="EditSchoolStory"
            component={EditSchoolStory}
            title="Edit School Story"
            navBar={CustomNavBarWithLeft}                       
          />
          
          <Scene
            key="ClassStoryParentLikes"
            component={ClassStoryParentLikes}
            title="Parent Likes List"
            navBar={CustomNavBarWithLeft}                       
          />

           <Scene
            key="ClassStoryParentComments"
            component={ClassStoryParentComments}
            title="Parent Comment List"
            navBar={CustomNavBarWithLeft}
            actionPage = {()=>Actions.ClassStoryParent()}                       
          />

           <Scene
            key="FeedbackManager"
            component={FeedbackManager}
            title=""
            hideNavBar={true}                       
          />

          <Scene
            key="ChooseSchool"
            component={ChooseSchool}
            title="Choose School"
            navBar={CustomNavBarWithLeft}
          />
          
           <Scene
            key="TeacherList"
            component={TeacherList}
            title="Teacher List"
            navBar={CustomNavBarWithLeft}
          />

          <Scene
            key="StudentListing"
            component={StudentListing}
            title="Select Student"
            hideNavBar={true}
          />

          <Scene
            key="GroupDetail"
            component={GroupDetail}
            title=""
            hideNavBar={true}
          />

          <Scene
            key="AddEditSkill"
            component={AddEditSkill}
            title=""
            navBar={CustomNavBarWithLeft}           
          />

          <Scene
            key="ManageAttendance"
            component={ManageAttendance}
            title="Take Attendance" 
            hideNavBar={true}          
          />
          
          <Scene
            key="AddNewSchool"
            component={AddNewSchool}
            title="Add School"
            navBar={CustomNavBarWithLeft}                        
          />

          <Scene
            key="AddNewSchoolDetail"
            component={AddNewSchoolDetail}  
            hideNavBar={true}           
          />

          <Scene
            key="PerformanceStudentListing"
            component={PerformanceStudentListing}
            title="View Report"
            navBar={CustomNavBarWithLeft}                        
          />

          <Scene
            key="PerformanceGraph"
            component={PerformanceGraph}
            hideNavBar={true}                                  
          />
          
          <Scene
            key="ParentProfile"
            component={ParentProfile}
            title="Parent Profile"
            navBar={CustomNavBarWithLeft}
          />

          <Scene
            key="ChangePasswordParent"
            component={ChangePasswordParent}
            title="Change Password"
            navBar={CustomNavBarWithLeft}                        
          />

           <Scene
            key="StudentProfile"
            component={StudentProfile}
            title="Student Profile"
            navBar={CustomNavBarWithLeft}                        
          />  

           <Scene
            key="ChangePasswordStudent"
            component={ChangePasswordStudent}
            title="Change Password Student"
            navBar={CustomNavBarWithLeft}                       
          />

          <Scene
            key="StudentSchoolStory"
            component={StudentSchoolStory}
            title="Student School Story"
            navBar={CustomNavBarWithLeft}                          
          />     

          <Scene
            key="AddParentCode"
            component={AddParentCode}
            title="Add New Parent Code"
            navBar={CustomNavBarWithLeft}                       
          />

          <Scene
            key="ParentRemoveStudent"
            component={ParentRemoveStudent}
            title="Remove Student"
            navBar={CustomNavBarWithLeft}                        
          />

          <Scene
            key="StudentReport"
            component={StudentReport}
            navBar={CustomNavBarWithLeft}                                   
          />

         <Scene
            key="ParentReport"
            component={ParentReport}
            hideNavBar={true}                       
          />

          <Scene
            key="YourStoryStudent"
            component={YourStoryStudent}
            hideNavBar={true}                                
          />

           <Scene
            key="AddStudentStory"
            component={AddStudentStory}
            navBar={CustomNavBarWithLeft}                                         
          />
          
            <Scene
            key="EditStudentStory"
            component={EditStudentStory}
            navBar={CustomNavBarWithLeft}                               
          />

          <Scene
            key="AwardMultiStudent"
            component={AwardMultiStudent} 
            title="Add Award to Multiple" 
            navBar={CustomNavBarWithLeft}                            
          />

          
          <Scene
            key="StudentStoryLikes"
            component={StudentStoryLikes} 
            title="Story Likes"
            navBar={CustomNavBarWithLeft}                             
          />           
             
          <Scene
            key="StudentStoryComments"
            component={StudentStoryComments} 
            title="Story Comments"
            navBar={CustomNavBarWithLeft}
            actionPage = {()=>Actions.StudentStory()}                                        
          />

          <Scene
            key="ManualSlide"
            component={ManualSlide} 
            hideNavBar={true}          
          />
          
          <Scene
            key="Notifications"
            component={Notifications} 
            title="Notification Setting"
            navBar={CustomNavBarWithLeft}     
          />

          <Scene
            key="EventManagement"
            component={EventManagement} 
            title="Event List"
            hideNavBar={true}     
          />
          
          <Scene
            key="AssignmentListTeacher"
            component={AssignmentListTeacher} 
            title="Assignment List"
            hideNavBar={true}             
          />

           <Scene
            key="ParentAssignmentKidList"
            component={ParentAssignmentKidList} 
            title="Assignment List"
            navBar={CustomNavBarWithLeft}                       
          />

         <Scene   
            key="ParentAssignment"
            component={ParentAssignment} 
            title="Parent Assignment"
            hideNavBar={true}      
          /> 

           <Scene   
            key="ParentEventList"
            component={ParentEventList} 
            title="Event Details"   />

          <Scene
            key="AddEvent"
            component={AddEvent} 
            title="Add Event"

            navBar={CustomNavBarWithLeft}
          />

          <Scene
            key="CreateAssignment"
            component={CreateAssignment}
            title="Add Assignment"
            navBar={CustomNavBarWithLeft}
            actionPage = {()=>Actions.AssignmentListTeacher()}                           
          />

          <Scene
            key="SubmittedAssignmentList"
            component={SubmittedAssignmentList}
            title="Student List"
            navBar={CustomNavBarWithLeft}
            actionPage = {()=>Actions.AssignmentListTeacher()}                           
          />

           <Scene   StudentEventList
            key="StudentEventList"
            component={StudentEventList} 
            title="Event Details"  
          />

          <Scene
            key="AssignmentNotification"
            component={AssignmentNotification}
            title="Notification"
            navBar={CustomNavBarWithLeft}
            actionPage = {()=>Actions.AssignmentListTeacher()}                           
          />

          <Scene   
            key="EditTeacherAssingnment"
            component={EditTeacherAssingnment} 
            title="Edit Assignment"
            navBar={CustomNavBarWithLeft}
            actionPage = {()=>Actions.AssignmentListTeacher()} 
          />                 
        
           <Scene
            key="EditEvent"
            component={EditEvent}
            navBar={CustomNavBarWithLeft}
            actionPage = {()=>Actions.EventManagement()}                           
           />

          <Scene   
            key="AssignmentStudentClassList"
            component={AssignmentStudentClassList} 
            title="Class List"
            navBar={CustomNavBarWithLeft}  
           />

           <Scene   
            key="AssignmentStudent"
            component={AssignmentStudent} 
            title="Assignment List"
            hideNavBar={true}  
           />

          <Scene
              key="EventNotification"
              component={EventNotification} 
              title="Event Notification "
              navBar={CustomNavBarWithLeft}                                 
            />


        </Scene>
          </Router>
    );
  }
}