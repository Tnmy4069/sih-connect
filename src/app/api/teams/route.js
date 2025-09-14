import connectDB from '@/lib/db';
import Team from '@/models/Team';
import User from '@/models/User';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  try {
    await connectDB();

    const teams = await Team.find({ 
      requiredMembers: { $gt: 0 },
      isFinalized: false 
    })
    .populate('leader', 'name email college')
    .populate('members', 'name email college gender')
    .sort({ createdAt: -1 });

    return Response.json(teams);

  } catch (error) {
    console.error('Fetch teams error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    console.log('Auth header:', authHeader);
    console.log('Extracted token:', token);

    if (!token) {
      console.log('No token provided in request');
      return Response.json({ message: 'No token provided' }, { status: 401 });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      console.log('Token verification failed');
      return Response.json({ message: 'Invalid token' }, { status: 401 });
    }

    console.log('Token verified, user ID:', decoded.userId);

    const { name, description, problemStatement, techStack, initialMembers } = await request.json();

    if (!name || !description) {
      return Response.json({ message: 'Name and description are required' }, { status: 400 });
    }

    await connectDB();

    // Check if user already has a team
    const user = await User.findById(decoded.userId);
    if (user.teamId) {
      return Response.json({ message: 'You are already in a team' }, { status: 400 });
    }

    // Create team
    const team = new Team({
      name,
      description,
      leader: decoded.userId,
      members: [decoded.userId], // Leader is always a member
      problemStatement: problemStatement || '',
      techStack: techStack || []
    });

    // Add initial members if provided
    if (initialMembers && initialMembers.length > 0) {
      const validMembers = await User.find({
        name: { $in: initialMembers },
        teamId: null
      });

      team.members.push(...validMembers.map(m => m._id));
    }

    await team.save();

    // Update all members' teamId
    await User.updateMany(
      { _id: { $in: team.members } },
      { teamId: team._id, lookingForTeam: false }
    );

    // Populate and return the team
    const populatedTeam = await Team.findById(team._id)
      .populate('leader', 'name email college')
      .populate('members', 'name email college gender');

    return Response.json({
      message: 'Team created successfully',
      team: populatedTeam
    }, { status: 201 });

  } catch (error) {
    console.error('Create team error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}
