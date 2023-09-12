const express = require('express')
const createError = require('http-errors')
const route = express.Router()

const User = require('../models/user.model')

route.post('/register', async (req,res,next) => {
    try{
        const {email, password} = req.body
        if(!email, !password){
            throw createError.BadRequest()
        }
        const isExits = await User.findOne({
            username: email
        })
        if(isExits){
            throw createError.Conflict(`${email} is already been registered`)
        }
        const isCreate = await User.create({
            username: email,
            password
        })
        return res.json({
            status: 'okay',
            elements: isCreate
        })
    }catch(error){
        next (error)
    }
})
route.post('/refresh-token',(req,res,next) => {
    res.send('function refresh-token')
})
route.post('/login',(req,res,next) => {
    res.send('function login')
})

route.post('/logout',(req,res,next) => {
    res.send('function logout')
})


module.exports = route