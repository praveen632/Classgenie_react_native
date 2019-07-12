import React, { Component, findNodeHandle } from 'react';
import { Platform, TouchableOpacity, StyleSheet, Text, View, Button, SectionList, AsyncStorage, FlatList, Image, ScrollView, Alert, ToastAndroid, Modal, TextInput, TouchableHighlight, TouchableWithoutFeedback } from 'react-native';
//import PieChart from 'react-native-pie-chart';
import Menu from 'react-native-pop-menu';
import { PieChart } from 'react-native-mp-android-chart';
import { Actions } from 'react-native-router-flux';
import styles from '../assets/css/mainStyle';
import StudentReportService from '../services/StudentReportService';
import config from '../assets/json/config.json';
import HideableView from 'react-native-hideable-view';
import DatePicker from 'react-native-datepicker'
import PerformanceGraphCom from './PerformanceGraphCom';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import DismissKeyboard from 'dismissKeyboard';

export default class StudentReport extends Component {
  constructor() {
    super();
    this.state = {
      dateTitle: 'This Month',
      classTitle: 'All Class',
      loggedInUser: {},
      subTitle: '',
      studentNo: '',
      allClass: false,
      classid: '',
      classname: '',
      student_name: '',
      student_no: '',
      reportList: [],
      menuVisible: false,
      nocontent: 0,
      graph: 0,
      modalVisible: false,
      startDate: null,
      endDate: null,
      arrowPosition: 'topRight',
      left: 12,
      top: -200,
      right: undefined,
      dataMenu: [],
      student_no: '',
      parent_no: '',
      class_id: '',
      datetk: {},
      datelabel: {},
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
    };
    this.getReport = this.getReport.bind(this);
    this.openModel = this.openModel.bind(this);
    this.closeModal = this.closeModal.bind(this);
    this.getPerformReport = this.getPerformReport.bind(this);
    this.getStudentPerformReport = this.getStudentPerformReport.bind(this);
    this.getClassPerformReport = this.getClassPerformReport.bind(this);
    this.setupDataForChart = this.setupDataForChart.bind(this);
    this.DateRange = this.DateRange.bind(this);
    this.ClassList = this.ClassList.bind(this);
    this.studReports = this.studReports.bind(this);
    this.allReports = this.allReports.bind(this);

  }

  async componentWillMount() {
     /* Close keypad */
    DismissKeyboard();
     /* Get local storage values */
    await AsyncStorage.getItem('loggedInUser').then((value) =>
      this.setState({ "loggedInUser": JSON.parse(value) })
    )
    await AsyncStorage.getItem('studentNo').then((value) =>
      this.setState({ "studentNo": value })
    )
    this.setState({ "allClass": false });
     /* Get report on the time of page load */
    this.getReport();
  }

  getReport() {
    var obj = this;
    /*Set default date*/
    var d = new Date();
    var month = d.getMonth() + 1;
    var day = d.getDate();
    var year = d.getFullYear();
    var startDate = month + '/' + day + '/' + year;
    var param = {
      username: obj.state.loggedInUser.username,
      member_no: obj.state.loggedInUser.member_no,
      subTitle: 'This Month',
      startDate: startDate,
      endDate: startDate
    }
    obj.setState(param);
    obj.setState({ datetk: 'thismonth' });
    obj.setState({ datelabel: 'this Month' });
     /* Get report */
    obj.getPerformReport({ datetoken: this.state.datetk, label: this.state.datelabel })
  }

   /* Open modal */
  openModel() {
    this.setState({ modalVisible: true });
  }

  /* Close modal */
  closeModal() {
    this.setState({ modalVisible: false });
  }

