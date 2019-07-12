import axios from 'axios';
import config from '../assets/json/config.json';
import React, { Component } from 'react';

var teacherServices = { 
  //Services used for  get Class List  of teacher Dashboard
 getClassList:function(member_no,app_token){
     return new Promise(resolve => {
       axios.get(config.api_url+':'+config.port+'/classinfo/dashboard?token='+app_token+'&teacher_ac_no='+member_no)
            .then(function (response) { 
              resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            }); 
        });
    },

     //Services used for whole Class Performance
 wholeClassPointget:function(class_id,app_token){
     return new Promise(resolve => {             
            axios.get(config.api_url+':'+config.port+'/classinfo/studentlist?token='+app_token+'&class_id='+class_id)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });  
        });
    },
        //Services used for get Student list in the classes 
getStudentList:function(classid,app_token){
       return new Promise(resolve => {
           axios.get(config.api_url+':'+config.port+'/classinfo/studentlist?token='+app_token+'&class_id='+classid)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });    
        });
    },
  

            //Services used for get GroupList in the classes 
getGroupList:function(classid,app_token){
      return new Promise(resolve => {
           axios.get(config.api_url+':'+config.port+'/groupinfo?token='+app_token+'&class_id='+classid)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });
        });
    },


            //Services used for add Student in the classes by teacher
addStudent:function(param){
     return new Promise(resolve => {
          axios.post(config.api_url+':'+config.port+'/addstudent',param)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });        
        });
    },

    
                    //Services used for add classes by teacher  
addClass:function(param){
   return new Promise(resolve => {
      axios.post(config.api_url+':'+config.port+'/classinfo',param)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            }); 
       });

    },

             //Services used for update Class by teacher  
updateClass:function(param){
   return new Promise(resolve => {
          axios.post(config.api_url+':'+config.port+'/classinfo/update',param)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });        
        });
    },


            //Services used for remove Class by teacher 
removeClass:function(param){
    return new Promise(resolve => {
      axios.post(config.api_url+':'+config.port+'/classinfo/delete',param)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });        
        });
    },
 
             //Services used for add Group in the Class by teacher 
addGroup:function(lists_value, groupApiUrl,app_token){
     return new Promise(resolve => {
         axios.post(config.api_url+':'+config.port+groupApiUrl,{group:lists_value,token:app_token})
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });
       });

    },
                 //Services used for remove Group in the Class by teacher 

 removeGroup:function(param){
     return new Promise(resolve => {
         axios.post(config.api_url+':'+config.port+'/groupinfo/delete',param)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });
               });
    },

               //Services used for remove Group in the Class by teacher 
schoolvarify:function(member_no,app_token){
     return new Promise(resolve => {
            axios.get(config.api_url+':'+config.port+'/teacher/search?token='+app_token+'&member_no='+member_no)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });       
        });
    },
           //Services used for get Grade List of the Class 
getGradeList:function(member_no,app_token){
   return new Promise(resolve => {
           axios.get(config.api_url+':'+config.port+'/classlist?token='+app_token+'&teacher_ac_no='+member_no)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });
         
        });

    },
                       //Services used for get Class IconList
getClassIconList:function(app_token){
    return new Promise(resolve => {
          axios.get(config.api_url+':'+config.port+'/classinfo?token='+app_token)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });
    },
             
                //Services used for get get Student IconList
getStudentIconList:function(app_token){
  return new Promise(resolve => {
         axios.get(config.api_url+':'+config.port+'/addstudent/list?token='+app_token)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });        
        });
    },
            
    
                  //Services used for update and Edit Student
updateStudent:function(param){
    return new Promise(resolve => {
        axios.post(config.api_url+':'+config.port+'/addstudent/update',param)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });
    },


                  //Services used for remove Student  from the class 
removeStudent:function(param){
    return new Promise(resolve => {
       axios.post(config.api_url+':'+config.port+'/addstudent/delete',param)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });
    },


                 //Services used for get Student List's added in the group
getStudentListOfGroup:function(classid,group_id,app_token){
    return new Promise(resolve => {
        axios.get(config.api_url+':'+config.port+'/groupinfo/group_studentlist?token='+app_token+'&class_id='+classid+'&group_id='+group_id)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });        
        });
    },

              //Services used for get Feedback Option in Skill portion
getFeedbackOption:function(class_id,app_token){
    return new Promise(resolve => {
        axios.get(config.api_url+':'+config.port+'/points/student?token='+app_token+'&class_id='+class_id)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
           });
        });
    },

                //Services used for get Skill Point List detail given for award
getSkillPointList:function(pointListApiUrl,app_token){
    return new Promise(resolve => {
         axios.get(config.api_url+':'+config.port+pointListApiUrl+'?token='+app_token)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });        
        });
    },

                 //Services used for get Skill Icon List
getSkillIconList:function(app_token){
     return new Promise(resolve => {
          axios.get(config.api_url+':'+config.port+'/editskills/imagelist?token='+app_token)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });
    },


                //Services used for add & Update the Skill
addUpdateSkill:function(param,apiUrl){
   return new Promise(resolve => {
         axios.post(config.api_url+':'+config.port+apiUrl,param)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });
    },


             //Services used for remove Skill 
removeSkill:function(param){
    return new Promise(resolve => {
          axios.post(config.api_url+':'+config.port+'/editskills/delete',param)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });        
        });
    },


              //Services used for get Student Perform Report Individually
getStudentPerformReport:function(dataParam){
   return new Promise(resolve => {
         axios.get(config.api_url+':'+config.port+'/report/student?token='+dataParam.token+'&class_id='+dataParam.class_id+'&datetoken='+dataParam.datetoken+'&student_info_no='+dataParam.student_info_no+'&startdate='+dataParam.startdate+'&enddate='+dataParam.enddate)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });
    },
             

                  //Services used for get Class Perform Report of whole Class
