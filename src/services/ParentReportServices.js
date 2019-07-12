import axios from 'axios';
import config from '../assets/json/config.json';
import React, { Component } from 'react';

var ParentReportServices = { 
    /* Get student performence by hit api */
    getStudentPerformReport:function(dataParam, token){       
        return new Promise(resolve => { 
            axios.get(config.api_url+':'+config.port+'/report/all/student?token='+token+'&student_info_no='+dataParam.student_info_no+'&datetoken='+dataParam.datetoken+'&name='+dataParam.name+'&parent_ac_no='+dataParam.parent_ac_no+'&startdate='+dataParam.startdate+'&enddate='+dataParam.enddate)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });   
    },

    /* Get Class list by hit api */
    getClassList:function(dataParam){       
        return new Promise(resolve => { 
            axios.get(config.api_url+':'+config.port+'/assignment/classlist?token='+config.api_token+'&datetoken='+dataParam.datetoken+'&name='+dataParam.name+'&parent_ac_no='+dataParam.parent_ac_no)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });   
    },

    /* Get Class performence by hit api */
    getClassPerformReport:function(dataParam, token){       
        return new Promise(resolve => { 
            axios.get(config.api_url+':'+config.port+'/report/student?token='+token+'&datetoken='+dataParam.datetoken+'&name='+dataParam.name+'&parent_ac_no='+dataParam.parent_ac_no+'&student_info_no='+dataParam.student_info_no+'&class_id='+dataParam.class_id+'&startdate='+dataParam.startdate+'&enddate='+dataParam.enddate)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });   
    },

    /* Get student Attendance list by hit api */
    getStudentAttendance:function(dataParam){       
        return new Promise(resolve => { 
            axios.get(config.api_url+':'+config.port+'/attendance_report?token='+config.api_token+'&student_no='+dataParam.student_no+'&date1='+dataParam.startDate+'&date2='+dataParam.endDate)
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
module.exports = ParentReportServices;
