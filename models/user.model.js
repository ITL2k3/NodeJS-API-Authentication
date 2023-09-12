const mongoose = require('mongoose')
const {Schema} = require('mongoose')
const {testConnection, UserConnection} = require('../helpers/connections_multi_mongodb')

const UseSchema = new Schema ({
    username: {
        type: String,
        lowercase: true,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
})




module.exports = testConnection.model('users',UseSchema)