import React, { Component } from 'react';
import { StyleSheet, Text, View, Image, ImageBackground, ScrollView, TouchableWithoutFeedback } from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from '../assets/css/mainStyle';
import config from '../assets/json/config.json';
import DismissKeyboard from 'dismissKeyboard';
const Signup = () => {
  var server_path = config.server_path;
/* Close keypad */
  DismissKeyboard();
  return (
    /* Backgrount image in signup list page */
    <ImageBackground source={{ uri: server_path + 'assets/images/body-back.jpg' }} style={styles.backgroundImage}>
      <ScrollView style={styles.signupscrollstyle} contentContainerStyle={{
        justifyContent: 'center',
        alignItems: 'center',
      }} >
       {/* App logo */}
        <View style={styles.logo}>
          <Image source={{ uri: server_path + 'assets/images/logon.png' }} style={styles.logoImage} />
          <Text>
            <Text style={styles.textcolor}>Sign up for ClassGenie as a...</Text>
          </Text>
        </View>

         {/* teacher signup */}
        <View style={styles.signupIconBackground}>
          <Text onPress={() => Actions.signupTeacher()} >
            <Image source={{ uri: server_path + 'assets/images/teacher_icon.png' }} style={styles.signupIcon} />
          </Text>
          <Text style={styles.signuptext}>Teacher</Text>
        </View>
        <View style={styles.signupIconBackground}>

         {/* Parent signup */}
          <Text onPress={() => Actions.signupParent()} >
            <Image source={{ uri: server_path + 'assets/images/parants_icon.png' }} style={styles.signupIcon} />
          </Text>
          <Text style={styles.signuptext}>Parent</Text>
        </View>

        {/* Student signup */}
        <View style={styles.signupIconBackground}>
          <Text onPress={() => Actions.signupStudent()} >
            <Image source={{ uri: server_path + 'assets/images/student_icon.png' }} style={styles.signupIcon} />
          </Text>
          <Text style={styles.signuptext}>Student</Text>
        </View>

        {/* Leader signup */}
        <View style={styles.signupIconBackground}>
          <Text onPress={() => Actions.signupLeader()} >
            <Image source={{ uri: server_path + 'assets/images/student_icon.png' }} style={styles.signupIcon} />
          </Text>
          <Text style={styles.signuptext}>School Leader</Text>
        </View>

        <View style={[styles.loginscreen, styles.margin10]}>
          <View style={styles.signupstyle}>
            <Text style={styles.textcolor}>Already have any account </Text>
          </View>
          <TouchableWithoutFeedback>
            <View >
              <Text style={styles.signupclassstyle} onPress={() => Actions.login()}>Login</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </ScrollView>
    </ImageBackground >

  );
}
export default Signup;
