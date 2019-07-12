import React, { Component, findNodeHandle } from 'react';
import { TouchableWithoutFeedback, Platform, TouchableOpacity, StyleSheet, Text, DrawerLayoutAndroid, View, Picker, Button, SectionList, AsyncStorage, FlatList, Image, ScrollView, Alert, ToastAndroid, Modal, TextInput, TouchableHighlight } from 'react-native';
import Menu from 'react-native-pop-menu';
import { PieChart } from 'react-native-mp-android-chart';
import { Actions } from 'react-native-router-flux';
import styles from '../assets/css/mainStyle';
import ParentReportServices from '../services/ParentReportServices';
import config from '../assets/json/config.json';
import HideableView from 'react-native-hideable-view';
import DatePicker from 'react-native-datepicker'
import PerformanceGraphCom from './PerformanceGraphCom';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Moment from 'moment';
import Drawer from 'react-native-drawer-menu';
import Loader from './Loader';
import DismissKeyboard from 'dismissKeyboard';
export default class ParentReport extends Component {
  constructor() {
    super();
    this.state = {
      dateTitle: 'This Month',
      showLoader: 0,
      loggedInUser: {},
      subTitle: '',
      classid: '',
      classname: '',
      student_name: '',
      student_no: '',
      reportList: [],
      menuVisible: false,
      nocontent: false,
      graph: 0,
      modalVisible: false,
      startDate: null,
      endDate: null,
      arrowPosition: 'topRight',
      left: 12,
      right: undefined,
      datetk: {},
      datelabel: {},
      dataMenu: [],
      byClass: false,
      currentTab: false,
      attenDate: '',
      attendenceList: [],
      attendenceShowe: 0,
      classListMenu: '',
      color: '#F5FCFF',
      positive_skill: 50,
      needwork_skill: 50,
      legend: {
        enabled: true,
        textSize: 50,
        form: 'CIRCLE',
        position: 'RIGHT_OF_CHART',
        fontFamily: 'monospace',
        wordWrapEnabled: true
      },
      data: {
        datasets: [{
          yValues: [5, 95],
          label: '',
          config: {
            colors: ['#C0FF8C', '#FFF78C'],
            sliceSpace: 0,
            selectionShift: 20,
            textSize: 50,
            fontFamily: 'monospace',
          },
          textSize: 50,
        }],
        xValues: ['Positive', 'Need Work']
      },
      description: {
        text: '',
        textSize: 50,
        textColor: 'darkgray',
        fontFamily: 'monospace',
        fontStyle: 2
      }
    }
    this.DateRange = this.DateRange.bind(this);
  }

  async componentWillMount() {
    /* Close keypad */
    DismissKeyboard();
    /* Get local storage values */
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    )
    await AsyncStorage.getItem('classid').then((value) =>
      this.setState({ "classid": value })
    )
    await AsyncStorage.getItem('classname').then((value) =>
      this.setState({ "classname": value })
    )
    await AsyncStorage.getItem('app_token').then((value) =>
      this.setState({ "app_token": value })
    );

