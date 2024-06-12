const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const router = express.Router();


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

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


// router.post('/customers', async (req, res) => {
//    try {
//      const newCustomer = new customer(req.body);
//      const savedCustomer = await newCustomer.save();
//      res.status(201).json(savedCustomer);
//    } catch (err) {
//      res.status(400).json({ error: err.message });
//    }
//  });



//  customer.insertMany([savedCustomer])


module.exports = customer