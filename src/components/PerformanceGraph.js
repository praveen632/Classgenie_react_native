import React, { Component, findNodeHandle } from 'react';
import { TouchableWithoutFeedback, Platform, TouchableOpacity, StyleSheet, Text, View, Button, SectionList, AsyncStorage, FlatList, Image, ScrollView, Alert, ToastAndroid, Modal, TextInput, TouchableHighlight } from 'react-native';
//import PieChart from 'react-native-pie-chart';
import Menu from 'react-native-pop-menu';
import { PieChart } from 'react-native-mp-android-chart';
import { Actions } from 'react-native-router-flux';
import styles from '../assets/css/mainStyle';
import TeacherServices from '../services/teacherServices';
import config from '../assets/json/config.json';
import HideableView from 'react-native-hideable-view';
import DatePicker from 'react-native-datepicker'
import PerformanceGraphCom from './PerformanceGraphCom';
import Loader from './Loader';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import DismissKeyboard from 'dismissKeyboard';

export default class PerformanceGraph extends Component {  
  constructor() {
    super();
    this.state = {
      showLoader: 0,
      loggedInUser: {},
      subTitle: '',
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
      right: undefined,
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
    )
    await AsyncStorage.getItem('classid').then((value) =>
      this.setState({ "classid": value })
    )
    await AsyncStorage.getItem('classname').then((value) =>
      this.setState({ "classname": value })
    )

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
      endDate: startDate,      
    }
    this.setState(param);
    /* Set title */
    if (this.state.student_no) {
      Actions.refresh({ title: this.state.student_name, subTitle: 'This Month' });
    }
    else {
      Actions.refresh({ title: 'Whole Class Performance', subTitle: 'This Month' });
    }
    /* Get performance report this month */
    this.getPerformReport({ datetoken: 'thismonth', label: 'This Month' })

  }

  /* Back button in left header */
  _renderLeftHeader() {
    return (      
      <View style={styles.Leftheaderstyle}>
        <TouchableWithoutFeedback onPress={() => Actions.pop()}>         
          <View><FontAwesome style={styles.LeftheaderIconStyle}>{Icons.times}</FontAwesome></View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  /* middle content in header */
  _renderMiddleHeader() {
    return (
      <View style={styles.Middleheaderstyle}>
        <Text style={styles.MiddleHeaderTitlestyle}>{this.props.title}</Text>
        <Text style={styles.MiddleHeaderTitlestyle}>{this.state.subTitle}</Text>
      </View>
    )
  }
  
  /* Menu in right side header */
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

  /* Open modal */
  openModel() {
    this.setState({ modalVisible: true });
  }

  /* Close modal */
  closeModal() {
    this.setState({ modalVisible: false });
  }


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
      var startDate = this.state.startDate;
      var endDate = this.state.endDate;
      this.setState({ "subTitle": 'From ' + startDate + ' To ' + endDate });
      this.closeModal();
    }

    if (this.state.student_no) 
    {
      /* Get student performance report */
      this.getStudentPerformReport(data);
    }
    else {
      /* Get class performance report */
      this.getClassPerformReport(data);
    }

  }

  /* Student performance report */
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
      token: this.state.app_token,
      class_id: this.state.classid,
      student_info_no: this.state.student_no,
      datetoken: data.datetoken,
      startdate: startDate,
      enddate: endDate
    }
    var objThis = this;
    this.setState({ reportList: [] });
    this.setState({ "showLoader": 0 });
    TeacherServices.getStudentPerformReport(dataParam).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      if (response.data['status'] == "Success") {
        objThis.setState({ 'reportList': response.data['point'], nocontent: 0, graph: 1 });
        objThis.setupDataForChart();
      }
      else {
        objThis.setState({ nocontent: 1, graph: 0 });
      }
    });
  }

  /* Class performance report */
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
      token: this.state.app_token,
      class_id: this.state.classid,
      datetoken: data.datetoken,
      startdate: startDate,
      enddate: endDate
    }
    var objThis = this;
    this.setState({ reportList: [] });
    this.setState({ "showLoader": 0 });
    TeacherServices.getClassPerformReport(dataParam).then(function (response) {
      objThis.setState({ "showLoader": 0 });
      if (response.data['status'] == "Success") {
        objThis.setState({ 'reportList': response.data['point'] });
        objThis.setupDataForChart();
      }
      else {
        objThis.setState({ nocontent: 1, graph: 0 });
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
        need_total += (this.state.reportList[i].point*(-1));
      }
    }
    pos_total = Math.abs(pos_total);
    need_total = Math.abs(need_total);

    var positive_skill = Math.round((pos_total / (pos_total + need_total)) * 100);

    var needwork_skill = Math.round((need_total / (pos_total + need_total)) * 100);

    this.setState({ positive_skill: positive_skill, needwork_skill: needwork_skill });

    this.forceUpdate();
    this.setState({ nocontent: 1, graph: 0 });
    this.setState({ nocontent: 0, graph: 1 });

  }

  render() {
    var imagePath = config.image_url;
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
              {/* Start header part */}
              <View style={[styles.customHeaderContainer]}>
                {this._renderLeftHeader()}
                {this._renderMiddleHeader()}
                {this._renderRightHeader()}
              </View>
             {/* End header part */}
              <View style={styles.dashcontainer}>

                {/* START || IF THERE IS NO DATA THEN DISPLAY IT */}

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
                       { item.point > 0 ?
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

                {/* Open menu */}
                <Menu visible={this.state.menuVisible}
                  onVisible={(isVisible) => {
                    this.state.menuVisible = isVisible
                  }}
                  left={this.state.left}
                  right={this.state.right}
                  arrowPosition={this.state.arrowPosition}
                  data={[
                    {
                      title: 'Today',
                      onPress: () => {
                        this.getPerformReport({ datetoken: 'today', label: 'Today' });
                      }
                    },

                    {
                      title: 'This Week',
                      onPress: () => {
                        this.getPerformReport({ datetoken: 'thisweek', label: 'This Week' })
                      }
                    },

                    {
                      title: 'This Month',
                      onPress: () => {
                        this.getPerformReport({ datetoken: 'thismonth', label: 'This Month' })
                      }
                    },

                    {
                      title: 'Date Range',
                      onPress: () => {
                        this.openModel()
                      }
                    },

                  ]}
                  contentStyle={{ backgroundColor: 'teal' }} />

                {/* START FOR CALENDAR MODEL POP */}

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

                    
                      <View style={{ flexDirection: 'row',flex:1}}>
                        <View style={{flex:1}}>
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
                        <View style={{flex:1}}>
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

                {/* END FOR CALENDAR MODEL POPUP*/}
              </View>
            </ScrollView>
        }
      </View>
    );
  }
}