import axios from 'axios';
import config from '../assets/json/config.json';
import React, { Component } from 'react';
   
var ParentEventService = { 
    /* School list by hit api */     
    eventParentschool:function(token,member_no){
        return new Promise(resolve => {             
            axios.get(config.api_url+':'+config.port+'/studentstory/schools/list?token='+token+'&member_no='+member_no)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });      
     },

     /* Get event list by hit api */
     getEvent:function(token,school_id,page_number,source){
        return new Promise(resolve => {             
            axios.get(config.api_url+':'+config.port+'/event/list?token='+token+'&school_id='+school_id,'&page_number='+page_number,'&source='+source)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });      
     },
 
     /* Get reponsibility list by hit api */
     responseList:function(token,event_id){
        return new Promise(resolve => {             
            axios.get(config.api_url+':'+config.port+'/event/responsibilty_list?token='+token+'&event_id='+event_id)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });      
     },

     /* Add volunter by hit api */
     addVolunter:function(token, member_no, event_id){
        return new Promise(resolve => {
            var param = { member_no:member_no,
                event_id:event_id,
                token:token
            }
            axios.post(config.api_url+':'+config.port+'/event/add_volunteer',param)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });    
     },
  
     /* Remove volunter by hit api */
     quit_Volunter:function(token, member_no, event_id){
        return new Promise(resolve => {
            var param = { member_no:member_no,
                event_id:event_id,
                token:token
            }
            axios.post(config.api_url+':'+config.port+'/event/quit_from_volunteer',param)
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

module.exports = ParentEventService;

