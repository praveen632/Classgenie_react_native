import axios from 'axios';
import config from '../assets/json/config.json';
import React, { Component } from 'react';

var SignupServices = {
/* Teacher signup by hit api */
 teacherSignup:function(name,email,password,phone_number,token){
    return new Promise(resolve => {    
       var param = {name: name,
         email: email,
         password: password,
         phone: phone_number.toString(),
         usertype:'2',
         token:token
        }        
        axios.post(config.api_url+':'+config.port+'/teacher',param)
        .then(function (response) { 
            resolve(response);
          }
        )
        .catch((error) => {
           console.error(error);
        });     
    });
 },

 /* Leader signup by hit api */
 teacherLeaderSignup:function(name,email,password,phone_number,roleType, app_token){
    return new Promise(resolve => {
       var param = {
            name: name,
            email: email,
            password: password,
            phone: phone_number.toString(),
            usertype:roleType,
            token:app_token
        }         
        axios.post(config.api_url+':'+config.port+'/teacher',param)
        .then(function (response) { 
            resolve(response);
          }
        )
        .catch((error) => {
           console.error(error);
        });     
    });
 },
 
 /* Parent signup by hit api */
 parentSignup:function(name,email,password,phone_number,token){
    return new Promise(resolve => {
        var param = {name: name,
            email: email,
            password: password,
            phone: phone_number.toString(),
            usertype:'3',
            token:token
        }           
        axios.post(config.api_url+':'+config.port+'/parent',param)
        .then(function (response) { 
            resolve(response);
          }
        )
        .catch((error) => {
           console.error(error);
        });     
    });
 },

 /* Check parent code for signup by hit api */
 checkParentCode:function(param){
    return new Promise(resolve => {         
        axios.post(config.api_url+':'+config.port+'/parentcode',param)
        .then(function (response) { 
            resolve(response);
          }
        )
        .catch((error) => {
           console.error(error);
        });     
    });
 },

 /* Check student code for signup by hit api */
 checkStudentCode:function(token,student_no){
    return new Promise(resolve => {         
        axios.get(config.api_url+':'+config.port+'/student/add?token='+token+'&student_no='+student_no)
        .then(function (response) { 
            resolve(response);
          }
        )
        .catch((error) => {
           console.error(error);
        });     
    });
 },

 /* Signup student by hit api */
 SignupStudentStage2:function(param){
    return new Promise(resolve => {         
        axios.post(config.api_url+':'+config.port+'/student',param)
        .then(function (response) { 
            resolve(response);
          }
        )
        .catch((error) => {
           console.error(error);
        });     
    });
 },

 /* Get toke for vvarification by hit api */
 getToken:function()
 {
    return new Promise(resolve => {         
        axios.get(config.api_url+':'+config.port+'/return_token')
        .then(function (response) { 
            resolve(response);           
          }
        )
        .catch((error) => {
           console.error(error);
        });     
    });
 },

/* Get device id for send notification by hit api */
 loadNotification:function(member_no,device_id,token)
 {
    return new Promise(resolve => {         
        axios.get(config.api_url+':'+config.port+'/save_deviceid/getdata?token='+token+'&member_no='+member_no+'&device_id='+device_id)
        .then(function (response) { 
            resolve(response);           
          }
        )
        .catch((error) => {
           console.error(error);
        });     
    });
 },

/* Teacher search device id by hit api */
 searchDevice:function(app_token,member_no,token)
 {
    return new Promise(resolve => {         
        axios.get(config.data.api_url+':'+config.data.port+'/teacher/search?token='+token+'&teacher_ac_no='+member_no)
        .then(function (response) { 
            resolve(response);          
          }
        )
        .catch((error) => {
           console.error(error);
        });
     
    });

 },

 /* Get device id by hit api */
 notification_save(member_no,status,token)
 {
     return new Promise(resolve => {
     var param = {token:token,status:status,member_no:member_no};
       axios.post(config.api_url+':'+config.port+'/getnotification',param)
        .then(function (response) {
          resolve(response);
         }
         )
         .catch((error) => {
         console.error(error);
       });
     });

 },

 /* Save device id by hit api */
 save_device_id:function(token,device_id,member_no){
        return new Promise(resolve => {
        var param = {
            member_no:member_no,
            device_id:device_id.toString(),
            token:token
        }    
        axios.post(config.api_url+':'+config.port+'/save_deviceid',param)
        .then(function (response) { 
            resolve(response);
          }
        )
        .catch((error) => {
           console.error(error);
        });     
    });
 },
};

module.exports = SignupServices;
