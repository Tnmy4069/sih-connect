import connectDB from '@/lib/db';
import Team from '@/models/Team';
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

    await connectDB();

    const team = await Team.findById(params.teamId).populate('members', 'gender');

    if (!team) {
      return Response.json({ message: 'Team not found' }, { status: 404 });
    }

    // Check if user is the leader
    if (team.leader.toString() !== decoded.userId) {
      return Response.json({ message: 'Unauthorized' }, { status: 403 });
    }

    // Validation checks
    if (team.members.length !== 6) {
      return Response.json({ 
        message: `Team must have exactly 6 members. Current: ${team.members.length}` 
      }, { status: 400 });
    }

    if (!team.hasFemale) {
      return Response.json({ 
        message: 'Team must have at least one female member' 
      }, { status: 400 });
    }

    // Finalize team
    team.isFinalized = true;
    await team.save();

    return Response.json({ 
      message: 'Team finalized successfully!',
      team 
    });

  } catch (error) {
    console.error('Finalize team error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
