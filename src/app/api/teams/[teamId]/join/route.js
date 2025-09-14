import connectDB from '@/lib/db';
import Team from '@/models/Team';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function POST(request, { params }) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return Response.json({ message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return Response.json({ message: 'Invalid token' }, { status: 401 });
    }

    const { message } = await request.json();
    
    // Await params in Next.js 15
    const { teamId } = await params;

    await connectDB();

    // Check if user is already in a team
    const user = await User.findById(decoded.userId);
    if (user.teamId) {
      return Response.json({ message: 'You are already in a team' }, { status: 400 });
    }

    // Check if team exists and has slots
    const team = await Team.findById(teamId);
    if (!team) {
      return Response.json({ message: 'Team not found' }, { status: 404 });
    }

    if (team.requiredMembers <= 0) {
      return Response.json({ message: 'Team is already full' }, { status: 400 });
    }

    // Check if request already exists
    const existingRequest = team.joinRequests.find(
      req => req.user.toString() === decoded.userId && req.status === 'pending'
    );

    if (existingRequest) {
      return Response.json({ message: 'Join request already sent' }, { status: 400 });
    }

    // Add join request
    team.joinRequests.push({
      user: decoded.userId,
      message: message || '',
      status: 'pending'
    });

    await team.save();

    return Response.json({ message: 'Join request sent successfully' });

  } catch (error) {
    console.error('Join request error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
