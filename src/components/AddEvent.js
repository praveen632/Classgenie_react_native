import React, { Component } from 'react';
import { TouchableHighlight, TouchableWithoutFeedback, TextInput, Platform, TouchableOpacity, StyleSheet, Text, View, Button, SectionList, AsyncStorage, FlatList, Image, ScrollView, Alert, ToastAndroid, Picker, Modal } from 'react-native';
import TeacherServices from '../services/teacherServices';
import config from '../assets/json/config.json';
import styles from '../assets/css/mainStyle';
import { Actions } from 'react-native-router-flux';
import Share, { ShareSheet } from 'react-native-share';
import Loader from './Loader';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import HideableView from 'react-native-hideable-view';
import DismissKeyboard from 'dismissKeyboard';
import DatePicker from 'react-native-datepicker';
import TimePicker from 'react-native-simple-time-picker';
import CheckBox from 'react-native-checkbox';
import EditEventServices from '../services/EditEventServices';

export default class AddEvent extends Component {
  constructor() {
    super();
    this.state = {
      loggedInUser: {},
      noofvolunteer: 0,
      selectedstartHours: 0,
      selectedendHours: 0,
      selectedstartMinutes: 0,
      selectedendMinutes: 0,
      modalVisible: false,
      modalVisibleEdit:false,
      resposibiltylist: [],
      event_added: [],
      responsibilityname: '',
      event_name: '',
      event_description: '',
      no_of_valunteer: 2,
      startDate: '',
      endDate: '',
      startTime: '',
      endTime: '',
      responsibilty: '',
      member_no: '',
      sender_ac_no: '',
      school_id: '',
      selectResponseblity: []
    }
    this.submitEvent = this.submitEvent.bind(this);
  }

