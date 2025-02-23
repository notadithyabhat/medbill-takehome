const express = require('express');
const router = express.Router();

const Case = require('../models/Case');
const { cases } = require('../data/caseStore');

router.post('/', (req, res) => {
  const { ownerId, issueDescription } = req.body;
  if (!ownerId || !issueDescription) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const newCase = new Case(cases.length + 1, ownerId, issueDescription);
  cases.push(newCase);
  res.status(201).json(newCase);
});

router.get('/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const filteredCases = cases.filter((caseItem) => caseItem.ownerId === userId);
  if (filteredCases.length === 0) {
    return res.status(404).json({ error: 'No cases found for this user' });
  }
  return res.json(filteredCases);
});

module.exports = router;
