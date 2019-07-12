import axios from 'axios';
import config from '../assets/json/config.json';
import React, { Component } from 'react';

var SchoolStoryServices = {
    /* Get school story by hit api */
    getSchoolStory:function(school_id,pagecount,token){
          return new Promise(resolve => {
              axios.get(config.api_url+':'+config.port+'/schoolstory/allpostschoolstory?token='+token+ "&school_id=" + school_id + "&page_number=" + pagecount)
              .then(function (response) {
                resolve(response);
                }
              )
              .catch((error) => {
                 console.error(error);
              });      
          });      
       },

       /* Get like list by hit api */
       getLikelist:function(school_id,story_id,token){
        return new Promise(resolve => {
            axios.get(config.api_url+':'+config.port+'/schoolstory/likesList?token='+token+"&story_id="+story_id+"&school_id="+school_id)
            .then(function (response) {
             resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });    
        });   
     },

     /* Get Comment list by hit api */
     loadComment:function(story_id,member_no,token){
        return new Promise(resolve => {
            axios.get(config.api_url+':'+config.port+'/schoolstory/allcommentDetail?token='+token+"&story_id=" + story_id + "&teacher_ac_no=" + member_no)
            .then(function (response) {
             resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });    
        });    
     },

     /* Give comment by hit api */
    saveComment:function(comment,story_id,member_no,school_id,token){
        return new Promise(resolve => {
            var param = {token:token,story_id:story_id,member_no:member_no,school_id:school_id,comment:comment,sender_ac_no:member_no};
               axios.post(config.api_url+':'+config.port+'/schoolstory/comment',param)
               .then(function (response) {
                 resolve(response);
                 }
               )
               .catch((error) => {
                  console.error(error);
               });        
           });        
        },

        /* Delete story by hit api */
      Deletestory:function(storyId,member_no,token){
         return new Promise(resolve => {
           var param = {token:token,id:storyId,teacher_ac_no:member_no};
           axios.post(config.api_url+':'+config.port+'/schoolstory/delete',param)
            .then(function (response) {
             resolve(response);
             }
             )
             .catch((error) => {
             console.error(error);
           });
         });
       },

       /* Add story by hit api */
    addPost:function(token, item,member_no,school_id){
       return new Promise(resolve => {
        var param = {token:token,school_id:(school_id).toString(),message:item,teacher_ac_no:(member_no).toString(),sender_ac_no:(member_no).toString()};
          axios.post(config.api_url+':'+config.port+'/schoolstory/savemsgpost',param)
           .then(function (response) {
            resolve(response);
            }
            )
            .catch((error) => {
            console.error(error);
          });
        });
      },

      /* Get Comment details by hit api */
      loadPost_id:function(token, story_id,member_no){
        return new Promise(resolve => {
            axios.get(config.api_url+':'+config.port+'/schoolstory/allcommentDetail?token='+token+"&story_id=" + story_id + "&teacher_ac_no=" + member_no)
            .then(function (response) {
             resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });    
        });    
     },

     /* Update story by hit api */
     UpdatePost:function(token,item,member_no,story_id){
        return new Promise(resolve => {
        var param = {token:token,id:story_id,message:item,sender_ac_no:member_no};
          axios.post(config.api_url+':'+config.port+'/schoolstory/update',param)
           .then(function (response) {
             resolve(response);
            }
            )
            .catch((error) => {
            console.error(error);
          });
        });
      },

      /* Get Teacher list by hit api */
      teacherlist(school_id,pagecount,token)
      {
       return new Promise(resolve => {
          axios.get(config.api_url+':'+config.port+'/schools/teacherlistlimit?token='+token+"&school_id="+school_id+"&page_number="+pagecount)
          .then(function (response) {
           resolve(response);
            }
          )
          .catch((error) => {
             console.error(error);
          });  
      });
      },

      /* Approve teacher by hit api */
      approveTeacher(member_no,school_id,leader_member_no,token)
      {
        return new Promise(resolve => {
          var param = {token:token, member_no:member_no,school_id:(school_id).toString(),sender_ac_no:leader_member_no};
            axios.post(config.api_url+':'+config.port+'/schools/teacherapprove',param)
             .then(function (response) {
                resolve(response);
              }
              )
              .catch((error) => {
              console.error(error);
            });
          });

      },

      /* Remove teacher by hit api */
      removeTeacher(member_no,school_id,leader_member_no,token)
      {
        return new Promise(resolve => {
          var param = {token:token, member_no:member_no,school_id:(school_id).toString(),sender_ac_no:leader_member_no};
            axios.post(config.api_url+':'+config.port+'/teacher/delete',param)
             .then(function (response) {
               resolve(response);
              }
              )
              .catch((error) => {
              console.error(error);
            });
          });

      },

      /* Give Like by hit api */
      likePost(id,status,member_no,school_id, token)
      {
        return new Promise(resolve => {
          var param = {token:token, member_no:member_no,school_id:(school_id).toString(),sender_ac_no:member_no,status:status,story_id:id};
            axios.post(config.api_url+':'+config.port+'/schoolstory/like',param)
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

      /* Get student list by hit api */
      getlist:function(member_no, token)
      {
       
       return new Promise(resolve => {
          axios.get(config.api_url+':'+config.port+'/student/studentlist?token='+token+'&student_ac_no=' +member_no)
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

module.exports = SchoolStoryServices;

