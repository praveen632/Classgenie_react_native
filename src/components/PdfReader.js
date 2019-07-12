import React, { Component } from 'react';
import { TextInput, TouchableHighlight, Dimensions, TouchableWithoutFeedback, Clipboard, Platform, TouchableOpacity, StyleSheet, Text, View, Button, SectionList, AsyncStorage, FlatList, Image, ScrollView, Alert, ToastAndroid, Picker, Modal } from 'react-native';
import config from '../assets/json/config.json';
import styles from '../assets/css/mainStyle';
import DismissKeyboard from 'dismissKeyboard';
import Pdf from 'react-native-pdf';
export default class PdfReader extends Component {

    constructor() {
        super();
        this.state = {
            page: 1,
            scale: 1,
            numberOfPages: 0,
            horizontal: false,
        };
        this.pdf = null;
    }

    async componentWillMount() {

        DismissKeyboard();

    }
    prePage = () => {
        let prePage = this.state.page > 1 ? this.state.page - 1 : 1;
        this.setState({ page: prePage });
        console.log(`prePage: ${prePage}`);
    };

    nextPage = () => {
        let nextPage = this.state.page + 1 > this.state.numberOfPages ? this.state.numberOfPages : this.state.page + 1;
        this.setState({ page: nextPage });
        console.log(`nextPage: ${nextPage}`);
    };

    zoomOut = () => {
        let scale = this.state.scale > 1 ? this.state.scale / 1.2 : 1;
        this.setState({ scale: scale });
        console.log(`zoomOut scale: ${scale}`);
    };

    zoomIn = () => {
        let scale = this.state.scale * 1.2;
        scale = scale > 3 ? 3 : scale;
        this.setState({ scale: scale });
        console.log(`zoomIn scale: ${scale}`);
    };

    switchHorizontal = () => {
        this.setState({ horizontal: !this.state.horizontal, page: this.state.page });
    };


    render() {
        let source = { uri: this.props.source, cache: true };
        return (
            <View style={styles.pdfcontainer}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableHighlight disabled={this.state.page === 1}
                        style={this.state.page === 1 ? styles.btnDisable : styles.btn}
                        onPress={() => this.prePage()}>
                        <Text style={styles.btnText}>{'-'}</Text>
                    </TouchableHighlight>
                    <View style={styles.btnText}><Text style={styles.btnText}>Page</Text></View>
                    <TouchableHighlight disabled={this.state.page === this.state.numberOfPages}
                        style={this.state.page === this.state.numberOfPages ? styles.btnDisable : styles.btn}
                        onPress={() => this.nextPage()}>
                        <Text style={styles.btnText}>{'+'}</Text>
                    </TouchableHighlight>
                    <TouchableHighlight disabled={this.state.scale === 1}
                        style={this.state.scale === 1 ? styles.btnDisable : styles.btn}
                        onPress={() => this.zoomOut()}>
                        <Text style={styles.btnText}>{'-'}</Text>
                    </TouchableHighlight>
                    <View style={styles.btnText}><Text style={styles.btnText}>Scale</Text></View>
                    <TouchableHighlight disabled={this.state.scale >= 3}
                        style={this.state.scale >= 3 ? styles.btnDisable : styles.btn}
                        onPress={() => this.zoomIn()}>
                        <Text style={styles.btnText}>{'+'}</Text>
                    </TouchableHighlight>
                    <View style={styles.btnText}><Text style={styles.btnText}>{'Horizontal:'}</Text></View>
                    <TouchableHighlight style={styles.btn} onPress={() => this.switchHorizontal()}>
                        {!this.state.horizontal ? (<Text style={styles.btnText}>{'false'}</Text>) : (
                            <Text style={styles.btnText}>{'true'}</Text>)}
                    </TouchableHighlight>

                </View>
                <Pdf ref={(pdf) => {
                    this.pdf = pdf;
                }}
                    source={source}
                    page={this.state.page}
                    scale={this.state.scale}
                    horizontal={this.state.horizontal}
                    onLoadComplete={(numberOfPages, filePath) => {
                        this.state.numberOfPages = numberOfPages; //do not use setState, it will cause re-render
                        console.log(`total page count: ${numberOfPages}`);
                    }}
                    onPageChanged={(page, numberOfPages) => {
                        this.state.page = page; //do not use setState, it will cause re-render
                        console.log(`current page: ${page}`);
                    }}
                    onError={(error) => {
                        console.log(error);
                    }}
                    style={styles.pdf} />
            </View>

        );
    }

}