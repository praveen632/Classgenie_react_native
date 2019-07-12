import React, { Component } from 'react';
import { StyleSheet,
  Text,
  View,
  Button,
  AsyncStorage,
  ListView,
  FlatList,
  TouchableOpacity,
  Image,
  TouchableHighlight,
  ScrollView,
  Modal,
  ToastAndroid,
  Alert,
  WebView
} from 'react-native';
import { Actions } from 'react-native-router-flux';
import styles from '../assets/css/mainStyle';
import config from '../assets/json/config.json';
import ZoomImage from 'react-native-zoom-image';
import {Easing} from 'react-native';

export default class ChatVideo extends Component {   

  render() {
    return (
        <ZoomImage
            source={{uri: this.props.imageUrl}}
            imgStyle={{width: 250, height: 230}}
            style={styles.img}
            duration={200}
            enableScaling={false}
            easingFunc={Easing.ease}
        />
    );
  }
}


