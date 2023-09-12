const mongoose = require('mongoose')

const conn = mongoose.createConnection('mongodb://0.0.0.0:27017/test')

conn.on('connected', function(){
    console.log(`mgdb:connected:: ${this.name}`)
})
conn.on('disconnected', function(){
    console.log(`mgdb:disconnected::: ${this.name}`)
})
conn.on('disconnected', function(error){
    console.log(error)
})

process.on("SIGINT",async() => {
    await conn.close()
    process.exit()
})
module.exports = conn