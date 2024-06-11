const express = require('express');
const router = express.Router();
const Campaign = require('./campaign_db');
const Customer = require("./customer");
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs');
const resultsFilePath = path.join(__dirname, '../campaign_results.json');

handlebars.registerHelper('eq', function(value1, value2) {
  return value1 === value2;
});

// Middleware to ensure user is authenticated and email is available
function ensureAuthenticated(req, res, next) {
  if (req.session.userEmail) {
    next();
  } else {
    res.status(401).send('Unauthorized');
  }
}

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.post('/message', ensureAuthenticated, async (req, res) => {
  try {
    const { message, campaignId } = req.body;
    const userEmail = req.session.userEmail;

    const campaign = await Campaign.findById(campaignId);

    if (!campaign) {
      return res.status(404).json({ error: 'Campaign not found' });
    }

    const customerIds = campaign.customers;

    const customers = await Customer.find({ _id: { $in: customerIds } });
    const customerNames = customers.map(customer => customer.name);

    const results = [];

    for (const name of customerNames) {
      const status = Math.random() < 0.9 ? 'sent' : 'failed';

      sendMessage(name, message, status);

      const customer = customers.find(c => c.name === name);

      results.push({ name: customer.name, email: customer.email, status, campaignId, userEmail });
    }

    let existingResults = [];
    if (fs.existsSync(resultsFilePath)) {
      const data = fs.readFileSync(resultsFilePath, 'utf8');
      existingResults = JSON.parse(data);
    }

    existingResults.push(...results);

    fs.writeFileSync(resultsFilePath, JSON.stringify(existingResults, null, 2), 'utf8');

    const userResults = existingResults.filter(result => result.userEmail === userEmail);

    res.render('status', { results: userResults });
  } catch (err) {
    console.error('Error sending messages:', err);
    res.status(500).json({ error: 'Failed to send messages' });
  }
});

router.get('/results', ensureAuthenticated, (req, res) => {
  try {
    const userEmail = req.session.userEmail;

    let results = [];
    if (fs.existsSync(resultsFilePath)) {
      const data = fs.readFileSync(resultsFilePath, 'utf8');
      results = JSON.parse(data);
    }

    const userResults = results.filter(result => result.userEmail === userEmail);

    res.render('status', { results: userResults });
  } catch (err) {
    console.error('Error reading results:', err);
    res.status(500).json({ error: 'Failed to retrieve results' });
  }
});

function sendMessage(customer, message) {
  console.log(`Sending message "${message}" to customer ${customer.name}`);
}

module.exports = router;
