const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

router.get('/summary', async (req, res) => {
  try {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);

    const pipeline = [
      { $match: { createdAt: { $gte: threeHoursAgo } } },
      {
        $group: {
          _id: { area: { $toLower: '$area' }, status: '$status' },
          area: { $first: '$area' },
          state: { $first: '$state' },
          count: { $sum: 1 },
          lastReport: { $max: '$createdAt' },
        }
      },
      {
        $group: {
          _id: '$_id.area',
          area: { $first: '$area' },
          state: { $first: '$state' },
          statuses: { $push: { status: '$_id.status', count: '$count' } },
          totalReports: { $sum: '$count' },
          lastReport: { $max: '$lastReport' },
        }
      },
      { $sort: { totalReports: -1 } },
    ];

    const results = await Report.aggregate(pipeline);
    const areas = results.map(r => {
      const onCount = r.statuses.find(s => s.status === 'on')?.count || 0;
      const offCount = r.statuses.find(s => s.status === 'off')?.count || 0;
      return {
        area: r.area,
        state: r.state,
        status: onCount >= offCount ? 'on' : 'off',
        onCount, offCount,
        totalReports: r.totalReports,
        lastReport: r.lastReport,
        confidence: Math.round((Math.max(onCount, offCount) / r.totalReports) * 100),
      };
    });

    res.json({ success: true, areas });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/stats', async (req, res) => {
  try {
    const threeHoursAgo = new Date(Date.now() - 3 * 60 * 60 * 1000);
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const [recentAreas, totalReports, last24h] = await Promise.all([
      Report.aggregate([
        { $match: { createdAt: { $gte: threeHoursAgo } } },
        { $sort: { createdAt: -1 } },
        { $group: { _id: { $toLower: '$area' }, status: { $first: '$status' } } },
      ]),
      Report.countDocuments(),
      Report.countDocuments({ createdAt: { $gte: oneDayAgo } }),
    ]);

    res.json({
      success: true,
      stats: {
        totalReports,
        last24h,
        areasOn: recentAreas.filter(a => a.status === 'on').length,
        areasOff: recentAreas.filter(a => a.status === 'off').length,
        areasReporting: recentAreas.length,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
