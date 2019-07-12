import axios from 'axios';
import config from '../assets/json/config.json';
import React, { Component } from 'react';

var AddParentCodeKidService = { 
     /* Get parent kid list by hit api */  
     parentkidlist:function(token, parent_ac_no){
        return new Promise(resolve => {             
            axios.get(config.api_url+':'+config.port+'/parent/kidslist?token='+token+'&parent_ac_no='+parent_ac_no)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });    
     },
    
     /* Remove kids by hit api */
     removeKids:function(student_no,token){  
        return new Promise(resolve => {
            var param = {student_no: student_no,
                token:token}            
            axios.post(config.api_url+':'+config.port+'/parent/kidremove',param)
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


module.exports = AddParentCodeKidService;
