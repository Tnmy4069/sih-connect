import connectDB from '@/lib/db';
import Team from '@/models/Team';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(request, { params }) {
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

    // Await params in Next.js 15
    const { teamId } = await params;
    const team = await Team.findById(teamId)
      .populate('leader', 'name email')
      .populate('members', 'name email gender phone year branch skills')
      .populate('joinRequests.user', 'name email gender phone year branch skills');

    if (!team) {
      return Response.json({ message: 'Team not found' }, { status: 404 });
    }

    // Check if user is the leader
    if (team.leader._id.toString() !== decoded.userId) {
      return Response.json({ message: 'Unauthorized' }, { status: 403 });
    }

    return Response.json(team);

  } catch (error) {
    console.error('Get team error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
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

    const { action, requestId } = await request.json();

    await connectDB();

    const team = await Team.findById(params.teamId).populate('members', 'gender');

    if (!team) {
      return Response.json({ message: 'Team not found' }, { status: 404 });
    }

    // Check if user is the leader
    if (team.leader.toString() !== decoded.userId) {
      return Response.json({ message: 'Unauthorized' }, { status: 403 });
    }

    const joinRequest = team.joinRequests.id(requestId);
    if (!joinRequest) {
      return Response.json({ message: 'Join request not found' }, { status: 404 });
    }

    if (action === 'approve') {
      // Check if team has space
      if (team.requiredMembers <= 0) {
        return Response.json({ message: 'Team is already full' }, { status: 400 });
      }

      // Add user to team
      team.members.push(joinRequest.user);
      joinRequest.status = 'approved';

      // Update user
      await User.findByIdAndUpdate(joinRequest.user, {
        teamId: team._id,
        lookingForTeam: false
      });

    } else if (action === 'reject') {
      joinRequest.status = 'rejected';
    }

    await team.save();

    // Return updated team
    const updatedTeam = await Team.findById(team._id)
      .populate('leader', 'name email')
      .populate('members', 'name email gender phone year branch skills')
      .populate('joinRequests.user', 'name email gender phone year branch skills');

    return Response.json(updatedTeam);

  } catch (error) {
    console.error('Update team error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
