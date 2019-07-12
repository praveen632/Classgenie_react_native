import axios from 'axios';
import config from '../assets/json/config.json';
import React, { Component } from 'react';

var ClassStoryTeacherServices = {
/* Get student class list by hit api */
 getClassStudentList:function(token, value){ 
    return new Promise(resolve => {
        axios.get(config.api_url+':'+config.port+'/studentmessagelist?token='+token+'&class_id='+value+'&sort_by=A')
        .then(function (response) {
			     resolve(response);
          }
        )
        .catch((error) => {
           console.error(error);
        });
    });
 },

 /* Get Class student list in parent by hit api */
getclassStudentlist_parent:function(token, value){
    return new Promise(resolve => {
       axios.get(config.api_url+':'+config.port+'/classinfo/studentlist?token='+token+'&class_id='+value)
       .then(function (response) {
          resolve(response);
         }
       )
       .catch((error) => {
          console.error(error);
       });
   });
},

/* Get whole class story by hit api */
getwhole_classstory:function(value,member_no,pagecount,search,token){
  return new Promise(resolve => {
       axios.get(config.api_url+':'+config.port+'/classstories/allPost?token='+token+"&source=ac&class_id="+value+"&member_no="+member_no+"&page_number="+pagecount+"&name="+search)
       .then(function (response) {
            resolve(response);
         }
       )
       .catch((error) => {
          console.error(error);
       });
   });
},

/* Get student class story by hit api */
getclassstory_student:function(classid,parent_ac_no,member_no,student_no,token){
   return new Promise(resolve => {
        axios.get(config.api_url+':'+config.port+'/classstories/allPost?token='+token+"&class_id="+classid+"&parent_ac_no="+parent_ac_no+"&member_no="+member_no+"&student_no="+student_no)
        .then(function (response) {
              resolve(response);
          }
        )
        .catch((error) => {
           console.error(error);
        }); 
    }); 
 },
 
/* Get likes list by hit api */
Likeslist:function(stoyid,classid,token){
return new Promise(resolve => {
       axios.get(config.api_url+':'+config.port+'/classstories/likesList?token='+token+"&class_id="+classid+"&story_id="+(stoyid).toString())
       .then(function (response) {
         resolve(response);
         }
       )
       .catch((error) => {
          console.error(error);
       });
   });
},

/* Get comment by hit api */
Commentlist:function(story_id,member_no,token){
return new Promise(resolve => {
       axios.get(config.api_url+':'+config.port+'/classstories/commentDetail?token='+token+"&story_id="+story_id+"&teacher_ac_no="+member_no)
       .then(function (response) {
         resolve(response);
         }
       )
       .catch((error) => {
          console.error(error);
       });
   });
},

/* Delete comment by hit api */
deletecomment:function(id, token){
return new Promise(resolve => {
    var param = {id:(id).toString(),
      token:token}
       axios.post(config.api_url+':'+config.port+'/classstories/comment/delete',param)
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
savecomment:function(comment,story_id,member_no,class_id,token){
 return new Promise(resolve => {
      var param = {token:token,story_id:(story_id).toString(),member_no:member_no,class_id:class_id,comment:comment,sender_ac_no:member_no,student_no:''};
         axios.post(config.api_url+':'+config.port+'/classstories/comment',param)
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
  Deletestory:function(story_id,class_id,token){
    return new Promise(resolve => {
        var param = {token:token,id:(story_id).toString(),class_id:class_id};
           axios.post(config.api_url+':'+config.port+'/classstories/delete',param)
           .then(function (response) {
             resolve(response);
             }
           )
           .catch((error) => {
              console.error(error);
           });    
       });    
    },
  
   /* Add post by hit api */
    addPost:function(token,class_id,message,memberno,username){
      return new Promise(resolve => {
          var param = {token:token,
            class_id:class_id,
            message: message,
            teacher_ac_no:memberno,
            teacher_name:username,
            sender_ac_no:memberno
          };         
          axios.post(config.api_url+':'+config.port+'/classstories',param)
          .then(function (response) {
            resolve(response);
            }
          )
          .catch((error) => {
            console.error(error);
          });  
      });      
    },

    /* get comment details by hit api */
      loadPost:function(token, storyId,stored_memberNo){
        return new Promise(resolve => {
          axios.get(config.api_url+':'+config.port+'/classstories/commentDetail?token='+token+"&story_id="+storyId+"&teacher_ac_no="+stored_memberNo+"&sender_ac_no="+stored_memberNo)
          .then(function (response) {
            resolve(response);
            }
          )
          .catch((error) => {
            console.error(error);
          });  
        });        
        },

        /* Update post by hit api */
        UpdatePost:function(token, storyId,textmessage,memberNo){
          return new Promise(resolve => {
              var param = {token:token,
                id:storyId,
                message: textmessage,
                sender_ac_no: memberNo
              };              
              axios.post(config.api_url+':'+config.port+'/classstories/update',param)
              .then(function (response) {
                resolve(response);
                }
              )
              .catch((error) => {
                console.error(error);
              });          
             });          
          },

          /*Add post for student by hit api */
          addPost_student:function(token,classid,post,member_no,username,parent_ac_no,student_no){

            return new Promise(resolve => {
                var param = {
                  token:token,
                  class_id:classid,
                  message: post,
                  teacher_ac_no:member_no,
                  parent_ac_no:(parent_ac_no).toString(),
                  student_no:student_no,
                  teacher_name:username,
                  sender_ac_no:member_no
                };                
              axios.post(config.api_url+':'+config.port+'/classstories',param)
              .then(function (response) {
                resolve(response);
                
                }
              )
              .catch((error) => {
                console.error(error);
              });
            });
          },

          /* Get Pending story by hit api */
          getClasspendingStories:function(classid,pagecount,token){
            return new Promise(resolve => {
                   axios.get(config.api_url+':'+config.port+'/studentstory/class/postlist?token='+token+"&source=ac&class_id="+classid+"&page_number="+pagecount)
                   .then(function (response) {
                     resolve(response);
                     }
                   )
                   .catch((error) => {
                      console.error(error);
                   });            
               });
            },
      
            /* Get Class pending story by hit api */
             getClasspendingStories_student:function(classid,parent_ac_no,student_no,pagecount,token){
              return new Promise(resolve => {
                     axios.get(config.api_url+':'+config.port+'/classstories/allPost?token='+token+"&class_id="+classid+"&parent_ac_no="+parent_ac_no+"&member_no="+member_no+"&student_no="+student_no)
                     .then(function (response) {
                       resolve(response);
                       }
                     )
                     .catch((error) => {
                        console.error(error);
                     });              
                 });
              },

        /* Approve pending story by teacher by hit api */    
        approvePendingpost:function(story_id,memberNo,token){
           return new Promise(resolve => {
              var param = {token:token,
                id: (story_id).toString(),
                status:"1",
                sender_ac_no: memberNo
           };
            axios.post(config.api_url+':'+config.port+'/studentstory/approveteacher',param)
                .then(function (response) {
                  resolve(response);
                  }
                )
                .catch((error) => {
                  console.error(error);
                });        
            });                
         },

         /* Disapprove pending story by hit api */
         disapprovePendingpost:function(story_id,memberNo,token){
          return new Promise(resolve => {
            var param = {
              token:token,
              id: (story_id).toString(),
              status:"-1",
              sender_ac_no: memberNo
            };
            axios.post(config.api_url+':'+config.port+'/studentstory/approveteacher',param)
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
    likePost(id,status,member_no,class_id,token)
    {
      return new Promise(resolve => {
        var param = {token:token, member_no:member_no,class_id:(class_id).toString(),sender_ac_no:member_no,status:status,story_id:id};
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

    /* Generate pdf by hit api */
    generatepdf(token, classId,member_no)
    {
      return new Promise(resolve => {
        axios.get(config.api_url+':'+config.port+'/pdfgenerate?token='+token+'&member_no='+member_no+'&class_id='+(classId).toString())
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

    /*Send mail by hit api */
    sendMail(token, classId,member_no)
    {                
      return new Promise(resolve => {
        axios.get(config.api_url+':'+config.port+'/sendmail?token='+token+'&member_no='+member_no+'&class_id='+(classId).toString()+'&id=1')
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

    /* Invite teacher by hit api */
    inviteTeacherParent(data,student_no, parent_no,student_name,token)
    {
      return new Promise(resolve => {
        axios.get(config.api_url+':'+config.port+'/sendmail?token='+token+'&email='+data+'&id=3'+'&student_name='
        +student_name+'&student_no='+student_no+'&parent_no='+parent_no)
        .then(function (response) {
          resolve(response);
          console.log(response);
          }
        )
        .catch((error) => {
            console.error(error);
        });  
    });
    }      
}
module.exports = ClassStoryTeacherServices;