    /*Set default date*/
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var year = d.getFullYear();
    var startDate = month + '/' + day + '/' + year;
    /* Get props values */
    var param = {
      student_name: this.props.student_name,
      student_no: this.props.student_no,
      subTitle: 'This Month',
      startDate: startDate,
      todayDate: startDate,
      endDate: startDate,
      attendenceShowe: 0,
      valueOfbyClass: false,
      datetk: 'thismonth',
      datelabel: 'this Month'

    }
    this.setState(param, () => { this.getPerformReport({ datetoken: this.state.datetk, label: this.state.datelabel }) });
    /* Set title */
    Actions.refresh({ title: this.state.student_name, subTitle: 'This Month' });   
  }

  /* Open modal */
  openModel() {
    this.setState({ modalVisible: true });
  }

  /* Close modal */
  closeModal() {
    this.setState({ modalVisible: false });
  }

  /* Get performance report */
  getPerformReport(data) {
    /*
    if we come from whole class then get whole class report
    else get student report.    
    if there is student_no it means we came student report
    */
    /* reset the graph data */

    if (data.datetoken != 'daterange') {
      this.setState({ "subTitle": data.label });
    } else {
      if ((new Date(this.state.startDate)).getTime() > (new Date(this.state.endDate)).getTime()) {
        Alert.alert(
          '',
          'End date should be greater than start date',
          [
            { text: 'OK', style: 'cancel' },
          ],
        );
        return false;
      }
      if ((new Date(this.state.todayDate)).getTime() < (new Date(this.state.endDate)).getTime()) {
        Alert.alert(
          '',
          'End date should not be greater than today date',
          [
            { text: 'OK', style: 'cancel' },
          ],
        );
        return false;
      }
      var startDate = this.state.startDate;
      var endDate = this.state.endDate;
      this.setState({ "subTitle": 'From ' + startDate + ' To ' + endDate });
      this.closeModal();
    }
    if (this.state.byClass == false) {
      /* Get student performance report */
      this.getStudentPerformReport(data);
    } else if (this.state.byClass == true) {
      /* Get class performance report */
      this.getClassPerformReport(data);
    }
    if (this.state.currentTab == true) {
      /* Get attendance */
      this.getAttendence(data);
    }
  }

  getStudentPerformReport(data) {
    if (data.datetoken == 'daterange') {
      /*Formate the date according to API need */
      var d = new Date(this.state.startDate);
      var month = d.getMonth() + 1;
      var day = d.getDate();
      var year = d.getFullYear();
      var startDate = year + '/' + month + '/' + day;

      var d = new Date(this.state.endDate);
      var month = d.getMonth() + 1;
      var day = d.getDate();
      var year = d.getFullYear();
      var endDate = year + '/' + month + '/' + day;
    }
    else {
      var startDate = '';
      var endDate = '';
    }
    let dataParam = {
      parent_ac_no: this.state.loggedInUser.member_no,
      student_info_no: this.state.student_no,
      name: this.state.student_name,
      datetoken: data.datetoken,
      startdate: startDate,
      enddate: endDate
    }
    var objThis = this;
    this.setState({ reportList: [] });
    objThis.setState({ "showLoader": 0 });
    ParentReportServices.getStudentPerformReport(dataParam, this.state.app_token).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      if (response.data['status'] == "Success") {
        objThis.setState({ 'reportList': response.data['point'], nocontent: false, graph: 1 }, () => { objThis.setupDataForChart(); });
      } else {
        objThis.setState({ nocontent: true, graph: 0 });
      }
    });
  }

  /* Get class report */
  getClassPerformReport(data) {
    if (data.datetoken == 'daterange') {
      /*Formate the date according to API need */
      var d = new Date(this.state.startDate);
      var month = d.getMonth() + 1;
      var day = d.getDate();
      var year = d.getFullYear();
      var startDate = year + '/' + month + '/' + day;

      var d = new Date(this.state.endDate);
      var month = d.getMonth() + 1;
      var day = d.getDate();
      var year = d.getFullYear();
      var endDate = year + '/' + month + '/' + day;
    }
    else {
      var startDate = '';
      var endDate = '';
    }
    let dataParam = {
      class_id: this.state.class_id,
      student_info_no: this.state.student_no,
      parent_ac_no: this.state.loggedInUser.member_no,
      name: this.state.student_name,
      datetoken: data.datetoken,
      startdate: startDate,
      enddate: endDate
    }
    var objThis = this;
    this.setState({ reportList: [] });
    objThis.setState({ "showLoader": 0 });
    ParentReportServices.getClassPerformReport(dataParam, this.state.app_token).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      if (response.data['status'] == "Success") {
        objThis.setState({ 'reportList': response.data['point'] });
        objThis.setupDataForChart();
      }
      else {
        objThis.setState({ nocontent: true, graph: 0 });
      }
    });
  }

  setupDataForChart() {
    /*run the loop to build data for chart*/
    var pos_total = 0;
    var need_total = 0;
    for (let i = 0; i < (this.state.reportList).length; i++) {

      if (this.state.reportList[i].customize_detail.pointweight > 0) {
        pos_total += this.state.reportList[i].point;
      }
      else if (this.state.reportList[i].customize_detail.pointweight < 0) {
        need_total += (this.state.reportList[i].point * (-1));
      }
    }
    pos_total = Math.abs(pos_total);
    need_total = Math.abs(need_total);

    var positive_skill = Math.round((pos_total / (pos_total + need_total)) * 100);

    var needwork_skill = Math.round((need_total / (pos_total + need_total)) * 100);

    this.setState({ positive_skill: positive_skill, needwork_skill: needwork_skill });
    this.forceUpdate();
    this.setState({ nocontent: true, graph: 0 });
    this.setState({ nocontent: false, graph: 1 });

  }

  /* Set date range */
  DateRange() {
    var obj = this;
    obj.setState({
      menuVisible: true,
      left: undefined,
      right: 12,
    });
    var dataVal = [{
      title: 'Today',
      onPress: () => {      
        obj.setState(
          {
            datetk: 'today',
            datelabel: 'Today',
            dateTitle: 'Today'
          }, () => { obj.getPerform() }
        );
      },

    },

    {
      title: 'This Week',
      onPress: () => {
        obj.setState(
          {
            datetk: 'thisweek',
            datelabel: 'This Week',
            dateTitle: 'This Week'

          }, () => { obj.getPerform() }
        );
      }
    },

    {
      title: 'This Month',
      onPress: () => {
        obj.setState(
          {
            datetk: 'thismonth',
            datelabel: 'This Month',
            dateTitle: 'This Month'
          }, () => { obj.getPerform() }
        );
      }

    },

    {
      title: 'Date Range',
      onPress: () => {
        obj.setState(
          {
            dateTitle: 'Date Range'
          }, () => { obj.openModel() }
        );
      }
    }];
    obj.setState({ dataMenu: dataVal })
  }

  /* Get performance report */
  getPerform() {
    this.getPerformReport({ datetoken: this.state.datetk, label: this.state.datelabel })
  }

