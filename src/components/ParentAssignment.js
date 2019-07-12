import React, { Component } from 'react';
import { TextInput, TouchableHighlight, TouchableWithoutFeedback, Clipboard,DrawerLayoutAndroid, Platform, TouchableOpacity, StyleSheet, Text, View, Button, SectionList, AsyncStorage, FlatList, Image, ScrollView, Alert, ToastAndroid, Picker, Modal } from 'react-native';
import { Actions } from 'react-native-router-flux';
import AssignmentServices from '../services/AssignmentServices';
import styles from '../assets/css/mainStyle';
import Loader from './Loader';
import config from '../assets/json/config.json';
import DismissKeyboard from 'dismissKeyboard';
import Pdf from 'react-native-pdf';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import HideableView from 'react-native-hideable-view';
import DatePicker from 'react-native-datepicker';
import PdfReader from './PdfReader';
import Drawer from 'react-native-drawer-menu';
import ParentReportServices from '../services/ParentReportServices';

export default class ParentAssignment extends Component {
  constructor() {
    super();
     this.state = {
         details:'', 
         loggedInUser: {},
         showLoader: 0,
         assignmentList: [],
         title: '',
         fromDate: null,
         toDate: null,
         page_number: 1,
         modalVisible: false,
         total_submit_count: 0,
         classid: 0,
         classname: '',
         pdf:'',
         modalVisible:false,
         page: 1,
         scale: 1,
         numberOfPages: 0,
         horizontal: false,
         attachmentPdf:'',
         classListMenu:''       
        };     
    }
   
