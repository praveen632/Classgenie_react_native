import axios from 'axios';
import config from '../assets/json/config.json';
import React, { Component } from 'react';

var ChangePasswordService = { 
    /* Change password by hit api */
    changePass:function(token, member_no, curr_password, new_password, cnf_password){
        return new Promise(resolve => {
            var param = {password: curr_password,
                newpassword: new_password,
                confirmpassword: cnf_password,
                member_no:member_no,
                token:token
            }            
            axios.post(config.api_url+':'+config.port+'/changepassword/update',param)
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
module.exports = ChangePasswordService;
