const mongoose=require('mongoose')

const schema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    age:{
        type:String,
        required:true
    }
})

module.exports=mongoose.model('friends',schema)