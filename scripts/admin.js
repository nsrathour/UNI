const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const userModel = require("../models/User.js")


// function jo phele hash karega phr upload karega

mongoose.connect("mongodb://localhost:27017/UAAS")//link ko smjho UAAS ky karega edr
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err))

async function addAdminCred(){

    //salt value 10 time bcrypr your password by bycrpt library
    //hash function used to hash password

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash("12345" , salt)
    const admin = await userModel.create({
        email:"admin@12345",
        password : hashedPassword,
        firstName : "Navditya",
        lastName : "Rathour",
        role:"admin"
    })
     
    await admin.save()//save kyu likha or await ka use kyu likha

    console.log("Admin Added")
}

addAdminCred()
