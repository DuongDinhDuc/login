const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { response, request } = require('express')
const Userlogin = require('../models/Userlogin')

const login =(req,res,next) =>{
    var username = req.body.username
    var password = req.body.password
    console.log(password)
    Userlogin.findOne({username:username})
    .then(userlogin =>{
        if(userlogin){
            bcrypt.compare(password,userlogin.password,function(err,result){
                if(err){
                    res.json({
                        error: err
                    })
                }
                if(result){
                    User.find({},function(err,data){
                        
                        if(err) throw err;
                        res.render("home",{users:data});
                        //res.render("pages/login")  res.render("home",{users:data});
                
                    })
                }
                else{
                    res.json({
                    message:'Pw does nor matched!'
                    })
                }
                    })
                }
        else{
            res.json({
            message:'no user found'
            })
        }
    })
}

const register = (req, res, next) => {
    bcrypt.hash(req.body.password, 10, function(err, hasheedPass){
        if(err) {
            res.json({
                error: err
            })
        }
        let userlogin = new Userlogin({
            username: req.body.username,
            password: hasheedPass
        })
        userlogin.save()
        .then(userlogin => {
            res.json({
                message: 'User ctreate, you can login'
            })
        })
        .catch(error => {
            res.json({
                message: 'An error occured!'
            })
        })
    })
}

const changepass = (req,res,next) => {
    var username = req.body.username
    var password = req.body.password
    var newpassword = req.body.newpassword
    let updateData = {
        username: req.body.username,
        password: bcrypt.hashSync(req.body.newpassword,10)
    }
    Userlogin.findOne({username:username})
    .then(userlogin =>{
        if(userlogin){
            bcrypt.compare(password,userlogin.password,function(err,result){
                if(err){
                    res.json({
                        error: err
                    })
                }
                if(result){
                    Userlogin.update({$set: updateData}).then//findByIdAndUpdate(userId,{$set: updateData})
                    (res.json({
                        message:'Password reset done'
                        }))
                }
                else{
                    res.json({
                    message:'Password does not matched!'
                    })
                }
                    })
                }
        else{
            res.json({
            message:'no user found'
            })
        }
    })
}






module.exports = {
    register,login,changepass
}



