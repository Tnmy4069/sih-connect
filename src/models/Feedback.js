import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['bug', 'feature', 'improvement', 'issue', 'other']
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    default: 'not provided',
    trim: true
  },
  priority: {
    type: String,
    default: 'medium',
    enum: ['low', 'medium', 'high', 'urgent']
  },
  status: {
    type: String,
    default: 'open',
    enum: ['open', 'in-progress', 'resolved', 'closed']
  },
  userAgent: String,
  ip: String,
  response: {
    type: String,
    default: ''
  },
  responseBy: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Create index for better search performance
feedbackSchema.index({ type: 1, status: 1, createdAt: -1 });

export default mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
