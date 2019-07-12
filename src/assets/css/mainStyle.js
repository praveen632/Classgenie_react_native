import React, { StyleSheet, Platform, Dimensions } from 'react-native'

export default StyleSheet.create({


  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  containerForm: {
    justifyContent: 'center',
    marginTop: 10,
    padding: 20,
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
    color: '#ffffff',
  },

  backgroundImage: {
    alignItems: 'center',
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover'
  },

  signupIconBackground: {
    width: 200,
    marginTop: 10,
    backgroundColor: '#d44e4acc',
    alignItems: 'center',
    padding: 6,
  },

  signupIcon: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
  },

  logo: {
    alignItems: 'center',
    marginTop: 10,
    justifyContent: 'center',
  },

  logoImage: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 230,
    height: 77

  },
  White: {
    color: '#FFFFFF'
  },
  selectedBg: {
    backgroundColor: 'grey',
  },
  logincontainer: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
    padding: 20,
    width: '100%',
    marginLeft: 20,
    marginRight: 20,
  },
  forgotp: {
    marginTop: 25,
    textAlign: 'center',
    marginBottom: 5,
    color: '#fff',

  },

  loginscreen: {
    flexDirection: 'row',
    marginBottom: 0,
    marginLeft: 10,
    marginRight: 10,
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gridclass: {
    width: '60%',
    margin: 5,
    textAlign: 'right',
    color: '#fff',
  },
  signupclass: {
    width: 100,
    margin: 5,
    textAlign: 'right',
    color: '#d44e4a',
    fontSize: 17,
  },
  submitbtn: {
    marginTop: 26,
    backgroundColor: '#ffffff3d',
    padding: 10,
  },
  buttonText: {
    color: '#fff',
    textAlign: 'center',
  },
  textcolor: {
    color: '#fff',
  },

  inpustyle: {
    fontSize: 15,
    width: '100%',
    marginBottom: 10,
    color: '#fff',
    borderBottomWidth: 0.5,
    borderBottomColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },

  inpustylePicker: {
    fontSize: 15,
    width: '100%',
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
  },

  PickerViewBorder: {
    borderBottomColor: '#bbb8b8',
    borderBottomWidth: 0.8,
    marginBottom: 15,
  },

  ListContainer: {
    flex: 1,
    margin: 20,

  },
  list: {
    paddingHorizontal: 17,
    backgroundColor: "#E6E6E6",
  },
  separator: {
    marginTop: 10,
  },
  /******* card *************/
  card: {
    shadowColor: '#00000021',
    shadowOffset: {
      width: 2
    },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    marginVertical: 8,
    backgroundColor: "white"
  },
  cardHeader: {
    paddingVertical: 17,
    paddingHorizontal: 16,
    borderTopLeftRadius: 1,
    borderTopRightRadius: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardContent: {
    paddingVertical: 12.5,
    paddingHorizontal: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12.5,
    paddingBottom: 25,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 1,
    borderBottomRightRadius: 1,
  },
  cardImage: {
    flex: 1,
    height: 150,
    width: null,
  },
  /******* card components *************/

  title: {
    fontSize: 14,
    flex: 1,
  },
  time: {
    fontSize: 13,
    color: "#808080",
    marginTop: 5,
    textAlign: 'right'
  },
  icon: {
    width: 50, height: 50
  },

  storyImg: {
    width: 320,
    height: 250,
    textAlign: 'center',
    justifyContent: 'center',
    alignSelf: 'center'
  },

  socialBarContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flex: 1
  },
  socialBarSection: {
    justifyContent: 'center',
    flexDirection: 'row',
    flex: 1,
  },
  socialBarlabel: {
    marginLeft: 8,
    alignSelf: 'flex-end',
    justifyContent: 'center',
  },
  socialBarButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ImageContainer: {
    borderRadius: 10,
    width: 150,
    height: 150,
    borderColor: '#9B9B9B',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#fff',
    marginTop: 10,
    marginBottom: 20,

  },

  dashcontainer: {
    margin: 20,
  },
  textchange: {
    color: '#d44e4a',
    fontSize: 16,
    marginTop: 10,
  },
  backchange: {
    backgroundColor: '#fff',
    paddingTop: 9,
    paddingBottom: 8,
    paddingLeft: 10,
    marginTop: 15,
  },
  listviewpage: {
    backgroundColor: '#fff',
    marginTop: 20,
    flexDirection: 'row',
    padding: 2,

  },
  listviewclass: {
    backgroundColor: '#fff',
    marginTop: 10,
    flexDirection: 'row',
    paddingBottom: 10,
    borderBottomWidth: .6,
    borderBottomColor: '#dedede',
  },
  listviewmargin: {
    paddingTop: 5,
    paddingLeft: 10,
  },

  listclassmargin: {
    paddingTop: 10,
    paddingLeft: 10,
    flexWrap: 'wrap',
  },
  classcontainer: {
    justifyContent: 'center',
    marginTop: 5,
    padding: 10,
    width: '100%',
  },
  addbutton: {
    marginTop: 20,
    backgroundColor: '#d44e4a',
    padding: 10,
    width: '80%',
  },
  cssTextInput: {
    height: 40,
    width: '80%',
    borderColor: 'gray',
    borderBottomWidth: 0.5,
    borderBottomColor: '#bfb6b6',
    marginTop: 30,
  },
  styleinput: {
    width: '90%',
    borderBottomWidth: 0.5,
    borderBottomColor: '#000',
    margin: 20,
  },
  tabcolor: {
    flex: 1,
    textAlign: 'left',
    color: '#333',
    fontSize: 15,
    marginLeft: 17,
    marginRight: 17,
  },
  tabstyles: {
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  classbtn: {
    margin: 20,
    backgroundColor: '#d44e4a',
    padding: 10,

  },
  saveattenbtn: {
    margin: 10,
    backgroundColor: '#d44e4a',
    padding: 10,
    marginTop: 20
  },
  fontcolor: {
    paddingLeft: 20,
    paddingRight: 20,
    color: '#d44e4a',
    marginRight: 15,
  },
  tabstylemenu: {
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedcolor: {
    color: 'red',
  },
  addback: {
    backgroundColor: '#fff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    marginTop: 18,
  },
  addcolor: {
    color: '#d44e4a',
    alignItems: 'center',
    fontSize: 50,
    marginBottom: 10,
  },
  buttonContainer: {
    backgroundColor: '#2E9298',
    borderRadius: 10,
    padding: 0,
    margin: 20,
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 10,
    shadowOpacity: 0.25
  },
  MainContainer: {
    // Setting up View inside content in Vertically center.
    justifyContent: 'center',
    flex: 1,
    margin: 10
  },
  item: {
    padding: 10,
    fontSize: 18,
    height: 44,
  },
  attenclass: {
    borderBottomColor: '#bfb6b6',
    flexDirection: 'row',
    paddingTop: 5,
    borderBottomWidth: .6,
    margin: 10,
    paddingBottom: 10
  },
  attenbtn: {
    margin: 20,
    backgroundColor: '#424242',
    padding: 10,
    width: '50%',
    flex: 1
  },
  attensavebtn: {
    margin: 20,
    backgroundColor: '#d44e4a',
    padding: 10,
    width: '50%',
    flex: 1
  },
  textstylebtn: {
    flex: 1,
    margin: 3,
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
  attenbutton: {
    padding: 10,
    flex: 1,
    backgroundColor: '#387ef5',
    borderWidth: 0.5,
    width: '50%',
    margin: 20
  },
  graphContainer: {
    flex: 1,

  },
  chart: {
    flex: 1
  },
  chatstyle: {
    backgroundColor: '#757171',
    marginTop: 10,
    paddingBottom: 10,
    borderRadius: 5,
    width: 220,
    padding: 10,
  },
  chatmsg: {
    color: '#fff',
    marginTop: 5,
  },
  fontmsgstyle: {
    color: '#fff',
    alignItems: 'flex-end',
    fontSize: 18,
  },
  chaticon: {
    color: '#d44e4a',
    marginTop: 15,
    paddingLeft: 4,
    paddingRight: 4,
    fontSize: 16,
  },
  angleicon: {
    color: '#d44e4a',
    marginTop: 15,
    paddingLeft: 6,
    paddingRight: 10,
    fontSize: 22,
  },

  graphContainer: {
    flex: 1,
  },
  chart: {
    flex: 1,
    fontSize: 50,
    fontFamily: 'monospace',
  },
  leftchat: {
    backgroundColor: '#757171',
    left: 100,
    marginTop: 10,
    justifyContent: 'flex-end',
    paddingBottom: 10,
    borderRadius: 5,
    width: 220,
    padding: 10
  },

  mainviewStyle: {
    flex: 1,
    flexDirection: 'column',
  },
  footer: {
    position: 'absolute',
    flex: 0.1,
    left: 0,
    right: 0,
    bottom: -10,
    backgroundColor: 'green',
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
  },
  bottomButtons: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  footerText: {
    color: 'white',
    fontWeight: 'bold',
    alignItems: 'center',
    fontSize: 18,
  },
  textStyle: {
    alignSelf: 'center',
    color: 'orange'
  },
  scrollViewStyle: {
    borderWidth: 2,
    borderColor: 'blue'
  },
  bottomtabstyle: {
    flexDirection: 'row',
    textAlign: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
    borderWidth: .8,
    borderColor: '#d0d0d0'

  },

  textgap: {
    paddingLeft: 8,
    paddingRight: 8
  },
  tabiconbottom: {
    color: '#d44e4a',
    marginTop: 15,
    paddingLeft: 4,
    paddingRight: 6,
    fontSize: 16,
  },
  listmsgmargin: {
    paddingTop: 10,
    paddingLeft: 10,
    flexWrap: 'wrap',
  },
  chatviewmsg: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 2,
    paddingBottom: 6,
    paddingTop: 10
  },
  profilestyle: {
    backgroundColor: '#fff',
    padding: 10,
    width: '90%'
  },

  Imagestyle: {
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: 10,
    marginBottom: 20,
    padding: 20

  },
  signlink: {
    color: '#d44e4a',
    fontSize: 14,
    marginTop: 5,
    marginBottom: 5
  },
  linkprofile: {
    marginTop: 5,
  },
  changestyle: {
    backgroundColor: '#fff',
    marginTop: 30
  },
  profileinput: {
    width: '90%',
    borderBottomWidth: 0.5,
    borderBottomColor: '#bfb6b6',
    marginTop: 2,
  },
  addstyle: {
    backgroundColor: '#fff',
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center'
  },
  TextInputStyleClass: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#bfb6b6',
    paddingLeft: 7,

  },
  schollcontainer: {
    margin: 20,
    padding: 20
  },
  imagestyle: {
    width: 30,
    height: 30,
    backgroundColor: '#fff',
    padding: 50,
  },
  dashstucontainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 0,
    marginTop: 30
  },
  viewreport: {
    color: '#d44e4a',
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center'
  },


  viewreporttext: {
    fontSize: 16,
    marginTop: 10,
    textAlign: 'center'
  },


  datereport: {
    textAlign: 'center'
  },
  listdashstyle: {
    margin: 20,
    padding: 10,
    width: '50%',
    flex: 1
  },
  crossstyle: {
    color: '#D8163A',
    fontSize: 18,
    textAlign: 'right',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-end',
  },
  listcon: {
    backgroundColor: '#fff',
    padding: 3,
    paddingBottom: 20,
    marginTop: 0,
    marginLeft: 20,
    marginRight: 20
  },
  dashlist: {
    flexDirection: 'row',
    borderBottomWidth: .6,
    borderBottomColor: '#bbb8b8',
  },
  liststylepart: {
    padding: 10,
    flex: 1,
  },
  fontlist: {
    margin: 15,
    padding: 10,
    width: 50,
    flexWrap: 'wrap'
  },
  textright: {
    textAlign: 'right'
  },
  subbtn: {
    backgroundColor: '#d44e4a',
    padding: 10,
    margin: 50,
    marginTop: 0,
    marginBottom: 20
  },
  textleft: {
    textAlign: 'left'
  },
  reportstyle: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    margin: 10,
    padding: 10
  },
  teacherlistbtn: {
    flexDirection: 'row',
    marginTop: 10
  },
  approvebtn: {
    backgroundColor: '#308e4c',
    padding: 8,
    marginRight: 20,
    color: '#fff',
    marginBottom: 15
  },
  dltbtn: {
    backgroundColor: '#d44e4a',
    padding: 8,
    color: '#fff',
    marginBottom: 15
  },


  techaerlistp: {
    backgroundColor: '#fff',
    marginTop: 10,
    flexDirection: 'row',
    padding: 2,
    paddingBottom: 5
  },
  listback: {
    backgroundColor: '#fff',
    margin: 15
  },
  listitems: {
    flexWrap: 'wrap',
    borderBottomColor: '#dedede',
    borderBottomWidth: .7,
    width: 275
  },
  addmar: {
    paddingLeft: 15,
    paddingBottom: 5,
    backgroundColor: '#fff',
    marginTop: 10,
    flexDirection: 'row',
    padding: 2,
  },
  headerfont: {
    color: '#fff',


  },
  marb: {
    marginTop: 5
  },
  classstyles: {
    backgroundColor: '#55ab1d',
    color: '#fff',
    width: 40,
    height: 40,
    borderRadius: 40,
    textAlign: 'center',
    paddingTop: 10
  },
  classtyl: {
    backgroundColor: '#d44e4a',
    color: '#fff',
    width: 40,
    height: 40,
    borderRadius: 40,
    textAlign: 'center',
    paddingTop: 10
  },
  graystyle: {
    backgroundColor: '#ECECEC',
    color: '#000',
    width: 40,
    height: 40,
    borderRadius: 40,
    textAlign: 'center',
    paddingTop: 10
  },
  fonts: {
    color: '#d44e4a',
    fontSize: 18
  },
  addgstyle: {
    backgroundColor: '#fff',
    marginTop: 10,
    flexDirection: 'row',
    padding: 5,
  },
  backgray: {
    backgroundColor: '#c1bbbb'
  },
  mar10: {
    marginTop: 10,
    width: '90%',
    borderBottomWidth: 0.5,
    borderBottomColor: '#bfb6b6',
    margin: 15
  },

  bgchange: {
    backgroundColor: '#999',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    marginTop: 18,
  },
  textc: {
    textAlign: 'center',
    color: '#fff'
  },
  groupbtn: {
    margin: 20,
    backgroundColor: '#fff',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  bcolor: {
    color: '#000',
    textAlign: 'center'
  },
  editstudentclasss: {
    backgroundColor: '#fff',
    padding: 5
  },
  contentCenter: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  editclassstyle: {
    backgroundColor: '#fff',
    padding: 5
  },
  orangetext: {
    color: '#d44e4a',
    fontSize: 16
  },
  editpopupimage: {
    flexDirection: 'row',
    margin: 20,
    flexWrap: 'wrap',
  },
  editimage: {
    flex: 1,
    margin: 5
  },

  containerImagePop: {
    width: 60,
    height: 60,
  },
  whitebackgrounnd: {
    backgroundColor: '#fff',
  },
  padding: {
    padding: 10
  },
  resetbtn: {
    margin: 10,
    marginTop: 20,
    backgroundColor: '#797979',
    padding: 10,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  datepickerbox: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#bfb6b6',
    margin: 10,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
  },
  width50: {
    width: 50
  },
  navBarItem: {
    flex: 1,
    color: '#fff',
  },

  customHeaderContainer: {
    height: (Platform.OS === 'ios') ? 64 : 54,
    flexDirection: 'row',
    backgroundColor: '#d44e4a',
    paddingLeft: 12,
    paddingRight: 12
  },

  Leftheaderstyle: {
    flex: 1.3,
    color: '#fff',
    justifyContent: 'center',
  },

  LeftheaderIconStyle: {
    fontSize: 20,
    color: '#fff',
    width: 50
  },

  RightheaderIconStyle: {
    fontSize: 20,
    color: '#fff',
    minWidth: 20,
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    alignSelf: 'flex-end',
  },

  Middleheaderstyle: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    flex: 7.4,

  },

  MiddleHeaderTitlestyle: {
    color: '#fff',
    fontSize: 18,

  },

  MiddleheaderstyleLeft: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'flex-start',
    flex: 8,

  },

  Rightheaderstyle: {
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'flex-end',
    flex: 1.3
  },

  graphmid: {
    justifyContent: 'center',
    marginTop: 30,
    alignItems: 'center',
    alignSelf: 'center',
  },
  marginbottom50: {
    marginBottom: 50
  },
  classstoryimage: {
    flex: 1,
  },
  classstorycontent: {
    flex: 4,
    paddingTop: 10

  },
  invitelink: {
    color: '#387ef5'
  },

  invitemidcontent: {
    flex: 4,
    paddingTop: 18,

  },
  inviterightbtn: {
    flex: 1,
    paddingTop: 15
  },
  invitebtn: {
    backgroundColor: '#fff',
    padding: 10,
    borderColor: '#d44e4a',
    borderWidth: 1,
    borderRadius: 4,
  },
  invitetext: {
    fontSize: 13,
    textAlign: 'center'
  },
  invitebgimage: {
    height: 100


  },
  inviteparentmar: {
    marginTop: -160
  },
  textcenter: {
    textAlign: 'center'
  },
  choosetextleft: {
    textAlign: 'left',
    paddingTop: 5
  },
  marginBottom10: {
    marginBottom: 10
  },
  midwholestory: {
    padding: 5,
  },
  classiconleft: {
    margin: 10,
    padding: 5,
    width: 55,
    flexWrap: 'wrap',
  },
  whotestoryright: {
    margin: 10,
    padding: 5,
    width: 60,
    flexWrap: 'wrap',
  },
  fontwholeicon: {
    color: '#D8163A',
    fontSize: 30,
    textAlign: 'left'
  },
  wholeborder: {
    flexDirection: 'row',
    borderWidth: .6,
    borderColor: '#bbb8b8',
  },
  paddingTop10: {
    paddingTop: 10
  },
  wholeimageleft: {
    padding: 5,
    // width: 70,
    width: 60,

  },
  midtextclass: {
    padding: 5,
    width: 250,
  },

  midtextclassStudent: {
    padding: 5,
    flex: 1
  },

  datestory: {
    padding: 3,
    width: '100%',

  },
  marginTop20: {
    marginTop: 20
  },
  commentclass: {
    flexDirection: 'row'
  },

  borderbottomstyle: {
    borderBottomWidth: .6,
    borderBottomColor: '#bbb8b8',
  },
  paddingstyle: {
    paddingTop: 5,
    paddingLeft: 5
  },
  storyfontteacher: {
    fontSize: 22
  },
  marginTop15: {
    marginTop: 15
  },
  datetext: {
    textAlign: 'right',
    fontSize: 12
  },
  paddingleft: {
    paddingTop: 5,
    paddingLeft: 13
  },
  pendingbtn: {
    backgroundColor: '#e0a41d',
    padding: 8,
    marginRight: 20,
    color: '#fff',
    marginBottom: 15
  },
  manaultext: {
    padding: 10,
    fontSize: 20,
    color: '#fff',
    fontWeight: '600',

  },
  manualwhite: {
    textAlign: 'center',
    color: '#fff',
    fontSize: 17,
  },
  slide1: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#008ece'
  },
  slide2: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#00cecc'
  },
  slide3: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#589fff'
  },
  slide4: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#8bc34a'
  },
  slide5: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: '#e68b06'
  },
  storycontainer: {
    margin: 15
  },
  padding20: {
    padding: 40
  },
  storycomment: {
    flex: 3,
    paddingTop: 2,

  },
  storttext: {
    flex: 4,
    paddingTop: 5

  },
  commentstory: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    padding: 10,
    marginTop: 20,
    paddingTop: 15,
    paddingBottom: 15
  },
  sendiconstory: {
    color: '#d44e4a',
    marginTop: 15,
    paddingLeft: 6,
    paddingRight: 10,
    fontSize: 28,
  },
  searchboxstory: {
    backgroundColor: '#fff',
    padding: 10,
    marginBottom: 10
  },
  fullScreen: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: 130
  },
  VideoContainer:
    {
      width: '100%',
      height: 170,

    },
  controls: {
    backgroundColor: 'transparent',
    borderRadius: 5,
    position: 'absolute',
    bottom: 5,
    left: 20,
    right: 20,
  },
  progress: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 3,
    overflow: 'hidden',
  },
  innerProgressCompleted: {
    height: 20,
    backgroundColor: '#cccccc',
  },
  innerProgressRemaining: {
    height: 20,
    backgroundColor: '#2C2C2C',
  },
  generalControls: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: 4,
    overflow: 'hidden',
    paddingBottom: 10,
  },
  rateControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  volumeControl: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  resizeModeControl: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlOption: {
    alignSelf: 'center',
    fontSize: 11,
    color: 'white',
    paddingLeft: 2,
    paddingRight: 2,
    lineHeight: 12,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-around',
    top: '50%'
  },
  addparentcontainer: {
    backgroundColor: '#fff',
    margin: 20,
    padding: 10
  },
  removeimg: {
    width: 60
  },
  listremoveparent: {
    padding: 10,
    flex: 2
  },
  padding5: {
    padding: 5
  },
  likecommentstyle: {
    flexDirection: 'row',
    flex: 3,
    width: '50%'
  },
  editdeleteicon: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '50%',
    textAlign: 'right',
  },
  deleteicon: {
    color: '#e61313',
    fontSize: 18,
  },
  editicon: {
    fontSize: 18,
    color: '#2779bb',
  },
  chattext: {
    flex: 3,
  },
  crosschaticon: {
    flex: 1,
    paddingTop: 0,
    marginTop: 0,
  },

  chathour: {
    color: '#fff',
    marginTop: 5,
    paddingLeft: 5
  },
  marginbottom100: {
    marginBottom: 150
  },
  footerbottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0
  },
  addclassstyle: {
    color: '#d44e4a',
    alignItems: 'center',
    fontSize: 30,
  },
  modalContainerpopup: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#e9e9ef',
  },
  modelContainer: {
    backgroundColor: '#fff',
    width: '80%',
    top: '15%',
    height: '70%',
    bottom: '15%',
    left: '10%',
    borderWidth: 0.7,
    borderColor: '#000',
  },
  editdeleteiconright: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    width: '100%'
  },
  logininputtext: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signuptext: {
    textAlign: 'center',
    color: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  margin10: {
    marginTop: 10,
    marginBottom: 10
  },
  signupscrollstyle: {
    height: '100%',
    width: '100%',
    margin: 0,
    padding: 0
  },
  listMidSizeImg: {
    flexWrap: 'wrap',
    width: 50,
    height: 50
  },
  invitedownloadbtn: {
    margin: 10,
    backgroundColor: '#d44e4a',
    padding: 10,

  },
  manageattenimg: {
    flexWrap: 'wrap',
    flex: 1,
    alignSelf: 'flex-end',
    borderWidth: 2,
    borderColor: '#fff'
  },
  manageattentext: {
    flexWrap: 'wrap',
    flex: 3
  },
  attenbtntext: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 14
  },
  manageatten: {
    flex: 1,
    margin: 2,

  },
  classstoryparents: {
    borderBottomWidth: .6,
    borderBottomColor: '#bbb8b8',
  },
  borderBottomn: {
    borderBottomColor: '#000',
    borderWidth: 1
  },
  selectbottomborder: {
    borderBottomColor: '#bbb8b8',
    borderBottomWidth: 1,
    marginLeft: 5,
    marginRight: 5
  },
  schoolstorystyle: {
    padding: 5,
    width: 180,
  },
  marginLeft20: {
    marginLeft: 20
  },
  divide: {
    flex: 2,
    borderBottomColor: 'rgb(169, 169, 169)',
    borderBottomWidth: .6
  },
  selecttype: {
    flex: 2,
    paddingTop: 15
  },
  eventbtnstyle: {
    flex: 1,
    paddingTop: 5,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 15
  },
  eventsendbtn: {
    padding: 10,
    flex: 1,
    backgroundColor: '#e0a41d',
    margin: 10
  },
  ebventeditbtn: {
    margin: 10,
    backgroundColor: '#387ef5',
    padding: 10,
    flex: 1
  },
  eventdeletebtn: {
    margin: 10,
    backgroundColor: '#c72f24',
    padding: 10,
    flex: 1
  },
  eventselect: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 10
  },
  eventliststyle: {
    backgroundColor: '#fff',
    marginTop: 17,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10
  },
  eventlistcolor: {
    backgroundColor: '#d44e4acc',
    padding: 10,
    color: '#fff'
  },
  assignmentTitleRow: {
    backgroundColor: '#d44e4acc',
    flexDirection: 'row',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    padding: 10,
    color: '#fff'
  },
  EventText: {
    fontSize: 13,
    textAlign: 'center',
    color: '#d44e4a'
  },
  eventclosebtn: {
    margin: 20,
    backgroundColor: '#9E9E9E',
    padding: 10,
  },
  closebtnevent: {
    color: '#000',
    textAlign: 'center',
    margin: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    padding: 8
  },
  eventborderstyle: {
    paddingBottom: 10,
    paddingTop: 10,
    borderBottomWidth: .6,
    borderBottomColor: '#bbb8b8',
  },
  selectimage: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  signupstyle: {
    margin: 5,
    textAlign: 'left',
    color: '#fff',
  },
  signupclassstyle: {
    margin: 5,
    textAlign: 'right',
    color: '#d44e4a',
    fontSize: 15,
  },
  asignlisttext: {
    backgroundColor: '#fff',
    padding: 5,
    color: '#d44e4a',
    marginLeft: 15,
    borderRadius: 4
  },
  assignlistbtn: {
    margin: 10,
    backgroundColor: '#e8b2af',
    padding: 10,
    marginTop: 20
  },

  editdisablebtn: {
    margin: 10,
    backgroundColor: '#387ef570',
    padding: 10,
    flex: 1
  },
  createassigndate: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#bfb6b6',
    width: '100%',
    marginTop: 10

  },
  assignlistiocn: {
    color: '#d44e4a',
    fontSize: 20,
  },
  assigninfoicon: {
    color: '#aaa',
    fontSize: 20,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  assignbordertext: {
    borderBottomWidth: .6,
    borderBottomColor: '#dedede',
  },
  assignorangeicon: {
    color: '#f15b00',
    fontSize: 20,
    justifyContent: 'center',
    alignSelf: 'center'
  },
  assignmarklist: {
    flexDirection: 'row',
    paddingLeft: 5
  },
  assigntextalign: {
    justifyContent: 'center',
    alignSelf: 'center',
    paddingTop: 15
  },
  btn: {
    margin: 2,
    padding: 2,
    backgroundColor: "aqua",
  },
  btnDisable: {
    margin: 2,
    padding: 2,
    backgroundColor: "gray",
  },
  btnText: {
    margin: 2,
    padding: 2,
  },
  pdf: {
    flex: 1,
    width: Dimensions.get('window').width,
  },
  pdfcontainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginTop: 25,
  },
  addeventstyle: {
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 0,
    padding: 20,
    width: '100%',
    marginLeft: 20,
    marginRight: 20,
  },
  addeventbtn: {
    backgroundColor: '#d44e4a',
    padding: 10,
  },
  paddingBottomevent: {
    paddingBottom: 10
  },
  assignmentlistbtn: {
    margin: 20,
    backgroundColor: '#d44e4a',
    padding: 10,
    color: '#fff',
    width: '50%',
    justifyContent: 'center',
    alignSelf: 'center',
    textAlign: 'center'
  },



});