  /* get performance report */
  getPerformReport(data) {
    var obj = this;
    if (obj.state.allClass == false) {
      Actions.refresh({ title: obj.state.loggedInUser.username + '/' + "This Month Report", initial: true });
    } else {
      Actions.refresh({ title: obj.state.loggedInUser.username, subTitle: 'This Month' });
    }

    /*
    if we come from whole class then get whole class report
    else get student report.
    
    if there is student_no it means we came student report
    */

    /* reset the graph data */
    if (data.datetoken != 'daterange') {
      obj.setState({ "subTitle": data.label });
    } else {
      if ((new Date(obj.state.startDate)).getTime() > (new Date(obj.state.endDate)).getTime()) {
        Alert.alert(
          '',
          'End date should be greater than start date',
          [
            { text: 'OK', style: 'cancel' },
          ],
        );
        return false;
      }
      var startDate = obj.state.startDate;
      var endDate = obj.state.endDate;
      obj.setState({ "subTitle": 'From ' + startDate + ' To ' + endDate });
      obj.closeModal();
    }

    if (obj.state.allClass === false) {
      /* Get class performance report */
      obj.getClassPerformReport(data);
    }
    else if (obj.state.allClass === true) {
      /* Get student performance report */
      obj.getStudentPerformReport(data);
    }
  }

  /* Student report */
  getStudentPerformReport(data) {
    var obj = this;
    if (data.datetoken == 'daterange') {
      /*Formate the date according to API need */
      var d = new Date(obj.state.startDate);
      var month = d.getMonth() + 1;
      var day = d.getDate();
      var year = d.getFullYear();
      var startDate = year + '/' + month + '/' + day;

      var d = new Date(obj.state.endDate);
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
      class_id: obj.state.class_id,
      student_info_no: obj.state.student_no,
      datetoken: data.datetoken,
      startdate: startDate,
      enddate: endDate
    }

    obj.setState({ reportList: [] });
    /* Call function in student report to get performence report */
    StudentReportService.getStudentPerformReport(dataParam).then(function (response) {
      if (response.data['status'] == "Success") {
        obj.setState({ 'reportList': response.data['point'], nocontent: 0, graph: 1 });
        obj.setupDataForChart();
      }
      else {
        obj.setState({ nocontent: 1, graph: 0 });
      }

    });

  }

  /* Get Class report */
  getClassPerformReport(data) {
    var obj = this;
    if (data.datetoken == 'daterange') {
      /*Formate the date according to API need */
      var d = new Date(obj.state.startDate);
      var month = d.getMonth() + 1;
      var day = d.getDate();
      var year = d.getFullYear();
      var startDate = year + '/' + month + '/' + day;
      var d = new Date(obj.state.endDate);
      var month = d.getMonth() + 1;
      var day = d.getDate();
      var year = d.getFullYear();
      var endDate = year + '/' + month + '/' + day;
    } else {
      var startDate = '';
      var endDate = '';
    }

    let dataParam = {
      member_no: obj.state.loggedInUser.member_no,
      datetoken: data.datetoken,
      startdate: startDate,
      enddate: endDate
    }

    obj.setState({ reportList: [] });
    StudentReportService.getClassPerformReport(dataParam).then(function (response) {
      if (response.data['status'] == "Success") {
        obj.setState({ 'reportList': response.data['point'] });
        obj.setupDataForChart();
      }
      else {
        obj.setState({ nocontent: 1, graph: 0 });
      }
    });

  }

  /* Set data for display in chart */
  setupDataForChart() {
    var obj = this;
    /*run the loop to build data for chart*/
    var pos_total = 0;
    var need_total = 0;
    for (let i = 0; i < (obj.state.reportList).length; i++) {
      if (obj.state.reportList[i].customize_detail.pointweight > 0) {
        pos_total += obj.state.reportList[i].point;
      }
      else if (obj.state.reportList[i].customize_detail.pointweight < 0) {
        need_total += (obj.state.reportList[i].point * (-1));
      }
    }
    pos_total = Math.abs(pos_total);
    need_total = Math.abs(need_total);

    var positive_skill = Math.round((pos_total / (pos_total + need_total)) * 100);

    var needwork_skill = Math.round((need_total / (pos_total + need_total)) * 100);

    obj.setState({ positive_skill: positive_skill, needwork_skill: needwork_skill });

    obj.forceUpdate();
    obj.setState({ nocontent: 1, graph: 0 });
    obj.setState({ nocontent: 0, graph: 1 });

  }

