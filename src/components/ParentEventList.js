import React, { Component } from 'react';
import {
  TouchableHighlight, TouchableWithoutFeedback, Clipboard, Platform, TouchableOpacity, StyleSheet, Text, View, Button, SectionList, AsyncStorage, FlatList, Image, ScrollView, Alert, ToastAndroid, Picker, Modal, TextInput
} from 'react-native';
import { Actions, Tabs } from 'react-native-router-flux';
import ParentEventService from '../services/ParentEventService';
import config from '../assets/json/config.json';
import styles from '../assets/css/mainStyle';
import Share, { ShareSheet } from 'react-native-share';
import Loader from './Loader';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import HideableView from 'react-native-hideable-view';
import DismissKeyboard from 'dismissKeyboard';

export default class ParentEventList extends Component {
  constructor() {
    super();
    this.state = {
      loggedInUser: {},
      showLoader: 0,
      eventList: {},
      eventSource: '',
      modalVisible: false,
      displaySchedule: 0,
      displayResponsibility: 0,
      startDateArray: [],
      endDateArray: [],
      school_details:[],    
      responsibiltyList: [],
      responsibilty_list:'',
      total_volunteer_count:0
    }
  } 
  
    async componentWillMount() {
     /* Close keypad */
      DismissKeyboard();     
     /* Get local storage values */
      await AsyncStorage.getItem('app_token').then((value) =>
        this.setState({ "app_token": value })
      );
      await AsyncStorage.getItem('loggedInUser').then((value) =>
        this.setState({ "loggedInUser": JSON.parse(value) })
      ); 
      /* Load All the event list on page load */
      await this.eventSchoolDetail();  
    }

  /* calling api for school list */
   eventSchoolDetail() {
    var objThis = this;
    ParentEventService.eventParentschool(this.state.app_token, this.state.loggedInUser.member_no).then(function (response) {
      objThis.setState({ 'schoolName': response.data.school_name });  
      if (response.data.status == 'Failure') {
        alert('school is not  found');
      } else if (response.data.status == 'Success') {        
         objThis.setState({ 'school_details': response.data.school_name });
         objThis.setState({ 'school_id': response.data.school_name['0']['school_id']});   
         objThis.getEventList()      
      }     
    });   
  }                          
  
  /*function for event list here.........................*/
   getEventList(school_id){
    var objThis = this;
    ParentEventService.getEvent(this.state.app_token,this.state.school_id,this.state.page_number,this.state.source).then(function (response) {
      if (response.data['status'] == "Success") {
        objThis.setState({ 'eventList': response.data.event_details});
      }
      else if(response.data['status'] == "Failure"){
        ToastAndroid.showWithGravity(
          'You are already volunteer of this event',
          ToastAndroid.SHORT,
          ToastAndroid.CENTER  
        );
      }   
    });
   }


    changeEventSource(itemValue) {      
      this.setState({ eventSource: itemValue }, () => { this.getEventList() });
    }   

   /*function for get responsebility List list here.........................*/
   showResponsibility(event_id) {
         var objThis = this;
            ParentEventService.responseList( this.state.app_token,event_id).then(function (response) {
         if (response.data['status'] == "Success") {
          objThis.setState({ "displaySchedule": 0, "displayResponsibility": 1, responsibiltyList: response.data['responsibilty_list'] }, () => { objThis.openModel() });   
          objThis.setState({ event_id: event_id })                    
          }   
          else if(response.data['status'] == "Failure"){
            ToastAndroid.showWithGravity(
              'You are already volunt of this event',
              ToastAndroid.SHORT,
              ToastAndroid.CENTER      
            );;
         }                 
        });         
            this.setState({ modalVisible: true })
        }

        /* Open Modal */
        openModel() {
          this.setState({ modalVisible: true });
        }

        /* Close modal */
        closeModal() {
          this.setState({ modalVisible: false });
        }

        /* Add volunter */
        addVolunter(event_id){
          var objThis = this;
          ParentEventService.addVolunter(this.state.app_token,this.state.loggedInUser.member_no, event_id).then(function (response) {
          if (response.data.status == 'Success') {
            objThis.setState({ 'event_id': response.data.event_id},()=>{objThis.eventSchoolDetail();});
         } else if (response.data.status == 'user_exist') {
          ToastAndroid.showWithGravity(
            'You are already volunteer of this event',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER  
         );      
      }
      objThis.setState({ modalVisible: false });
    });       
   }

