const mongoose = require("mongoose")

//command for using mongoose to create schema
const userSchema =new  mongoose.Schema({
    email : {
        type : String,
        required : true,
        unique:true
    } , 
    password : {
       type : String ,//ye string or num dono ke lye valid haii 
       required : true , 
    } , 
    firstName : {
        type : String ,
        required : true
    },
    lastName : {
        type : String ,
        // required : true
    },
    role : {
        type  : String ,
        enum : ['admin' , 'student' , 'professor' , 'HOD'],
        default : 'student'
    },
    department : {
        type : String 
    }, 
    isActive  : {
        type : Boolean ,
        default : true
    }
} , {
    timestamps : true //why we have written this ?
//Automatically add two fields in every document:
// createdAt - kab document create hua
// updatedAt - kab last time update hua
})

const userModel = mongoose.model("uaauser" , userSchema)//jo string mea likha hai uske name se collection banegi

module.exports = userModel