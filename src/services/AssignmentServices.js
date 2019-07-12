import axios from 'axios';
import config from '../assets/json/config.json';
import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import Function from "../components/Function";

var AssignmentServices = {
   /* Get assignment list by hit api */
    submitedList(id, page_number, token)
    {       
     return new Promise(resolve => {
            axios.get(config.api_url+':'+config.port+'/assignment/submitedlist?token='+token+'&assignment_id='+id+'&page_number='+page_number)
            .then(function (response) {
              resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });
    
        });
    },

    /* Give markby teacher by hit api */
    addMark(data){
        return new Promise(resolve => {                      
            axios.post(config.api_url+':'+config.port+'/assignment/submit',data)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });
    },

    /* Send reminder to the parent by hit api */
    sendReminder(data){
        return new Promise(resolve => {                      
            axios.get(config.api_url+':'+config.port+'/assignment/reminder?token='+data.token+'&student_no='+data.student_no+'&id='+data.id+'&sender_ac_no='+data.member_no)
            .then(function (response) {
              resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });
    
        });
    },

    /* Get parent kid list by hit api */
    getParentKidList(member_no, token){
         return new Promise(resolve => {                      
            axios.get(config.api_url+':'+config.port+'/parent/kidslist?token='+token+'&parent_ac_no='+member_no)
            .then(function (response) {
              resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });
    
        });
    },

    /* Get parent assignment list by hit api */
    getparentAssignmentList(class_id,student_no,fromDate, toDate, pagecount,token ){
         return new Promise(resolve => {                      
            axios.get(config.api_url+':'+config.port+'/parent/assignment/list?token='+token+'&class_id=' +class_id+'&student_no='+student_no+'&fromDate=' + fromDate + '&toDate=' + toDate + '&page_number=' +pagecount)
            .then(function (response) {
              resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });    
        });
    },

    /* Get student class list by hit api */
    getStudentClassList(member_no, token){
        return new Promise(resolve => {                      
            axios.get(config.api_url+':'+config.port+'/student/studentlist?token='+token+'&student_ac_no=' +member_no)
            .then(function (response) {
              resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });    
        });
    },

    /* Get student assignment list by hit api */
    getstudntAssignmentList(class_id,student_no,fromDate, toDate, pagecount,token ){
        return new Promise(resolve => {                      
           axios.get(config.api_url+':'+config.port+'/student/assignment/list?token='+token+'&class_id=' +class_id+'&student_no='+student_no+'&fromDate=' + fromDate + '&toDate=' + toDate + '&page_number=' +pagecount)
           .then(function (response) {
             resolve(response);
             }
           )
           .catch((error) => {
              console.error(error);
           });    
       });
},
}
module.exports = AssignmentServices;