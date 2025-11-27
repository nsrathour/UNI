const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const userModel = require("../models/User.js")


// function jo phele hash karega phr upload karega

mongoose.connect("mongodb://localhost:27017/UAAS")//link ko smjho UAAS ky karega edr
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err))

async function addAdminCred(){
    const admin = await userModel.create({
        email:"admin@1234",
        password : "admin1234",
        firstName : "Navditya",
        lastName : "Rathour",
        role:"admin"
    })
     
    await admin.save()//save kyu likha or await ka use kyu likha

    console.log("Admin Added")
}

addAdminCred()
