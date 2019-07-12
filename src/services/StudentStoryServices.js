import axios from 'axios';
import config from '../assets/json/config.json';
import React, { Component } from 'react';
import { AsyncStorage } from 'react-native';
import Function from "../components/Function";

var StudentStoryServices = {
    /* Get school story by hit api */
     getSchoolStory:function(school_id,pagecount,token){
     return new Promise(resolve => {
            axios.get(config.api_url+':'+config.port+'/schoolstory/allpostschoolstory?token='+token+"&school_id=" + school_id + "&page_number=" + pagecount)
            .then(function (response) {
              resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });    
        });    
     },
    
     /* Get class list by hit api */
     getclassid:function(member_no, token){
        return new Promise(resolve => {
            axios.get(config.api_url+':'+config.port+'/student/classlist?token='+token+'&member_no=' +member_no)
            .then(function (response) {
              resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });    
        });    
     },

     /* Get class story by hit api */
     getClassStory:function(classid,pagecount,member_no, token){
        return new Promise(resolve => {
            axios.get(config.api_url+':'+config.port+'/classstories/allPost?token='+token+'&source=ac'+'&class_id='+ classid+'&page_number='+pagecount+'&member_no='+member_no)
            .then(function (response) {
              resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });    
        });    
     },

     /* Get list by hit api */
     getlist:function(token, member_no){
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

   /* Get student pending list by hit api */
   getStudent_pendingStory:function(student_no,classid,pagecount,member_no,token)
   {
    return new Promise(resolve => {
      axios.get(config.api_url+':'+config.port+'/studentstory/postlist?token='+token+"&class_id="+classid+"&page_number="+pagecount+"&student_no=" + student_no)
      .then(function (response) {
        resolve(response);
        console.log(response);
        }
      )
      .catch((error) => {
         console.error(error);
         });
       });
   },

   /* Add student story by hit api */
   addPost:function(token,classid,studentcode,data,student_no,student_name){
    return new Promise(resolve => {
     var param = {token:token,class_id:(classid).toString(),message:data,student_no:(studentcode).toString(),
      username:student_name,
      member_no:(student_no).toString(),
      sender_ac_no:(student_no).toString()};
       axios.post(config.api_url+':'+config.port+'/studentstory/msgpost',param)
        .then(function (response) {
         resolve(response);
         console.log(response);
         }
         )
         .catch((error) => {
         console.error(error);
       });
     });
   },

   /* Delete story by hit api */
   Deletestory:function(storyId,token){
    return new Promise(resolve => {
     var param = {token:token,
      id:(storyId).toString()};
       axios.post(config.api_url+':'+config.port+'/studentstory/postdelete',param)
        .then(function (response) {
         resolve(response);
         console.log(response);
         }
         )
         .catch((error) => {
         console.error(error);
       });
     });
   },

   /* Get Comment list by hit api */
   loadPost:function(token, storyId,stored_memberNo)
   {
    return new Promise(resolve => {
      axios.get(config.api_url+':'+config.port+'/studentstory/commentdetail?token='+token+"&story_id="+storyId+"&teacher_ac_no="+stored_memberNo)
      .then(function (response) {
        resolve(response);
        }
      )
      .catch((error) => {
         console.error(error);
         });

       });
   },

   /* update story by hit api */
   UpdatePost:function(token,story_id,item,student_no){
    return new Promise(resolve => {
     var param = {token:token,
      id:(story_id).toString(),message:item,sender_ac_no:(student_no).toString()};
       axios.post(config.api_url+':'+config.port+'/studentstory/post_msgupdate',param)
        .then(function (response) {
         resolve(response);
         console.log(response);
         }
         )
         .catch((error) => {
         console.error(error);
       });
     });
   },

   /* Get class story all post by hit api */
   getStudent_ClassStory_studentno(memberNo,stud_parent_no,stud_no,pagecount,token)
   {
     return new Promise(resolve => {
        axios.get(config.api_url+':'+config.port+'/classstories/allPost?token='+token+"&member_no="+memberNo+
        '&parent_ac_no='+stud_parent_no+'&student_no='+stud_no+ "&page_number="+pagecount)
        .then(function (response) {

         resolve(response);
         console.log(response);
          }
        )
        .catch((error) => {
           console.error(error);
        });
    });
    },
    
    /* Get like list by hit api */
    Likelist:function(classId,storyId,token)
    {
     return new Promise(resolve => {
        axios.get(config.api_url+':'+config.port+'/classstories/likesList?token='+token+"&class_id="+classId+"&story_id="+storyId)
        .then(function (response) {
         resolve(response);
          }
        )
        .catch((error) => {
           console.error(error);
        });

    });

    },

    /* Give like by hit api */
    likePost(id,status,member_no,class_id,studentnoLike,token)
    {
      return new Promise(resolve => {
        var param = {token:token, member_no:member_no,class_id:(class_id).toString(),sender_ac_no:member_no,status:status,story_id:id,student_no:studentnoLike};
          axios.post(config.api_url+':'+config.port+'/classstories/likes',param)
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

    /* Get comment by hit api */
    loadComment(storyId,memberNo,token)
    {
      return new Promise(resolve => {
        axios.get(config.api_url+':'+config.port+'/classstories/commentDetail?token='+token+"&story_id="+storyId+"&teacher_ac_no="+memberNo)
        .then(function (response) {
         resolve(response);
          }
        )
        .catch((error) => {
           console.error(error);
        });

    });
    },

    /* Save comment by hit api */
    saveComment(story_id,member_no,class_id,data,student_no,token)
    {
      return new Promise(resolve => {
        var param = {token:token,story_id:(story_id).toString(),
          member_no:member_no,
          sender_ac_no:member_no,
          class_id:(class_id).toString(),
          comment:data,
          student_no:student_no
        };
          axios.post(config.api_url+':'+config.port+'/classstories/comment',param)
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

    /* Get School list by hit api */
    schoolList:function(member_no, token)
      {       
       return new Promise(resolve => {
          axios.get(config.api_url+':'+config.port+'/studentstory/schools/list?token='+token+'&member_no=' +member_no)
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
module.exports = StudentStoryServices;