import React, { Component, findNodeHandle } from 'react';
import { Platform, TouchableOpacity, StyleSheet, Text, View, Button, SectionList, AsyncStorage, FlatList, Image, ScrollView, Alert, ToastAndroid, Modal, TextInput, TouchableHighlight } from 'react-native';
//import PieChart from 'react-native-pie-chart';
import Menu from 'react-native-pop-menu';
import { PieChart } from 'react-native-mp-android-chart';
import { Actions } from 'react-native-router-flux';
import styles from '../assets/css/mainStyle';
import TeacherServices from '../services/teacherServices';
import config from '../assets/json/config.json';
import HideableView from 'react-native-hideable-view';
import DatePicker from 'react-native-datepicker'
import DismissKeyboard from 'dismissKeyboard';
export default class PerformanceGraphCom extends Component {
  constructor(props) {
    super(props);
    if(this.props.positive && this.props.negative)
    {
      var pointData = [this.props.positive, this.props.negative];
      var pointColor = ['#C0FF8C', '#FFF78C'];
      var labelData = ['Positive(in %)', 'Need Work(in %)'];
    }
    else if(this.props.positive)
    {
      var pointData = [this.props.positive];
      var pointColor = ['#C0FF8C'];
      var labelData = ['Positive(in %)']
    }
    else
    {
      var pointData =  [this.props.negative];
      var pointColor = ['#FFF78C'];
      var labelData =  ['Need Work(in %)']
    }

    this.state = {
      legend: {
        enabled: false,
        textSize: 14,
        form: 'square',
        position: 'ABOVE_CHART_CENTER',
        wordWrapEnabled: true,
        yEntrySpace: 0,
        formToTextSpace: 0
      },
      data: {
        datasets: [{
          yValues: pointData,
          label: '',
          config: {
            colors: pointColor,
            sliceSpace: 0,
            selectionShift: 0,
            textSize: 14,
          },
          textSize: 14,
        }],
        xValues: labelData
      },
      description: {
        text: '',
        textSize: 14,
        textColor: 'darkgray',
        fontStyle: 2
      }
    };
  }


  componentDidMount()
  {
    DismissKeyboard();
  }
 

  render() {

    {/* START || IF THERE IS DATA THEN DISPLAY THE GRAPH */ }
    return (
      <View style={{height:250}}>
        <PieChart
          style={styles.chart}
          logEnabled={false}
          description={this.state.description}
          data={this.state.data}
          legend={this.state.legend}
          drawSliceText={true}
          textSize={50}
          usePercentValues={true}
          centerText={''}
          centerTextRadiusPercent={100}
          holeRadius={40}
          holeColor={'#f0f0f0'}
          transparentCircleRadius={40}
          transparentCircleColor={'#f0f0f0'}
          transparentCircleAlpha={100}
          maxAngle={360}
          ref="myChart"
        />
      </View>
    );

  }
}