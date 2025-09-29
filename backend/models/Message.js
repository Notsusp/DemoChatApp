const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true
  },
  text: {
    type: String,
    required: true,
    maxlength: 500
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
messageSchema.index({ timestamp: -1 });

module.exports = mongoose.model('Message', messageSchema);
