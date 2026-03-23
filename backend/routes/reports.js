const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// GET all reports
router.get('/', async (req, res) => {
  try {
    const { area, limit = 60, page = 1 } = req.query;
    const query = {};
    if (area) query.area = { $regex: new RegExp(`^${area}$`, 'i') };
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [reports, total] = await Promise.all([
      Report.find(query).sort({ createdAt: -1 }).limit(parseInt(limit)).skip(skip).select('-voterIps -reporterIp'),
      Report.countDocuments(query),
    ]);
    res.json({ success: true, reports, total });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST new report — also handles status UPDATE for same area
router.post('/', async (req, res) => {
  try {
    const { area, state, status } = req.body;
    if (!area || !status) return res.status(400).json({ success: false, error: 'Area and status required' });
    if (!['on', 'off'].includes(status)) return res.status(400).json({ success: false, error: 'Invalid status' });

    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'unknown';

    // Check if same IP reported same area within 3 minutes — if so UPDATE instead of block
    const threeMinsAgo = new Date(Date.now() - 3 * 60 * 1000);
    const recent = await Report.findOne({
      area: { $regex: new RegExp(`^${area}$`, 'i') },
      reporterIp: ip,
      createdAt: { $gte: threeMinsAgo },
    }).select('+reporterIp');

    if (recent) {
      // Allow update if status changed
      if (recent.status === status) {
        return res.status(429).json({ success: false, error: 'You already reported this area recently.' });
      }
      recent.status = status;
      recent.createdAt = new Date();
      await recent.save();
      const safe = recent.toJSON();
      delete safe.reporterIp;
      return res.json({ success: true, report: safe, updated: true });
    }

    const report = await Report.create({ area: area.trim(), state: state || 'Lagos', status, reporterIp: ip });
    const safe = report.toJSON();
    delete safe.reporterIp;
    res.status(201).json({ success: true, report: safe, updated: false });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// PATCH upvote
router.patch('/:id/upvote', async (req, res) => {
  try {
    const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'unknown';
    const report = await Report.findById(req.params.id).select('+voterIps');
    if (!report) return res.status(404).json({ success: false, error: 'Not found' });

    const alreadyVoted = report.voterIps.includes(ip);
    if (alreadyVoted) {
      report.voterIps = report.voterIps.filter(v => v !== ip);
      report.votes = Math.max(0, report.votes - 1);
    } else {
      report.voterIps.push(ip);
      report.votes += 1;
    }
    await report.save();
    res.json({ success: true, votes: report.votes, voted: !alreadyVoted });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
