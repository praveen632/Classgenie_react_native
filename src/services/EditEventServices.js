import axios from 'axios';
import config from '../assets/json/config.json';
import React, { Component } from 'react';

var EditEventServices = { 
    /* Edit event by hit api */
    editEvent:function(data){       
        return new Promise(resolve => {           
             axios.post(config.api_url+':'+config.port+'/event/edit_event',data)
             .then(function (response) { 
                 resolve(response);
               }
             )
             .catch((error) => {
                console.error(error);
             });          
         });     
      },

      /* Get teacher list by hit api */
      teacherlistEvent:function(app_token,school_id,pagecount){              
        return new Promise(resolve => {             
            axios.get(config.api_url+':'+config.port+'/schools/teacherlistlimit?token='+app_token+'&school_id='+school_id+ '&pagecount=' +pagecount)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });
    },

    /* Send event notification by hit api */
    sendEventNotification:function(dataParam){
        return new Promise(resolve => {             
            axios.post(config.api_url+':'+config.port+'/assignment/sendnotification',dataParam)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });
    },

    /* Edit reponsibility by hit api */
    editResponsiblity:function(app_token,object_id){              
        return new Promise(resolve => {             
            axios.get(config.api_url+':'+config.port+'/event_responsibilty/list?token='+app_token+'&object_id='+object_id)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });
    },

    /* Update rreponsbility by hit api */
    updateResponse:function(dataParam){       
        return new Promise(resolve => {             
            axios.post(config.api_url+':'+config.port+'/event_responsibilty/update',dataParam)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });
    }
};
module.exports = EditEventServices;

