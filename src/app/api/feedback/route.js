import connectDB from '@/lib/db';

// Simple Feedback schema using MongoDB directly
const createFeedback = async (feedbackData) => {
  const { MongoClient } = require('mongodb');
  const client = new MongoClient(process.env.MONGODB_URI);
  
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('feedback');
    
    const feedback = {
      ...feedbackData,
      createdAt: new Date(),
      status: 'new',
      id: new Date().getTime().toString()
    };
    
    const result = await collection.insertOne(feedback);
    return result;
  } finally {
    await client.close();
  }
};

export async function POST(request) {
  try {
    const { type, name, subject, message, email, priority } = await request.json();

    // Validate required fields
    if (!type || !name || !subject || !message) {
      return Response.json({ 
        message: 'Type, name, subject, and message are required' 
      }, { status: 400 });
    }

    // Save feedback to database
    const feedbackData = {
      type,
      name,
      subject,
      message,
      email: email || 'not provided',
      priority: priority || 'medium',
      userAgent: request.headers.get('user-agent'),
      ip: request.headers.get('x-forwarded-for') || 'unknown'
    };

    await createFeedback(feedbackData);

    // Log feedback for admin (you can also send email notifications here)
    console.log('New feedback received:', {
      type,
      name,
      subject,
      email: email || 'not provided',
      timestamp: new Date().toISOString()
    });

    return Response.json({
      message: 'Feedback submitted successfully',
      success: true
    }, { status: 201 });

  } catch (error) {
    console.error('Feedback submission error:', error);
    return Response.json({ 
      message: 'Failed to submit feedback',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    }, { status: 500 });
  }
}

// GET endpoint to retrieve feedback (for admin use)
export async function GET(request) {
  try {
    const { MongoClient } = require('mongodb');
    const client = new MongoClient(process.env.MONGODB_URI);
    
    try {
      await client.connect();
      const db = client.db();
      const collection = db.collection('feedback');
      
      const feedback = await collection
        .find({})
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray();
      
      return Response.json(feedback);
    } finally {
      await client.close();
    }

  } catch (error) {
    console.error('Fetch feedback error:', error);
    return Response.json({ 
      message: 'Failed to fetch feedback' 
    }, { status: 500 });
  }
}
