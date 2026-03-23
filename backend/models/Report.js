const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  area: { type: String, required: true, trim: true, maxlength: 120 },
  state: { type: String, trim: true, default: 'Lagos' },
  status: { type: String, enum: ['on', 'off'], required: true },
  votes: { type: Number, default: 0, min: 0 },
  voterIps: { type: [String], default: [], select: false },
  reporterIp: { type: String, select: false },
}, { timestamps: true });

reportSchema.index({ area: 1, createdAt: -1 });
reportSchema.index({ createdAt: -1 });

reportSchema.virtual('timeAgo').get(function () {
  const s = Math.floor((Date.now() - this.createdAt) / 1000);
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
});

reportSchema.set('toJSON', { virtuals: true });
module.exports = mongoose.model('Report', reportSchema);
