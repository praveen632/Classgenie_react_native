import axios from 'axios';
import config from '../assets/json/config.json';
import React, { Component } from 'react';

var StudentServices = {
   /* Get student list by hit api */
    getStudentLists:function(token, member_no){
        return new Promise(resolve => {         
            axios.get(config.api_url+':'+config.port+'/student/studentlist?token='+token+'&student_ac_no='+member_no)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });   
    },

    /* Teacher search by hit api */
    getStudentSearch:function(token, member_no){
        return new Promise(resolve => {         
            axios.get(config.api_url+':'+config.port+'/teacher/search?token='+token+'&member_no='+member_no)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });   
    },

    /* Send mail to parent by hit api */
    sendParentMail:function(token, data, student_name, student_no, parent_no){        
        return new Promise(resolve => {         
            axios.get(config.api_url+':'+config.port+'/sendmail?token='+token+'&email='+data+'&id=4'+'&student_name='
            +student_name+'&student_no='+student_no+'&parent_no='+parent_no)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });   
    },

    /* Student add by code by hit api */
    student_add:function(token, data, member_no){        
        return new Promise(resolve => {         
            axios.get(config.api_url+':'+config.port+'/student/addstudentcode?token='+token+'&student_ac_no='+member_no+'&student_no='
            +data)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });   
    },

    /* Remove student by hit api */
    removeStudent:function(token, data){        
        return new Promise(resolve => {         
            axios.get(config.api_url+':'+config.port+'/student/disconnect?token='+token+'&student_no='+data)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });   
    }    
}
module.exports = StudentServices;