getClassPerformReport:function(dataParam){
    return new Promise(resolve => {
         axios.get(config.api_url+':'+config.port+'/class_perform?token='+dataParam.token+'&class_id='+dataParam.class_id+'&datetoken='+dataParam.datetoken+'&startdate='+dataParam.startdate+'&enddate='+dataParam.enddate)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });        
        });
    },


                 //Services used for get  Mail to the teacher for Attendance
getAttendanceMail:function(param){
   return new Promise(resolve => {
     xios.post(config.api_url+':'+config.port+'/download_exl',param)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });        
        });
    },
 

                             //Services used for get get Student Attendance List
getStudentAttendanceList:function(classId, date1,app_token){
    return new Promise(resolve => {
          axios.get(config.api_url+':'+config.port+'/attendance/studentlist?token='+app_token+'&class_id='+classId+'&date1='+date1)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });
       });
    },


                              //Services used for save Attendance 
saveAttendance:function(attendanceList,date1,app_token){
    return new Promise(resolve => {
           axios.post(config.api_url+':'+config.port+'/attendance/save',{student_list:attendanceList,date:date1,token:app_token})
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });
    },


                         //Services used for reset Attendence 
resetAttendence:function(class_id,date1,app_token){
   return new Promise(resolve => {
      axios.post(config.api_url+':'+config.port+'/attendance_reset',{class_id:class_id,date:date1,token:app_token})
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });        
        });
    },

                        //Services used for give Reward To Group  created by teacher
giveRewardToGroup:function(dataParam){
    return new Promise(resolve => {
        axios.post(config.api_url+':'+config.port+'/groupinfo/pointweight',dataParam)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });
    },

                       //Services used forgive Reward To Multiple Student at a time
giveRewardToMultiStudent:function(dataParam){
    return new Promise(resolve => {
         axios.post(config.api_url+':'+config.port+'/awardmultiple/class',dataParam)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });
    },


                      //Services used to give Reward To Single Student
giveRewardToSingleStudent:function(dataParam){
  return new Promise(resolve => {
          axios.post(config.api_url+':'+config.port+'/points/student/update',dataParam)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });
    },


                   //Services used for give Reward To Whole Class at a time 
giveRewardToClass:function(dataParam){
  return new Promise(resolve => {
        axios.post(config.api_url+':'+config.port+'/points/class/update',dataParam)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });     
        });
    },


                 //Services used for get Event List of Event Added in the School
getEventList:function(school_id,member_no,source,app_token){
   return new Promise(resolve => {
         axios.get(config.api_url+':'+config.port+'/event/list?token='+app_token+'&school_id='+school_id+'&member_no='+member_no+'&source='+source)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });
    },

                   //Services used for get Schedule of Event
getSchedule:function(event_id,app_token){
   return new Promise(resolve => {
         axios.get(config.api_url+':'+config.port+'/event/date_time_list?token='+app_token+'&event_id='+event_id)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });        
        });
    },


                    //Services used for get ResponsibiltyList already available in the Event 
getResponsibiltyList:function(event_id,app_token){
   return new Promise(resolve => {
          axios.get(config.api_url+':'+config.port+'/event/responsibilty_list?token='+app_token+'&event_id='+event_id)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });        
        });
    },

                  //Services used for get  Assignment List already present
getAssignmentList:function(class_id,fromDate,toDate,page_number,title,app_token){
   return new Promise(resolve => {
        axios.get(config.api_url+':'+config.port+'/assignment/list?token='+app_token+'&class_id='+class_id+'&fromDate='+fromDate+'&toDate='+toDate+'&page_number='+page_number+'&title='+title)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });        
        });
    },

                   //Services used for get Assignment Student List
getAssignmentStudentList:function(class_id,app_token){
 return new Promise(resolve => {
      axios.get(config.api_url+':'+config.port+'/assignment/studentlist?token='+app_token+'&class_id='+class_id)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });       
        });  
    }, 

                  //Services used for send Assignment Notification to the parent who are registered
sendAssignmentNotification:function(dataParam){
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
   

                     //Services used for remove Assignment 
removeAssignment:function(dataParam){
   return new Promise(resolve => {
       axios.post(config.api_url+':'+config.port+'/assignment/delete',dataParam)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });        
        });
    },


                        //Services used for load responsibility list in the Event Added already
loadresponsibility:function(member_no,app_token){
  return new Promise(resolve => {
      axios.get(config.api_url+':'+config.port+'/event_responsibilty/list?token='+app_token+'&member_no='+member_no)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });   
    }, 

                        //Services used for add responsibility in Event
addresponsibility:function(member_no,responsibilityname,token){
   return new Promise(resolve => {
       var param = {responsibilty:responsibilityname,
             member_no:member_no,
             token:token};
           axios.post(config.api_url+':'+config.port+'/event_responsibilty/save',param)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });
    },

                     //Services used for delete Event
deleteEvent:function(dataParam){
    return new Promise(resolve => {
       axios.post(config.api_url+':'+config.port+'/event/delete',dataParam)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });        
        });
    },


                  //Services used for get get Student IconList
createAssignment:function(data){
    return new Promise(resolve => {           
        axios.post(config.api_url+':'+config.port+'/assignment/update/data',data)
            .then(function (response) { 
                resolve(response);
              }
            )
            .catch((error) => {
               console.error(error);
            });         
        });    
     },
 

                 //Services used for create Event
createEvent:function(data){
      return new Promise(resolve => {           
             axios.post(config.api_url+':'+config.port+'/event/create_event',data)
             .then(function (response) { 
                 resolve(response);
               }
             )
             .catch((error) => {
                console.error(error);
             });          
         });     
      },

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
};


module.exports = teacherServices;
