const express = require('express');
const router = express.Router();
const Campaign = require('./campaign_db');
const customer= require("./customer")
const handlebars = require('handlebars');
const app = express()
const path = require('path');
const tempelatePath = path.join(__dirname, '../tempelates')
const resultsFilePath = path.join(__dirname, '../campaign_results.json');
const fs = require('fs'); // Import the fs module here


handlebars.registerHelper('eq', function(value1, value2) {
    return value1 === value2;
  });


  app.use(express.json());
  app.set('view engine', 'hbs')
  app.set('views', tempelatePath)
  app.use('/public', express.static(path.join(__dirname, '../public')));
  app.use(express.urlencoded({ extended: true }));


router.post('/message', async (req, res) => {
    try {
      const { message, campaignId } = req.body;
  
      // Find the campaign by ID
      const campaign = await Campaign.findById(campaignId);
  
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }
  
      // Get the customer IDs from the campaign
      const customerIds = campaign.customers;
  
      // Find customers by their IDs and map to names
      const customers = await customer.find({ _id: { $in: customerIds } });
      const customerNames = customers.map(customer => customer.name);
  
      const results = [];
  
      // Send the message to each customer
      for (const name of customerNames) {
        // Determine if the message is sent or failed (90% chance of success)
        const status = Math.random() < 0.9 ? 'sent' : 'failed';
  
        // Send the message
        sendMessage(name, message, status);
  
        // Store the result
        // results.push({ name, status });

        const customer = customers.find(c => c.name === name);
        results.push({ name: customer.name, email: customer.email, status, campaignId });
      }

      let existingResults = [];
      if (fs.existsSync(resultsFilePath)) {
          const data = fs.readFileSync(resultsFilePath, 'utf8');
          existingResults = JSON.parse(data);
      }
  
    existingResults.push(...results);

    // Write updated results back to the file
    fs.writeFileSync(resultsFilePath, JSON.stringify(existingResults, null, 2), 'utf8');

    res.render('status', { results: existingResults });
    } catch (err) {
      console.error('Error sending messages:', err);
      res.status(500).json({ error: 'Failed to send messages' });
    }
  });

  router.get('/results', (req, res) => {
    try {
        // Read existing results from the file
        let results = [];
        if (fs.existsSync(resultsFilePath)) {
            const data = fs.readFileSync(resultsFilePath, 'utf8');
            results = JSON.parse(data);
        }

        res.render('status', { results });
    } catch (err) {
        console.error('Error reading results:', err);
        res.status(500).json({ error: 'Failed to retrieve results' });
    }
});

module.exports = router;

// Helper function to send the message to a customer
function sendMessage(customer, message) {
  // Implement your logic to send the message to the customer
  // using their preferred communication method (email, SMS, push notification, etc.)
  console.log(`Sending message "${message}" to customer ${customer.name}`);
}

module.exports = router;