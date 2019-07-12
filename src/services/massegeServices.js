import axios from 'axios';
import config from '../assets/json/config.json';
import React, { Component } from 'react';

var MassegeServices = {
    /* Get student list hit api */
    getStudentMessgLists:function(token, class_id){       
        return new Promise(resolve => {         
            axios.get(config.api_url+':'+config.port+'/studentmessagelist?token='+token+'&class_id='+class_id+'&sort_by=A')
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });   
    },

    /* Send notification by hit api */
    teacherChat_notification:function(token, data, member_no){ 
         return new Promise(resolve => {         
            axios.get(config.api_url+':'+config.port+'/teacher/chat_notification?token='+token+'&notification_sender_ac_no='+data+'&receiver_ac_no='+member_no)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });   
    },

    /*Get teacher list by hit api */
    getTeacherMessgList:function(token, datas){ 
        return new Promise(resolve => {         
           axios.get(config.api_url+':'+config.port+'/teacherchatlist?token='+token+'&&parent_ac_no='+datas+'&sort_by=A')
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
module.exports = MassegeServices;