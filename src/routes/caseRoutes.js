const express = require('express');
const router = express.Router();

const  cases = require('../data/caseStore');

router.post('/', (req, res) => {
    const { ownerId, issueDescription } = req.body;

    if (!ownerId || !issueDescription) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const newCase = {
        caseId: cases.length + 1,
        ownerId,
        issueDescription,
        createdAt: new Date(),
    };

    cases.push(newCase);

    res.status(201).json(newCase);
});

router.get('/user/:userId', (req, res) => {
    const userIdParam = req.params.userId;      // "1" (string)
    // If your stored ownerId is numeric, parse it:
    const userId = parseInt(userIdParam, 10);
  
    // Filter the in-memory cases
    const filteredCases = cases.filter((caseItem) => caseItem.ownerId === userId);
  
    // Decide if you want to return an empty array or 404 if no cases
    if (filteredCases.length === 0) {
      return res.status(404).json({ error: 'No cases found for this user' });
    }
  
    return res.json(filteredCases);
  });

module.exports = router;