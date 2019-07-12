import axios from 'axios'; 
import config from '../assets/json/config.json';
import React, { Component } from 'react';

var ProfileService = {
    /* Delete account by hit api */
    deleteAcc:function(member_no, type,token){
        return new Promise(resolve => {
            var param = {
                member_no:member_no,                
                token:token
            }
            axios.post(config.api_url+':'+config.port+'/'+type+'/delete',param)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });    
     },

     /* Edit account by hit api */
     editAcc:function(member_no, name,token){
        return new Promise(resolve => {
            var param = {
                member_no:member_no,                
                name:name,
                token:token
            }            
             axios.post(config.api_url+':'+config.port+'/student/update',param)
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
module.exports = ProfileService;