  async componentWillMount() {
    /* Close keypad */
    DismissKeyboard();
    /* Get local storage values */
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    )
    await AsyncStorage.getItem('app_token').then((value)=> 
      this.setState({"app_token": value})
    );
    /* Get prop values */
    var params = {
      details : this.props.allDetails
    }
    this.setState({'details':params}, ()=>{this.getAssignmentList()})
    
  }	

  /* Left side header back button */
  _renderLeftHeader() {
    return (
      <View style={styles.Leftheaderstyle}>
        <TouchableOpacity onPress={() => Actions.pop()}>
          <FontAwesome style={styles.headerfont}>{Icons.times}</FontAwesome>
        </TouchableOpacity>
      </View>
    )
  }

  /* Middle cantent in header */
 _renderMiddleHeader() {   
    return (
      <View style={styles.Middleheaderstyle}>
        <Text style={styles.MiddleHeaderTitlestyle}>{this.props.allDetails.class_name}</Text>
      </View>
    )
  }

  /* Drower in right side header */
  _renderRightHeader() {
    return (
      <View style={styles.Rightheaderstyle}>
        <TouchableWithoutFeedback onPress={() => this.openDrawer()}>
          <View><FontAwesome style={styles.RightheaderIconStyle}>{Icons.bars}</FontAwesome></View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  /* Get assignment list */
  getAssignmentList() {
    var objThis = this;
    this.setState({ "showLoader": 0 });
    if (this.state.fromDate && this.state.toDate) {     
      var fromDate = this.state.fromDate;
      var toDate = this.state.toDate;
      /*Formate the date according to API need */
      // var d = new Date(this.state.fromDate);
      // var month = d.getMonth() + 1;
      // var day = d.getDate();
      // var year = d.getFullYear();
      // var fromDate = year + '-' + month + '-' + day;


      // var d = new Date(this.state.toDate);
      // var month = d.getMonth() + 1;
      // var day = d.getDate();
      // var year = d.getFullYear();
      // var toDate = year + '-' + month + '-' + day;
    }
    else {
      var fromDate = '';
      var toDate = '';
    }
    /* Call function in assignment services to get parent assignment list  */
    AssignmentServices.getparentAssignmentList(this.state.details.details.class_id,this.state.details.details.student_no, fromDate, toDate, this.state.page_number, this.state.app_token).then(function (response) {
      
      if (response.data['status'] == "Success") {
        objThis.setState({ 'assignmentList': response.data['assignment_list'], 'total_submit_count': (response.data['assignment_list']).length });
      }
    });
  }

  /* Searching on date rang */
  onSubmitSearch() {   
    if ((!this.state.fromDate) || (!this.state.toDate)) {
      Alert.alert(
        '',
        'Please select both start date and end date',
        [
          { text: 'OK', style: 'cancel' },
        ],
      );
      return false;
    }
    if ((new Date(this.state.fromDate)).getTime() > (new Date(this.state.toDate)).getTime()) {
      Alert.alert(
        '',
        'End date should be greater than start date',
        [
          { text: 'OK', style: 'cancel' },
        ],
      );
      return false;
    }
    /* Get assignment list */
    this.getAssignmentList()
  }

  /* Searching by text */
  SearchFilterFunction(text) {    
    var objThis =this;
    let search_text = text.toLowerCase();
    let trucks = this.state.assignmentList;
    let trucks_length = this.state.assignmentList.length;
    var filteredName  = {};
    if (trucks_length > 0)
    {
      filteredName = trucks.filter((item) => {
        return item.title.toLowerCase().match(search_text)
      }) 
    } else 
    {
      filteredName = {};
    }
    if (!text || text === '') {
      this.getAssignmentList()
    } else {
      this.setState({ assignmentList: filteredName });
    }   
 }

 /* Open pdf in modal */
 openPdf(attachemet){
  this.setState({ 'attachmentPdf': attachemet });
  this.setState({ 'modalVisible': true });
 }

 /* Close pdf modal */
 closeModal() {
  this.setState({ 'modalVisible': false });
 }

 /* Open drower */
 openDrawer() {
  var obj = this;
  let dataParam = {
    parent_ac_no: obj.state.loggedInUser.member_no,
    name: obj.state.details.details.name,
  }
  ParentReportServices.getClassList(dataParam).then(function (response) {
    if (response.data['status'] == "Success") {
      obj.setState({ classListMenu: response.data.class_list });
      obj.drawer.openDrawer();
    }
  });
}

/* Class assignment list */
classAssigByList(student_no,classid){
  var allDetails = {
    'student_no':student_no,
    'class_id':classid 
  }  
  var params = {
    details : this.props.allDetails
  }
  this.setState({'details':params}, ()=>{this.getAssignmentList()});
  this.drawer.closeDrawer();
}

/* Pagination on click of more button */
moreAssignment(){
  var obj = this;
  var page = obj.state.page_number + 1;     
  obj.setState({ "page_number": page,  'callByLoadMore': 1 }, () => {obj.getAssignmentList()});
}
	
render() { 
  var navigationView = (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      <Text style={styles.eventlistcolor}> Student's Class</Text>
      <FlatList
        data={this.state.classListMenu}
        renderItem={({ item }) =>
          // <Text onPress={() => this.classReportByList(item.student_no, item.class_id)}> {item.class_list.class_name}</Text>
          <TouchableOpacity style={styles.listviewclass} onPress={() => this.classAssigByList(item.student_no, item.class_id)}>
            <View style={{ flexWrap: 'wrap' }}>
              <Text style={styles.listclassmargin}> {item.class_list.class_name}</Text>
            </View>
          </TouchableOpacity>
        }
        keyExtractor={(item, index) => index}
      />
    </View>
  );
  return (
    <DrawerLayoutAndroid
    drawerWidth={300}
    ref={(_drawer) => this.drawer = _drawer}
    drawerPosition={DrawerLayoutAndroid.positions.Right}
    renderNavigationView={() => navigationView}
  >
    <View>
    {/* Show the loader when data is loading else show the page */}
    {
      this.state.showLoader == 1 ?
        <View style={styles.loaderContainer}>
          <Loader />
        </View>
        :
        <ScrollView>
      {/*HEADER PART*/}
      <View style={[styles.customHeaderContainer]}>
        {this._renderLeftHeader()}  
        {this._renderMiddleHeader()}    
        {this._renderRightHeader()}
      </View>
      {/*START PAGE CONTAINER */}
      <View style={styles.dashcontainer} >
        <View>
          <View style={[styles.whitebackgrounnd, styles.padding]} >
            <View>                
                <TextInput
                  style={styles.TextInputStyleClass}
                  onChangeText={(text) => this.SearchFilterFunction(text)}
                  underlineColorAndroid='transparent'
                  placeholder="Search Here"
                />
            </View>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ flex: 1 }}>
                <DatePicker
                  style={styles.datepickerbox}
                  date={this.state.fromDate}
                  mode="date"
                  placeholder="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 10,
                      marginLeft: 0,
                      paddingRight: 10,
                      width: 20,
                      height: 20
                    },
                    dateInput: {
                      marginLeft: 0
                    }
                  }}
                  onDateChange={(date) => { this.setState({ fromDate: date }) }}
                />
              </View>
              <View style={{ flex: 1 }}>
                <DatePicker
                  style={styles.datepickerbox}
                  date={this.state.toDate}
                  mode="date"
                  placeholder="YYYY-MM-DD"
                  format="YYYY-MM-DD"
                  confirmBtnText="Confirm"
                  cancelBtnText="Cancel"
                  customStyles={{
                    dateIcon: {
                      position: 'absolute',
                      left: 0,
                      top: 10,
                      marginLeft: 0,
                      paddingRight: 10,
                      width: 20,
                      height: 20
                    },
                    dateInput: {
                      marginLeft: 0,
                    }
                  }}
                  onDateChange={(date) => { this.setState({ toDate: date }) }}
                />
              </View>
            </View>
            <View style={styles.saveattenbtn}>
              <TouchableOpacity title="Search" onPress={() => this.onSubmitSearch()}>
                <Text style={styles.attenbtntext}>Search</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {/* Start Assignment listing*/}
        <HideableView visible={this.state.assignmentList.length < 1} removeWhenHidden={true}>
          <Text>There is no assignment available</Text>
        </HideableView>
        <FlatList
          data={this.state.assignmentList}
          renderItem={({ item }) =>
            <View style={styles.eventliststyle}>
              <View style={styles.assignmentTitleRow}>
                <Text style={styles.White}>{item.title}</Text>               
              </View>
              <View style={{ padding: 10, }}>
                <Text>{item.description}</Text>
                <HideableView visible={item.attachment} removeWhenHidden={true}>
                <TouchableHighlight onPress={() => this.openPdf(item.attachment)} >
                   <Text style={styles.invitelink}>Attachment: {item.attachment}</Text>
                </TouchableHighlight>
                </HideableView>
                <HideableView visible={item.grade_title.grade != ''} removeWhenHidden={true}>            
                   <Text style={styles.invitelink}>Marks: {item.grade_title.grade}</Text>                
                </HideableView>
                <Text>Date: {item.created_at}</Text>
                <Text>Submition Date: {item.submition_date}</Text>
                <View>
                  {
                    item.grade_title.status == 0 ?
                    <Text>Status: Pending</Text>
                    :
                    <Text>Status: Submitted</Text>
                  }
                </View>
              </View>
            </View>
          }
          keyExtractor={(item, index) => index}
        />

        {/* End Assignment listing*/}     
        <HideableView style={styles.saveattenbtn} visible={this.state.total_submit_count > '9'} removeWhenHidden={true}> 
          <TouchableOpacity title="Load More" onPress={() => this.moreAssignment()}>
            <Text style={styles.attenbtntext}>Load More</Text>
          </TouchableOpacity>
        </HideableView>       
      </View>
      {/* Open modal */}
      <Modal
        visible={this.state.modalVisible}
        animationType={'slide'}
        onRequestClose={() => this.closeModal()}
        transparent={false}
        presentationStyle='formSheet'
      >
        <PdfReader source={config.image_url + 'assets/assignment/' + this.state.attachmentPdf}/>
        <View>
        <TouchableHighlight style={styles.assignmentlistbtn} title="Cancel" onPress={() => this.closeModal()}>
          <Text style={[styles.textcolor, styles.textcenter]}>Cancel</Text>
        </TouchableHighlight>
        </View>
      </Modal> 
    </ScrollView>
    }
    </View> 
    </DrawerLayoutAndroid>
  )};
}