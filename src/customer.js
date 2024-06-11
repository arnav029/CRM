const mongoose = require("mongoose")

mongoose.connect("mongodb://localhost:27017/mydatabase")
.then(() => {
    console.log('mongodb connected')
})

.catch(()=> {
    console.log('failed to connect')
})




const customerSchema = new mongoose.Schema({
   email:{
      type:String,
      required:true
   },
   name:{
      type:String,
      required:true
   },

   lastVisit:{
      type: Date,
      required:true
   },

   noOfVisits:{
      type:Number,
      required:true
   },

   totalSpends:{
      type: Number,
      required:true
   }
})
// const data = {
//     email: 'rahul@gmail.com',
//     name:'Rahul Singh' ,
//     lastVisit: new Date("2023-01-10"),
//     noOfVisits:3 ,
//     totalSpends: 13000
//   }



const customer = new mongoose.model("customer", customerSchema)
//  customer.insertMany([data])


module.exports = customer