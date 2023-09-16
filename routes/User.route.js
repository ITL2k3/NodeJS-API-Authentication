const express = require('express')
const createError = require('http-errors')
const route = express.Router()

const User = require('../models/user.model')
const {userValidate} = require('../helpers/validation')
const { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken } = require('../helpers/jwt_service')
 
route.post('/register', async (req,res,next) => {
    try{
        const {email, password} = req.body
        const {error} = userValidate(req.body)
        console.log(`error validation:`,error)
        if(error){
            throw createError(error.details[0].message)
        }
        // if(!email, !password){
        //     throw createError.BadRequest()
        // }
        
        const isExits = await User.findOne({
            email: email
        })
        if(isExits){
            throw createError.Conflict(`${email} is already been registered`)
        }
        const user = new User ({
            email,
            password
        })
        const savedUser = await  user.save()
        return res.json({
            status: 'okay',
            elements: savedUser
        })
    }catch(error){
        next (error)
    }
})
route.post('/refresh-token',async (req,res,next) => {
    try{
        const refreshToken = req.body['refreshToken']
        console.log(refreshToken)
        if(!refreshToken) throw createError.BadRequest()
        const {userId} = await verifyRefreshToken(refreshToken)
        const accessToken = await signAccessToken(userId)
        const refToken = await signRefreshToken(userId)

        res.json({
            accessToken,
            refToken
        })
    }catch (error){
        next(error)
    }
})
route.post('/login',async (req,res,next) => {
    try{
        const {error} = userValidate(req.body)
        if(error){
            throw createError(error.details[0].message)
        }
        const {email, password} = req.body
        const user = await User.findOne({email})
        if(!user){
            throw createError.NotFound('email not found')
        }
        const isValid = await user.isCheckPassword(password)
        if(!isValid){
            throw createError.Unauthorized()
        }
        const accessToken = await signAccessToken(user._id)
        const refresToken = await signRefreshToken(user._id)
        return res.json({
            accessToken,
            refresToken
        })


    }catch(error){
        next(error)
    }
})

route.post('/logout',(req,res,next) => {
    res.send('function logout')
})
route.get('/getlists',verifyAccessToken,(req,res,next) => {
    console.log(req.headers)
    const listUsers = [
        {
            email: 'abc@gmail.com'
        },
        {
            email: 'def@gmail.com'
        }
    ]
    res.json({listUsers})
})


module.exports = route