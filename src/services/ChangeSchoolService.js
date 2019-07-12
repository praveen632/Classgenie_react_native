import axios from 'axios';
import config from '../assets/json/config.json';
import React, { Component } from 'react';

var ChangeSchoolService = { 
    /* Change school by hit api */
    changeSchools:function(member_no, token){
        return new Promise(resolve => {
            var param = {
                member_no:member_no,                
                token:token
            }            
            axios.post(config.api_url+':'+config.port+'/schools/change',param)
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
module.exports = ChangeSchoolService;
