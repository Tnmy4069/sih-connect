import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  leader: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  requiredMembers: {
    type: Number,
    default: 6,
    min: 0,
    max: 6
  },
  hasFemale: {
    type: Boolean,
    default: false
  },
  isFinalized: {
    type: Boolean,
    default: false
  },
  problemStatement: {
    type: String,
    default: ''
  },
  techStack: [{
    type: String
  }],
  joinRequests: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to calculate required members and check for female
TeamSchema.pre('save', async function(next) {
  if (this.isModified('members')) {
    this.requiredMembers = 6 - this.members.length;
    
    // Check if team has female member
    if (this.members.length > 0) {
      await this.populate('members', 'gender');
      this.hasFemale = this.members.some(member => member.gender === 'Female');
    } else {
      this.hasFemale = false;
    }
  }
  next();
});

export default mongoose.models.Team || mongoose.model('Team', TeamSchema);
