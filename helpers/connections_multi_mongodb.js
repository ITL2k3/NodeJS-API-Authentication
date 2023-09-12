const mongoose = require('mongoose')
function newConnection(uri){
    const conn = mongoose.createConnection(uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    })
    conn.on('connected', function(){
        console.log(`mgdb:connected:: ${this.name}`)
    })
    conn.on('disconnected', function(){
        console.log(`mgdb:disconnected::: ${this.name}`)
    })
    conn.on('disconnected', function(error){
        console.log(error)
    })
    return conn
    
}

//make connection to DB test 
const testConnection = newConnection('mongodb://0.0.0.0:27017/test')
const UserConnection = newConnection('mongodb://0.0.0.0:27017/user')

module.exports = {
    testConnection,
    UserConnection
}