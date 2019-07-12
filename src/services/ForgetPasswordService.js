import axios from 'axios';
import config from '../assets/json/config.json';
import React, { Component } from 'react';

var ForgetPasswordService = { 
    /* reset password by hit api */
    resetPass:function(data){
        var id    = '';
        var param = '';
        if(data.indexOf('@') != '-1' )
        {   
        param = 'email';
        id    = '10';
        } else {
        param = 'username';
        id    = '17';
    } 
    return new Promise(resolve => {
        axios.get(config.api_url+':'+config.port+'/sendmail?token='+config.api_token+'&'+param+'=' + data + '&id=' +id)
        .then(function (response) {
            console.log(response);
            resolve(response);
            }
        )
        .catch((error) => {
            console.error(error);
        });
    });
},
};
module.exports = ForgetPasswordService;

