import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';

var Function = {
    getToken:function(){
        return new Promise(resolve => {
         AsyncStorage.getItem('app_token').then(function (response) {
              resolve(response);            
              }
            )
            .catch((error) => {
               console.error(error);
         });
      });
     },

   }
module.exports = Function;

