
const express = require('express')   
const app = express()
const hbs = require('hbs')  
const path = require('path');
const router = express.Router()
const tempelatePath = path.join(__dirname, '../tempelates')
const fs = require('fs');
const campaignsFilePath = path.join(__dirname, 'campaign.json');
const mongoose = require('mongoose')
const url = 'mongodb://localhost:27017';
const dbName = 'mydatabase';
// const collectionName = 'customers';
const customer= require("./customer")
const Campaign = require('./campaign_db');

mongoose.connect("mongodb://localhost:27017/mydatabase")
.then(() => {
    console.log('mongodb connected')
})

.catch(()=> {
    console.log('failed to connect')
})

app.use(express.json());
app.set('view engine', 'hbs')
app.set('views', tempelatePath)
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use(express.urlencoded({ extended: true }));

if (!fs.existsSync(campaignsFilePath)) {
    fs.writeFileSync(campaignsFilePath, '[]', 'utf8');
}
//Connecting database
mongoose.connect('mongodb://localhost:27017/mydatabase', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection failed:', err));

//First case
router.get('/spends-over-10000', async (req, res) => {
    try {
      const customers = await customer.find({ totalSpends: { $gt: 10000 } });   
      const customerIds = customers.map(customer => customer._id);
      const userEmail = req.currentUserEmail; // Get the authenticated user's email
      if (!customers.length) {
        return res.status(200).json({ message: 'No customers found spending over 10000 INR' });
      }
      if (!userEmail) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      const campaign = new Campaign({ customers: customerIds, userEmail  });
      await campaign.save();
  
      res.render("message")


    } catch (err) {
      console.error('Error retrieving customers:', err);
      res.status(500).json({ error: 'Failed to retrieve customers' });
    }
  });





//Second case
  router.get('/spends-over-10000-visits-max-3', async (req, res) => {
    try {

      
      const customers = await customer.find({ totalSpends: { $gt: 10000 }, noOfVisits: { $lte: 3 } });   
      const customerIds = customers.map(customer => customer._id);
      const userEmail = req.currentUserEmail; // Get the authenticated user's email

      if (!customers.length) {
        return res.status(200).json({ message: 'No customers found spending over 10000 INR and visited maximum 3 times' });
      }

      const campaign = new Campaign({ customers: customerIds, userEmail });
      await campaign.save();
      
      res.render("message")

    } catch (err) {
      console.error('Error retrieving customers:', err);
      res.status(500).json({ error: 'Failed to retrieve customers' });
    }
  });


  router.get('/not-visited-last-3-months', async (req, res) => {
    try {
      const today = new Date();
      const threeMonthsAgo = new Date(today.getFullYear(), today.getMonth() - 3, 1); 
      const customers = await customer.find({
        lastVisit: {
          $lte: threeMonthsAgo 
        }
      });
    
      if (!customers.length) {
        return res.status(200).json({ message: 'No customers found not visited in the last 3 months' });
      }
    
      const customerIds = customers.map(customer => customer._id);
      const userEmail = req.currentUserEmail; // Get the authenticated user's email
      const campaign = new Campaign({ customers: customerIds, userEmail });
      await campaign.save();
    
      res.render("message")
  
    } catch (err) {
      console.error('Error retrieving customers:', err);
      res.status(500).json({ error: 'Failed to retrieve customers' });
    }
  });
  


// Retrieve all campaigns
  router.get('/all-campaigns', async (req, res) => {
    try {
        const userEmail = req.currentUserEmail;

        if (!userEmail) {
          return res.status(401).json({ error: 'Unauthorized' });
        }

        const campaigns = await Campaign.find({ userEmail }).populate('customers').exec();
        // const campaigns = await Campaign.find().populate('customers').exec();
        res.render('all', { campaigns });
    //   const campaigns = await Campaign.find().populate('customers');
    //   res.status(200).json(campaigns);
    } catch (err) {
      console.error('Error retrieving campaigns:', err);
      res.status(500).json({ error: 'Failed to retrieve campaigns' });
    }
  });

module.exports = router;