  /* Open date range modal */
  DateRange() {
    var obj = this;
    obj.setState({
      menuVisible: true,
      left: undefined,
      right: '27%',
      top: 0

    });
    var dataVal = [{
      title: 'Today',
      onPress: () => {
        obj.setState({ datetk: 'today' });
        obj.setState({ datelabel: 'Today' });
        obj.setState({ dateTitle: 'Today' });
        obj.getPerform();
      },

    },

    {
      title: 'This Week',
      onPress: () => {
        obj.setState({ datetk: 'thisweek' });
        obj.setState({ datelabel: 'This Week' });
        obj.setState({ dateTitle: 'This Week' });
        obj.getPerform();
      }
    },

    {
      title: 'This Month',
      onPress: () => {
        obj.setState({ datetk: 'thismonth' });
        obj.setState({ datelabel: 'This Month' });
        obj.setState({ dateTitle: 'This Month' });
        obj.getPerform();
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

  /* Get student report */
  studReports(student_no, parent_no, class_id) {
    var obj = this;
    obj.setState(
      {
        allClass: true,
        student_no: student_no,
        parent_no: parent_no,
        class_id: class_id
      }, () => { obj.getPerformReport({ datetoken: this.state.datetk, label: this.state.datelabel }) }
    );
  }

  /* Get all report */
  allReports() {
    var obj = this;   
    obj.setState(
      {
        allClass: false,
      }, () => { obj.getPerformReport({ datetoken: this.state.datetk, label: this.state.datelabel }) }
    );   
  }

/* Get class list */
  ClassList() {
    var obj = this;
    StudentReportService.getStudentList(obj.state.loggedInUser.member_no).then(function (response) {
      if (response.data['status'] == "Success") {
        var class_name = '';
        var student_no = '';
        var parent_no = '';
        var class_id = '';
        var dataVal = [];
        let data = {
          title: "All Class",
          onPress: () => {
            obj.setState({ classTitle: 'All Class' });
            obj.allReports();
          },
        };

        dataVal.push(data);
        for (let i = 0; i < (response.data.student_list).length; i++) {
          let class_name = response.data.student_list[i].class_name;
          let student_no = response.data.student_list[i].student_no;
          let parent_no = response.data.student_list[i].parent_no;
          let class_id = response.data.student_list[i].class_id;

          var data = {
            title: class_name,
            onPress: () => {
              obj.setState({ dateTitle: 'Today' });
              obj.setState({ classTitle: class_name });
              obj.studReports(student_no, parent_no, class_id);

            },
          };
          dataVal.push(data);
        }
        obj.setState({
          menuVisible: true,
          left: 20,

          right: undefined,
        });
        obj.setState({ dataMenu: dataVal })
      }
    });
  }


  render() {
    var imagePath = config.image_url;
    var server_path = config.server_path;
    return (
      <ScrollView>
        <View style={styles.storycontainer}>
          <View style={styles.reportstyle}>
            <TouchableOpacity style={{ flex: 2 }} onPress={() => this.ClassList()}>
              <Text style={styles.textleft} ><FontAwesome style={styles.tabiconbottom}>{Icons.list}</FontAwesome>  {this.state.classTitle} </Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ flex: 2 }} onPress={() => this.DateRange()}>
              <Text style={{ paddingLeft: 30 }}>  <FontAwesome style={styles.tabiconbottom}>{Icons.calendar}</FontAwesome>  {this.state.dateTitle}</Text>
            </TouchableOpacity>
          </View>

          {/* START || IF THERE IS NO DATA THEN DISPLAY IT */}

          <HideableView visible={this.state.nocontent} removeWhenHidden={true}>
            <View style={styles.graphmid}>
              <Image style={{ flexWrap: 'wrap', width: 130, height: 130 }} source={{ uri: server_path + 'assets/images/graph.png' }} />
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

          {/* Open modal */}
          <Modal transparent={true} visible={this.state.modalVisible} animationType={'slide'} onRequestClose={() => this.closeModal()} >
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
                  {/* Open date picker in modal */}
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

        </View>
        <ScrollView>
          <Menu visible={this.state.menuVisible}
            onVisible={(isVisible) => {
              this.state.menuVisible = isVisible
            }}
            left={this.state.left}
            right={this.state.right}
            top={120}
            arrowPosition={this.state.arrowPosition}
            data={this.state.dataMenu}
            contentStyle={{ backgroundColor: 'teal' }} />
        </ScrollView>
      </ScrollView>
    );
  }
}