  async componentWillMount() {
   /* Close keypad */
    DismissKeyboard();
    Actions.refresh();
     /* Get local storage values */
    await AsyncStorage.getItem('app_token').then((value) =>
      this.setState({ "app_token": value })
    );
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    );
  }

   /* Save event in data base */
  submitEvent(event_name, event_description, no_of_valunteer) {
    var objThis = this;
     /* Set responsebility */
    if (objThis.state.selectResponseblity != 0) {
      var res_id = '';
      for (let i = 0; i < (objThis.state.selectResponseblity).length; i++) {
        res_id = objThis.state.selectResponseblity + ',';
      }
      var n = res_id.lastIndexOf(",");
      var a = res_id.substring(0, n);
    } else {
      var a = 0;
    }
  
    var param = {
      endDate: objThis.state.endDate,
      event_description: objThis.state.event_description,
      event_name: objThis.state.event_name,
      no_of_valunteer: objThis.state.no_of_valunteer.toString(),
      startDate: objThis.state.startDate,
      starttime: objThis.state.selectedstartHours + ':' + objThis.state.selectedstartMinutes,
      endtime: objThis.state.selectedendHours + ':' + objThis.state.selectedendMinutes,
      responsibilty: a,
      member_no: objThis.state.loggedInUser.member_no,
      sender_ac_no: objThis.state.loggedInUser.member_no,
      school_id: objThis.state.loggedInUser.school_id.toString(),
      token: this.state.app_token
    }  
     /* Call function in teacher searvices to save event */
    TeacherServices.createEvent(param).then((response) => {
      if (response.data.status == 'Success') {
        Actions.EventManagement();
      }
    })
  }

   /* Get reposnibility */
  loadresponsibility() {
    var objThis = this;
    TeacherServices.loadresponsibility(this.state.loggedInUser.member_no, this.state.app_token).then((response) => {
     if (response.data.status == 'Success') {
        objThis.setState({ 'resposibiltylist': response.data['user_list'] });
      }
    })
  }

  /* Add reponsibilty */
  Addresponsibilty() {
    var objThis = this;
    objThis.setState({ modalVisible: true });
    objThis.loadresponsibility();   
  }


    /* Function for Edit the responsibliteis */
    editResponsiblities(id,responsiblityName){  
      var objThis = this;
      objThis.setState({ modalVisibleEdit: true });
      objThis.setState({ 'resposeId':id });
      objThis.setState({ 'resposename':responsiblityName });    
    }

   /* Close modal for edit reponsibilty */
    closeModalEdit(){
      this.setState({ modalVisibleEdit: false });
    }
  
    /* Update reposnibilty */
    updateResponsiblities(id){      
      var objThis = this;
       var dataParam = {
        token: objThis.state.app_token,
        responsibilty: objThis.state.resposename,
        responsibilty_id:id
      }
       /* Call function to upload responsibilty */    
      EditEventServices.updateResponse(dataParam).then(function (resp) {          
        if (resp.data.status == "Success") {
          objThis.setState({ modalVisibleEdit: false });
          objThis.loadresponsibility();
        }
        else {
          ToastAndroid.showWithGravity(
            'Unable to remove Assignment. Please try again later',
            ToastAndroid.SHORT,
            ToastAndroid.CENTER
          );
        }
      });     
    }
    
 /* Add reponsibilty */
  handleSubmit() {
    var objThis = this;
    objThis.setState({ 'responsibilityname': '' });
    TeacherServices.addresponsibility(this.state.loggedInUser.member_no, this.state.responsibilityname, this.state.app_token).then((response) => {
      if (response.data.status == 'Success') {
        objThis.setState({ 'responsibilityname': '' });
        objThis.loadresponsibility();
      }
    })
    objThis.setState({ modalVisible: true });
  }

 /* Close modal for reponsibilty */
  closeModal() {
    this.setState({ modalVisible: false });   
  }

   /* Choose reponsibilty*/
  chooseResponsiblity(id) {
    if (this.state.selectResponseblity.indexOf(id) !== -1) {
      let ax = this.state.selectResponseblity.indexOf(id);
      this.state.selectResponseblity.splice(ax, 1);
      return false;
    }
    else {
      this.state.selectResponseblity.push(id);
      return true;
    }
  }

  render() {
     /* set no of volunteer */
   var no_of_Volunteers = [
      { label: '0', value: '0' },
      { label: '1', value: '1' },
      { label: '2', value: '2' },
      { label: '3', value: '3' },
      { label: '4', value: '4' },
      { label: '5', value: '5' },
      { label: '6', value: '6' },
      { label: '7', value: '7' },
      { label: '8', value: '8' },
      { label: '9', value: '9' },
    ];
     /* For time picker */
    const { selectedstartHours, selectedstartMinutes, selectedstartSecond, selectedendHours, selectedendMinutes, selectedendSecond } = this.state;
    var objThis = this;
    return (
      <View>
        <ScrollView>
          <View style={styles.logincontainer}>
            <View style={[styles.whitebackgrounnd, styles.padding]} >
              <TextInput style={[styles.styleinput, styles.profileinput]} placeholder="Event Name" onChangeText={(text) => this.setState({ event_name: text })} />
              <TextInput style={[styles.styleinput, styles.profileinput]} placeholder="Event Description" onChangeText={(text) => this.setState({ event_description: text })} />
              <View style={styles.PickerViewBorder}>
              {/* Dropdown for select volunteer */}
               <Picker style={[styles.styleinput, styles.profileinput]} selectedValue={objThis.state.no_of_volunteer} onValueChange={(itemValue, itemIndex) => this.setState({ no_of_volunteer: itemValue })}>
                  {
                    no_of_Volunteers.map(function (item, key) {
                      return (
                        <Picker.Item label={item.label} value={item.value} key={key} />
                      )
                    })
                  }
                </Picker>
                {/* Add reponsibilty */}
                <TouchableWithoutFeedback title="Voluteer" onPress={() => this.Addresponsibilty()}>
                  <View style={styles.classbtn}>
                    <Text style={styles.buttonText}>Responsibility</Text>
                  </View>
                </TouchableWithoutFeedback>
                {/* reponsibilty list modal */}
                <Modal transparent={true} visible={this.state.modalVisibleEdit} animationType={'slide'} onRequestClose={() => this.closeModal()} >
                    <View style={styles.modelContainer} >
                    <ScrollView>
                        <Text style={styles.eventlistcolor}>Update Responsibility</Text>
                      <View style={styles.dashcontainer}> 
                      <View style={{ flex: 2 }}>
                      <TextInput style={[styles.styleinput, styles.profileinput]} placeholder="Upadate Responsibility" value={this.state.resposename} onChangeText={(value) => this.setState({ resposename: value })} />
                      </View>             
                      <View style={{ flex: 1 }}>
                    <TouchableHighlight
                        style={styles.addeventbtn}
                      title="Edit" onPress={() => this.updateResponsiblities(this.state.resposeId)}  >
                      <Text style={styles.buttonText}>update</Text>
                    </TouchableHighlight>
                    </View>
                      <TouchableHighlight
                        style={styles.classbtn}
                      title="Close" onPress={() => this.closeModalEdit()}  >
                      <Text style={styles.buttonText}>Close</Text>
                    </TouchableHighlight>
                      </View>                
                  </ScrollView>
                  </View>
              </Modal>

          {/* Open modal edit reponsibilty */}
          <Modal transparent={true} visible={this.state.modalVisible} animationType={'slide'} onRequestClose={() => this.closeModal()} >
            <View style={styles.modelContainer} >
            <ScrollView>
              <Text style={styles.eventlistcolor}>Add Responsibility</Text>
                 <TextInput style={[styles.styleinput, styles.profileinput]} placeholder="Create New Responsibility" value={this.state.responsibilityname} onChangeText={(value) => this.setState({ responsibilityname: value })} />
                  <TouchableHighlight style={styles.classbtn} title="Create New Responsibility" onPress={() => this.handleSubmit()} >
                      <Text style={styles.buttonText}>Add</Text>
                  </TouchableHighlight>
               <View style={styles.dashcontainer}>
                <FlatList
                data={this.state.resposibiltylist}
                renderItem={({ item }) =>
                <TouchableWithoutFeedback onPress={() => this.closeModal()}>
                <View style={[styles.listviewpage, styles.classstoryparents, styles.paddingBottomevent]} >
                <View style={{ flex: 1 }}>
                  <CheckBox label='' onChange={(checked) => objThis.chooseResponsiblity(item.id)} />
                  </View>
                  <View style={{ flex: 2 }}>
                                    
                  <Text>{item.responsibilty}</Text>
                  </View>
              <View style={{ flex: 1 }}>
              <TouchableHighlight
                  style={styles.addeventbtn}
                title="Edit" onPress={() => this.editResponsiblities(item.id,item.responsibilty)}  >
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableHighlight>
            </View>
            </View>
            </TouchableWithoutFeedback>
            }
            keyExtractor={(item, index) => index}
              />
            <TouchableHighlight
                  style={styles.classbtn}
                  title="Close" onPress={() => this.closeModal()}  >
                <Text style={styles.buttonText}>Close</Text>
            </TouchableHighlight>
            </View>
            </ScrollView>
            </View>
      </Modal>
      </View>

      {/* Open date picker */}
              <DatePicker
                style={styles.datepickerbox}
                date={this.state.startDate}
                mode="date"
                placeholder="select start date"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 0
                  }

                }}
                onDateChange={(date) => { this.setState({ startDate: date }) }}
              />

              <DatePicker
                style={styles.datepickerbox}
                date={this.state.endDate}
                mode="date"
                placeholder="select End date"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                customStyles={{
                  dateIcon: {
                    position: 'absolute',
                    left: 0,
                    top: 4,
                    marginLeft: 0
                  },
                  dateInput: {
                    marginLeft: 0
                  }

                }}
                onDateChange={(date) => { this.setState({ endDate: date }) }}
              />
            </View>
          </View>

          {/* Open time picker */}
          <View style={styles.addeventstyle}>
            <View style={[styles.whitebackgrounnd, styles.padding]} >
            <Text>{this.state.selectedstartHours}:{this.state.selectedstartMinutes}:{this.state.selectedstartSecond}</Text>
            <TimePicker
              selectedHours={selectedstartHours}
              selectedMinutes={selectedstartMinutes}
              selectedSecond={selectedstartSecond}
              onChange={(hours, minutes, second) => this.setState({ selectedstartHours: hours, selectedstartMinutes: minutes, selectedstartSecond: second })}
            />
            <Text>{this.state.selectedendHours}:{this.state.selectedendHours}:{this.state.selectedendSecond}</Text>

            <TimePicker
              selectedHours={selectedendHours}
              selectedMinutes={selectedendMinutes}
              selectedendSecond={selectedendSecond}
              onChange={(hours, minutes, second) => this.setState({ selectedendHours: hours, selectedendMinutes: minutes, selectedendSecond: second })}
            />

              <TouchableWithoutFeedback title="Submit Event" onPress={() => this.submitEvent(objThis.state.event_name, objThis.state.event_description, objThis.state.no_of_valunteer)}>
                <View style={styles.classbtn}>
                  <Text style={styles.buttonText}>Submit Event</Text>
                </View>
              </TouchableWithoutFeedback>

            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

}