   /* Responsbility list */
    quitResponsibilityAlert(){
        Alert.alert(
          '',
          'Are you sure want to quit from the volunteer ',
          [
            { text: 'Cancel', onPress: () => this.cancelquitResponsibilityAlert() },
            { text: 'OK', onPress: () => this.quitResponsibility() },
          ],
        )    
      }

      /* Cancle reponsibilty */
      cancelquitResponsibilityAlert() {
        this.eventSchoolDetail();
      }


      quitResponsibility(event_id){         
        var objThis = this;
        ParentEventService.quit_Volunter(this.state.app_token,this.state.loggedInUser.member_no, event_id).then(function (response) {
        if (response.data.status == 'Success') {
          objThis.eventSchoolDetail();              
        } else if (response.data.status == 'user_exist') {
          ToastAndroid.showWithGravity(
            'You are  of this event',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          );    
    }
    objThis.setState({ modalVisible: false });   
    });
    }

      render() {
        var objThis = this;     
        return (
             <View>    
                <ScrollView>
                 <View style={styles.dashcontainer} >
                 <View style={styles.eventselect}>
                  <View style={styles.selecttype} >
                    <Text>Select Event Type</Text>
                  </View>
                  {/* Serching by date */}
                  <View style={[styles.selectbottomborder, styles.divide]}>
                    <Picker selectedValue={this.state.eventSource} onValueChange={(itemValue, itemIndex) => this.changeEventSource(itemValue)}>
                      <Picker.Item label="All Event" value="" />
                      <Picker.Item label="Ongoing" value="ongoing" />
                      <Picker.Item label="Upcomming" value="upcomming" />
                      <Picker.Item label="Previous" value="previous" />
                    </Picker>
                  </View>
                </View>
                 <FlatList
                  data={this.state.eventList}
                  renderItem={({ item }) =>
                    <View style={styles.eventliststyle}>
                      <Text style={styles.eventlistcolor} >{item.event_list[0].event_name}</Text>
                      <View style={{ padding: 10, }}>
                      <Text>Description: {item.event_list[0].description}</Text>
                      <Text>Start Date: {item.start_date1}</Text>
                      <Text>End Date: {item.end_date1}</Text>
                    {
                      (item.total_volunteer_count == 0 && item.event_list[0].no_of_volunteer > 0) ?

                      <Text style={styles.signlink} onPress={() => this.showResponsibility(item.event_list[0].id)}> Want to be volunteers</Text>
                      :
                      <Text style={styles.signlink} onPress={() => this.quitResponsibilityAlert(item.event_list[0].id)}> Want to be quit volunteers</Text>
                    }                      
                      </View>
                      <View style={{ flexDirection: 'row' }}>
                      </View>
                     </View>
                  }
                  keyExtractor={(item, index) => index}
                />
                 </View>                 
                 </ScrollView>
                 {/* Start modal */}
                 <Modal transparent={true} visible={this.state.modalVisible} animationType={'slide'} onRequestClose={() => this.closeModal()} >
                  <View style={styles.modelContainer} >             
                   <Text style={styles.eventlistcolor}>Responsibility Lists</Text>
                   <View style={styles.dashcontainer}>
                   <FlatList
                    data={this.state.responsibiltyList}
                    renderItem={({ item }) =>
                      <Text  >{item.responsibilty}</Text>
                   }
                    keyExtractor={(item, index) => index}
                  />                  
                   <View style={styles.dashcontainer}>
                    <View style={{ flexDirection: 'row' }}>                    
                      <TouchableHighlight style={styles.attensavebtn} title="Cancel" onPress={() => this.closeModal()}>
                        <Text style={styles.buttonText}>No</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.attensavebtn} title="Cancel" onPress={() => this.addVolunter(this.state.event_id)}>
                        <Text style={styles.buttonText}>Yes</Text>
                        </TouchableHighlight>
                    </View>                    
                  </View>              
                </View>           
            </View>
          </Modal>
        </View>        
       );
      }    
    }