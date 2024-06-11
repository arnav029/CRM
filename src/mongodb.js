const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/mydatabase")
.then(() => {
    console.log('mongodb connected')
})

.catch(()=> {
    console.log('failed to connect')
})


const LoginSchema = new mongoose.Schema({
     email:{
        type:String,
        required:true
     },
     password:{
        type:String,
        required:true
     },

     fname:{
        type:String,
        required:true
     },

     lname:{
        type:String,
        required:true
     }
})





const collection = new mongoose.model("Collection1", LoginSchema)


module.exports =collection