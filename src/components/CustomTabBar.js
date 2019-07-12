import { Image, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Actions } from 'react-native-router-flux'
import styles from '../assets/css/mainStyle';
import FontAwesome, { Icons } from 'react-native-fontawesome';

export default class CustomNavBar extends React.Component {
  _renderLeft() {
    return (
      <TouchableOpacity
        onPress={Actions.pop}
        style={[styles.navBarItem, { paddingLeft: 10 }]}>
        <Image
          style={{ width: 30, height: 50 }}
          resizeMode="contain"
          source={{ uri: 'https://image.flaticon.com/icons/png/512/0/340.png' }}></Image>
      </TouchableOpacity>
    )
  }

  _renderMiddle() {
    return (
      <View  style={styles.tabstylemenu}>
        {
          this.props.tabList.map((obj, i) =>
            obj.currentTab ?

              <View key={i}>
                <Text style={[styles.tabcolor,styles.selectedcolor]}><FontAwesome  style={styles.fontcolor}>{Icons[obj.tabIcon]}</FontAwesome> {obj.title} </Text>
              </View>
              :
              <View  key={i}>
                <Text  onPress={obj.actionPage} style={styles.tabcolor}><FontAwesome  style={styles.fontcolor}>{Icons[obj.tabIcon]}</FontAwesome> {obj.title} </Text>
              </View>
            )}
      </View>
    )
  }

  render() {
    return (
      <View style={styles.tabstyles} >
           { this._renderMiddle() }  
      </View>
    )
  }
}