const JWT = require('jsonwebtoken')
const createError = require('http-errors')
const client = require('../helpers/connections_redis')
const signAccessToken = async(userId)=>{
    return new Promise((resolve, reject) => {
        const payload = {
            userId
        }
        const secret = process.env.ACCESS_TOKEN_SECRET
        const options = {
            expiresIn: '1h'
        }
        JWT.sign(payload, secret, options, (err,token) => {
            if(err) reject(err)
            resolve(token)
        })
    })
}
const signRefreshToken = async(userId)=>{
    return new Promise((resolve, reject) => {
        const payload = {
            userId
        }
        const secret = process.env.REFRESH_TOKEN_SECRET
        const options = {
            expiresIn: '1y'
        }
        JWT.sign(payload, secret, options, (err,token) => {
            if(err) reject(err)
            client.set(userId.toString(), token,'EX' ,365*24*60*60, (err,reply) => {
                if(err){
                    return reject(createError.InternalServerError())
                }
                resolve(token)
            })
            resolve(token)
        })
    })
}

const verifyAccessToken = (req,res,next) => {
    if(!req.headers['authorization']){
        return next(createError.Unauthorized())
    }
    const authHeader = req.headers['authorization']
    const bearerToken = authHeader.split(' ')
    const token = bearerToken[1]
    JWT.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,payload) => {
        if(err){
            if(err === 'JsonWebTokenError'){
                return next(createError.Unauthorized())
            }
            return next(createError.Unauthorized(err.name))
        }
        req.payload = payload
        next()
    })


}

const verifyRefreshToken = async (refreshToken) => {
    return new Promise((resolve, reject) => {
        JWT.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err,payload) => {
            if(err){
                return reject(err)
            }
            resolve(payload)
        })
    })
}

module.exports = {
    signAccessToken,
    signRefreshToken,
    verifyAccessToken,
    verifyRefreshToken
}