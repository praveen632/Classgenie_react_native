import axios from 'axios';
import config from '../assets/json/config.json';
import React, { Component } from 'react';

var AddNewSchoolService = { 
    /* Add school */    
    addSchool:function(data){
        return new Promise(resolve => {    
            axios.post(config.api_url+':'+config.port+'/schools/addschoolslist',data)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });    
     },

     /* Approve school by teacher and send mail */  
     approveSchool:function(token, school_name, teacher_name){
        return new Promise(resolve => {             
            axios.get(config.api_url+':'+config.port+'/sendmail?token='+token+'&teacher_name='+teacher_name+'&school_name='+school_name+'&id='+6)
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
module.exports = AddNewSchoolService;
