import React, { Component } from 'react';
import {
  StyleSheet,
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
import SchoolStoryServices from '../services/SchoolStoryServices';
import ChangeSchoolService from '../services/ChangeSchoolService';
import Menu from 'react-native-pop-menu';
import FontAwesome, { Icons } from 'react-native-fontawesome';
import Video from 'react-native-video';

export default class ChatVideo extends Component {
  constructor(props) {
    super(props);
    video: Video; 
    this.state = {

    };   
  }
  /* video start loading */
  onLoad = (data) => {
    this.setState({ paused: true })
    this.setState({ duration: data.duration });
  };
 /* Progress bar in time to video play */
  onProgress = (data) => {
    this.setState({ currentTime: data.currentTime });
  };

  /* Show video is end */
  onEnd = () => {
    this.setState({ paused: true })
    this.video.seek(0)
  };

  /* video Sound */
  onAudioBecomingNoisy = () => {
    this.setState({ paused: true })
  };

  /* video time percentage */
  getCurrentTimePercentage() {
    if (this.state.currentTime > 0) {
      return parseFloat(this.state.currentTime) / parseFloat(this.state.duration);
    }
    return 0;
  };

  /* Control video */
  renderRateControl(rate) {
    const isSelected = (this.state.rate === rate);
    return (
      <TouchableOpacity onPress={() => { this.setState({ rate }) }}>
        <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
          {rate}x
            </Text>
      </TouchableOpacity>
    );
  }

  /* video Resize */
  renderResizeModeControl(resizeMode) {
    const isSelected = (this.state.resizeMode === resizeMode);
    return (
      <TouchableOpacity onPress={() => { this.setState({ resizeMode }) }}>
        <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
          {resizeMode}
        </Text>
      </TouchableOpacity>
    )
  }

  /* Control video volume */
  renderVolumeControl(volume) {
    const isSelected = (this.state.volume === volume);
    return (
      <TouchableOpacity onPress={() => { this.setState({ volume }) }}>
        <Text style={[styles.controlOption, { fontWeight: isSelected ? 'bold' : 'normal' }]}>
          {volume * 100}%
            </Text>
      </TouchableOpacity>
    )
  }

  render() {
    const flexCompleted = this.getCurrentTimePercentage() * 100;
    const flexRemaining = (1 - this.getCurrentTimePercentage()) * 100;
    return (
      <View style={this.props.videoClass}><TouchableOpacity
        style={styles.fullScreen}
        onPress={() => this.setState({ paused: !this.state.paused })}
      >
        <Video
          ref={(ref: Video) => { this.video = ref }}
          /* For ExoPlayer */
          source={{ uri: this.props.videoUrl }}
          style={styles.fullScreen}
          rate={this.state.rate}
          paused={this.state.paused}
          volume={this.state.volume}
          muted={this.state.muted}
          resizeMode={this.state.resizeMode}
          onLoad={this.onLoad}
          onProgress={this.onProgress}
          onEnd={this.onEnd}
          onAudioBecomingNoisy={this.onAudioBecomingNoisy}
          onAudioFocusChanged={this.onAudioFocusChanged}
          repeat={false}
        />
      </TouchableOpacity>
        <View style={styles.controls}>
          <View style={styles.trackingControls}>
            <View style={styles.progress}>
              <View style={[styles.innerProgressCompleted, { flex: flexCompleted }]} />
              <View style={[styles.innerProgressRemaining, { flex: flexRemaining }]} />
            </View>
          </View>
        </View>
      </View>
    );
  }
}


