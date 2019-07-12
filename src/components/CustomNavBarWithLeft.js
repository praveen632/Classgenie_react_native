import { TouchableWithoutFeedback, Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Actions } from 'react-native-router-flux'
import styles from '../assets/css/mainStyle';
import FontAwesome, { Icons } from 'react-native-fontawesome';

export default class CustomNavBarWithLeft extends React.Component {
  constructor(props) {
    super(props);
  }

  _renderLeftHeader() {
    var actionPage = ()=>Actions.pop();
    if(this.props.actionPage)
    {
      actionPage = this.props.actionPage;
    }
    
    return (
      <View style={styles.Leftheaderstyle}>
        <TouchableWithoutFeedback onPress={actionPage} >
          <View><FontAwesome style={styles.LeftheaderIconStyle}>{Icons.arrowLeft}</FontAwesome></View>
        </TouchableWithoutFeedback>
      </View>
    )
  }

  _renderMiddleHeader() {
    return (
      <View style={styles.MiddleheaderstyleLeft}>
        <Text style={styles.MiddleHeaderTitlestyle}>{this.props.title}</Text>
      </View>
    )
  }
  
  render() {
    return (
        <View style={[styles.customHeaderContainer]}>
          {this.props.hideLeft==1 ? <Text></Text> : this._renderLeftHeader()}
          {this._renderMiddleHeader()}         
        </View>
    )
  }
}