/* Class report */
  classReportByList(student_no, class_id) {
    var obj = this;
    obj.setState(
      {
        byClass: true,
        student_no: student_no,
        class_id: class_id
      }, () => { obj.getPerformReport({ datetoken: this.state.datetk, label: this.state.datelabel }) }
    );
    obj.drawer.closeDrawer();
  }

  /* Left side header for back button */
  _renderLeftHeader() {
    return (
      <View style={styles.Leftheaderstyle}>
        <TouchableWithoutFeedback onPress={() => Actions.pop()}>
          <View><FontAwesome style={styles.LeftheaderIconStyle}>{Icons.times}</FontAwesome></View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  /* Midle header for content */
  _renderMiddleHeader() {
    return (
      <View style={styles.Middleheaderstyle}>
        <Text style={styles.MiddleHeaderTitlestyle}>{this.props.title}</Text>
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

  /* Call function on click attendance tab */
  Attendence() {
    var obj = this;
    obj.setState(
      {
        currentTab: true,
        attendenceShowe: 1,
      }, () => { obj.getPerformReport({ datetoken: this.state.datetk, label: this.state.datelabel }) }
    );
  }

  /* Get attendance */
  getAttendence(data) {
    if (data.datetoken == 'daterange') {
      /*Formate the date according to API need */
      var d = new Date(this.state.startDate);
      var month = d.getMonth() + 1;
      var day = d.getDate();
      var year = d.getFullYear();
      var startDate = year + '/' + month + '/' + day;

      var d = new Date(this.state.endDate);
      var month = d.getMonth() + 1;
      var day = d.getDate();
      var year = d.getFullYear();
      var endDate = year + '/' + month + '/' + day;
      if ((new Date(this.state.startDate)).getTime() > (new Date(this.state.endDate)).getTime()) {
        Alert.alert(
          '',
          'End date should be greater than start date',
          [
            { text: 'OK', style: 'cancel' },
          ],
        );
        return false;
      }
      if ((new Date(this.state.todayDate)).getTime() < (new Date(this.state.endDate)).getTime()) {
        Alert.alert(
          '',
          'End date should not be greater than today date',
          [
            { text: 'OK', style: 'cancel' },
          ],
        );
        return false;
      }
    } else {
      var d = new Date(this.state.startDate);
      var month = d.getMonth() + 1;
      var day = d.getDate();
      var year = d.getFullYear();
      var startDate = year + '/' + month + '/' + day;

      var d = new Date(this.state.endDate);
      var month = d.getMonth() + 1;
      var day = d.getDate();
      var year = d.getFullYear();
      var endDate = year + '/' + month + '/' + day;
    }
    let dataParam = {
      student_no: this.state.student_no,
      startDate: startDate,
      endDate: endDate
    }
    var objThis = this;
    objThis.setState({ reportList: [] });
    ParentReportServices.getStudentAttendance(dataParam).then(function (response) {
      if (response.data['status'] == "Success") {
        var attendanceList = response.data.attandence_list;
        var diffInDays = Math.floor((Date.parse(endDate) - Date.parse(startDate)) / 86400000);
        var attenDates = startDate;
        objThis.setState({ attenDate: attenDates })
        var formatedAttendList = [];
        for (var i = 0; i <= diffInDays; i++) {
          var formatedDate = Moment(objThis.state.attenDate).format('DD/MM/YYYY');
          var label = 'No Attendance';
          var attendImage = 'attendance_na.png';
          var attendance = 'NA';
          var colorTxt = '';
          for (var k = 0; k < (attendanceList).length; k++) {
            var formatedAttenDate = attendanceList[k].date;
            //const maxDate = Moment(formatedAttenDate).format('DD/MM/YYYY');        
            const maxDate = formatedAttenDate;
            /* Set attendance to display */
            if (formatedDate == formatedAttenDate) {
              if (attendanceList[k].attendance == 'H') {
                var label = 'Holiday';
                var attendImage = 'attendance_h.png';
                var colorTxt = '#1A1815';
              }
              else if (attendanceList[k].attendance == 'P') {
                var label = 'Present';
                var attendImage = 'attendance_p.png';
                var colorTxt = '#10570A';
              }
              else if (attendanceList[k].attendance == 'A') {
                var label = 'Absent';
                var attendImage = 'attendance_a.png';
                var colorTxt = '#FF0303';
              }
              else if (attendanceList[k].attendance == 'L') {
                var label = 'Late';
                var attendImage = 'attendance_l.png';
                var colorTxt = '#FF9D00';
              }
              attendance = attendanceList[k].attendance;
            }
          }
          var d = new Date(objThis.state.attenDate);
          formatedDate = Moment(d).format('MM/DD/YYYY');
          formatedAttendList.push({ 'date': formatedDate, 'label': label, 'attendance': attendance, 'image': attendImage, 'colorTxt': colorTxt });
          //var dataDate = objThis.state.attenDate;
          //var datas = d.getDate() + 1;
          var datas = Moment(d).add(1, 'days');
          objThis.setState({ attenDate: datas })
        }
        objThis.setState({ 'attendenceList': formatedAttendList });
      }
    });
  }

  /* Get report to click report tab */
  Report() {
    var obj = this;
    obj.setState(
      {
        currentTab: false,
        attendenceShowe: 0,
      }, () => { obj.getPerformReport({ datetoken: this.state.datetk, label: this.state.datelabel }) }
    );
  }

  /* Open drower */
  openDrawer() {
    var obj = this;
    let dataParam = {
      parent_ac_no: obj.state.loggedInUser.member_no,
      name: obj.state.student_name,
    }
    ParentReportServices.getClassList(dataParam).then(function (response) {
      if (response.data['status'] == "Success") {

        obj.setState({ classListMenu: response.data.class_list });
        obj.drawer.openDrawer();
      }
    });
  }

  render() {
    /* Set class list */
    var navigationView = (
      <View style={{ flex: 1, backgroundColor: '#fff' }}>
        <Text style={styles.eventlistcolor}> Student's Class</Text>
        <FlatList
          data={this.state.classListMenu}
          renderItem={({ item }) =>
            // <Text onPress={() => this.classReportByList(item.student_no, item.class_id)}> {item.class_list.class_name}</Text>
            <TouchableOpacity style={styles.listviewclass} onPress={() => this.classReportByList(item.student_no, item.class_id)}>
              <View style={{ flexWrap: 'wrap' }}>
                <Text style={styles.listclassmargin}> {item.class_list.class_name}</Text>
              </View>
            </TouchableOpacity>
          }
          keyExtractor={(item, index) => index}
        />
      </View>
    );
    var imagePath = config.image_url;
    var server_path = config.server_path;
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
                <View style={[styles.customHeaderContainer]}>
                  {this._renderLeftHeader()}
                  {this._renderMiddleHeader()}
                  {this._renderRightHeader()}
                </View>
                <View style={styles.dashcontainer}>

                  {/* Attendence View END */}

                  {/* START || IF THERE IS NO DATA THEN DISPLAY IT */}

                  <View>
                    {
                      this.state.attendenceShowe == 0 ?
                        <View>

                          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ flex: 1, width: '50%' }} >
                              <View style={styles.classbtn}>
                                <TouchableWithoutFeedback title="Performance">
                                  <View>
                                    <Text style={styles.buttonText}>
                                      Performance
                            </Text>
                                  </View>
                                </TouchableWithoutFeedback>
                              </View>
                            </View>
                            <View style={{ flex: 1, width: '50%' }} >
                              <View style={styles.groupbtn}>
                                <TouchableWithoutFeedback onPress={() => this.Attendence()} title=" Attendance">
                                  <View>
                                    <Text style={styles.bcolor}>
                                      Attendance
                            </Text>
                                  </View>
                                </TouchableWithoutFeedback>
                              </View>
                            </View>
                          </View>

                          <TouchableHighlight onPress={this.DateRange} style={[styles.classbtn, styles.marb]} title="This Month">
                            <View>
                              <Text style={styles.buttonText}>
                                {this.state.dateTitle}
                              </Text>
                            </View>
                          </TouchableHighlight>
                          <HideableView visible={this.state.nocontent} removeWhenHidden={true}>
                            <View style={styles.graphmid}>
                              <Image style={{ flexWrap: 'wrap', width: 150, height: 150 }} source={{ uri: server_path + 'assets/images/graph.png' }} />
                              <Text>No points for current date selected</Text>
                            </View>
                          </HideableView>

                          {/* END || IF THERE IS NO DATA THEN DISPLAY IT */}

                          {/* START || IF THERE IS DATA THEN DISPLAY THE GRAPH */}
                          <HideableView visible={!this.state.nocontent} removeWhenHidden={true}>
                            <PerformanceGraphCom positive={this.state.positive_skill} negative={this.state.needwork_skill} />
                          </HideableView>

                          {/* END || IF THERE IS DATA THEN THEN DISPLAY THE GRAPH */}


                          <FlatList
                            data={this.state.reportList}
                            renderItem={({ item }) =>
                              <View style={[styles.listviewclass, styles.padding]}>
                                <Image style={{ flexWrap: 'wrap', width: 32, height: 32 }} source={{ uri: imagePath + 'assets/skill/' + item.customize_detail.image }} />
                                <View>
                                  {item.point > 0 ?
                                    <View style={{ flexWrap: 'wrap' }}>
                                      <Text style={styles.listclassmargin}>+{item.point} for {item.customize_detail.name}</Text>
                                      <Text style={styles.listclassmargin}>By {item.class_name.teacher_name}</Text>
                                    </View>
                                    :
                                    <View style={{ flexWrap: 'wrap' }}>
                                      <Text style={styles.listclassmargin}>{item.point} for {item.customize_detail.name}</Text>
                                      <Text style={styles.listclassmargin}>By {item.class_name.teacher_name}</Text>
                                    </View>
                                  }
                                </View>
                              </View>
                            }
                            keyExtractor={(item, index) => index}

                          />
                        </View>
                        :
                        <View>
                          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                            <View style={{ flex: 1, width: '50%' }} >
                              <View style={styles.groupbtn}>
                                <TouchableWithoutFeedback onPress={() => this.Report()} title="Performance">
                                  <View>
                                    <Text style={styles.bcolor}>
                                      Performance
                            </Text>
                                  </View>
                                </TouchableWithoutFeedback>
                              </View>
                            </View>
                            <View style={{ flex: 1, width: '50%' }} >
                              <View style={styles.classbtn}>
                                <TouchableWithoutFeedback title=" Attendance">
                                  <View>
                                    <Text style={styles.buttonText} >
                                      Attendance
                            </Text>
                                  </View>
                                </TouchableWithoutFeedback>
                              </View>
                            </View>
                          </View>

                          <TouchableHighlight onPress={() => this.openModel()} style={[styles.classbtn, styles.marb]} title=" Date Range">
                            <View>
                              <Text style={styles.buttonText}>
                                Date Range
                        </Text>
                            </View>
                          </TouchableHighlight>

                          <View style={{ backgroundColor: '#fff', marginTop: 20 }}>
                            <FlatList
                              data={this.state.attendenceList}
                              renderItem={({ item }) =>
                                <View style={styles.attenclass}>
                                  <View style={{ flexWrap: 'wrap' }}>
                                    <Text style={styles.listviewmargin}>{item.date}</Text>
                                  </View>
                                  <View style={{ flexWrap: 'wrap' }}>
                                    <Text style={styles.listviewmargin}>{item.label}</Text>
                                  </View>
                                  <View style={{ flexWrap: 'wrap', flex: 1 }}>
                                    <Image
                                      source={{ uri: server_path + 'assets/images/' + item.image }}
                                      style={{ flexWrap: 'wrap', width: 32, height: 32, alignSelf: 'flex-end' }}
                                    />
                                  </View>
                                </View>
                              }
                              keyExtractor={(item, index) => index}
                            />
                          </View>
                        </View>
                    }
                  </View>
                </View>
                {/* Start menu */}
                <Menu visible={this.state.menuVisible}
                  onVisible={(isVisible) => {
                    this.state.menuVisible = isVisible
                  }}
                  left={this.state.left}
                  right={this.state.right}
                  arrowPosition={this.state.arrowPosition}

                  data={this.state.dataMenu}
                  contentStyle={{ backgroundColor: 'teal' }} />

                {/* Start modal */}
                <Modal visible={this.state.modalVisible} animationType={'slide'} onRequestClose={() => this.closeModal()} transparent={true}>
                  <View style={styles.modelContainer} >
                    <ScrollView>
                      <View style={[styles.customHeaderContainer]}>
                        <View style={styles.Leftheaderstyle}>
                          <TouchableWithoutFeedback onPress={() => this.closeModal()}>
                            <View><FontAwesome style={styles.LeftheaderIconStyle}>{Icons.times}</FontAwesome></View>
                          </TouchableWithoutFeedback>
                        </View>
                        <View style={styles.Middleheaderstyle}>
                          <Text style={styles.MiddleHeaderTitlestyle}>Select Date Range</Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', flex: 1 }}>
                        <View style={{ flex: 1 }}>
                          <DatePicker
                            style={styles.datepickerbox}
                            date={this.state.startDate}
                            mode="date"
                            placeholder="select start date"
                            format="MM/DD/YYYY"
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
                        </View>
                        <View style={{ flex: 1 }}>
                          <DatePicker
                            style={styles.datepickerbox}
                            date={this.state.endDate}
                            mode="date"
                            placeholder="select start date"
                            format="MM/DD/YYYY"
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
                      <View style={{ flexDirection: 'row' }}>
                        <TouchableHighlight style={styles.attenbutton} title="Ok" onPress={() => this.getPerformReport({ datetoken: 'daterange', label: 'Date Range' })}>
                          <Text style={styles.buttonText}>Ok</Text>
                        </TouchableHighlight>
                        <TouchableHighlight style={styles.attensavebtn} title="Cancel" onPress={() => this.closeModal()}>
                          <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableHighlight>
                      </View>
                    </ScrollView>
                  </View>
                </Modal>
              </ScrollView>
          }
        </View>
      </DrawerLayoutAndroid>
    );
  }
}
