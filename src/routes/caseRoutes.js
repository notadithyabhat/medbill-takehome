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


router.put('/:caseId/close', (req, res) => {
  const caseId = parseInt(req.params.caseId, 10);
  const existingCase = cases.find((caseItem) => caseItem.caseId === caseId);
  if (!existingCase) {
    return res.status(404).json({ error: 'Case not found' });
  }
  existingCase.status = 'closed';
  return res.json(existingCase);
});

router.put('/:caseId/reopen', (req, res) => {
  const caseId = parseInt(req.params.caseId, 10);
  const existingCase = cases.find((caseItem) => caseItem.caseId === caseId);
  if (!existingCase) {
    return res.status(404).json({ error: 'Case not found' });
  }
  if (existingCase.status === 'open') {
    return res.status(400).json({ error: 'Case is already open' });
  }
  existingCase.status = 'open';
  return res.json(existingCase);
});

router.get('/user/:userId', (req, res) => {
  const userId = parseInt(req.params.userId, 10);
  const filteredCases = cases.filter((caseItem) => caseItem.ownerId === userId && caseItem.status === 'open');
  if (filteredCases.length === 0) {
    return res.status(404).json({ error: 'No cases found for this user' });
  }
  return res.json(filteredCases);
});

router.put('/:caseId/escalate', (req, res) => {
  const caseId = parseInt(req.params.caseId, 10);
  const existingCase = cases.find(c => c.caseId === caseId);
  if (!existingCase) {
    return res.status(404).json({ error: 'Case not found' });
  }
  existingCase.escalated = true;

  io = req.app.get('io');
  io.emit('case-escalated', existingCase);

  return res.json(existingCase);
});

module.exports = router;
