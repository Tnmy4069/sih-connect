import connectDB from '@/lib/db';
import Team from '@/models/Team';
import User from '@/models/User';

// GET all teams
export async function GET(request) {
  try {
    await connectDB();

    const teams = await Team.find({})
      .populate('leader', 'name email')
      .populate('members', 'name email gender')
      .populate('joinRequests.user', 'name email')
      .sort({ createdAt: -1 });

    return Response.json(teams);

  } catch (error) {
    console.error('Admin fetch teams error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST create new team
export async function POST(request) {
  try {
    const { name, description, problemStatement, techStack, isFinalized, leaderId } = await request.json();

    // Validate required fields
    if (!name || !description) {
      return Response.json({ message: 'Team name and description are required' }, { status: 400 });
    }

    await connectDB();

    // If leaderId is provided, validate it
    let leader = null;
    if (leaderId) {
      leader = await User.findById(leaderId);
      if (!leader) {
        return Response.json({ message: 'Invalid leader ID' }, { status: 400 });
      }
      if (leader.teamId) {
        return Response.json({ message: 'Selected leader is already in a team' }, { status: 400 });
      }
    }

    // Create team
    const team = new Team({
      name,
      description,
      leader: leaderId || null,
      members: leaderId ? [leaderId] : [],
      problemStatement: problemStatement || '',
      techStack: techStack || [],
      isFinalized: isFinalized || false,
      requiredMembers: leaderId ? 5 : 6 // 6 total minus leader if leader exists
    });

    await team.save();

    // Update leader's teamId if leader exists
    if (leaderId) {
      await User.findByIdAndUpdate(leaderId, { 
        teamId: team._id, 
        lookingForTeam: false 
      });
    }

    // Populate and return the team
    const populatedTeam = await Team.findById(team._id)
      .populate('leader', 'name email')
      .populate('members', 'name email gender');

    return Response.json({
      message: 'Team created successfully',
      team: populatedTeam
    }, { status: 201 });

  } catch (error) {
    console.error('Admin create team error:', error);
    return Response.json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Team creation failed'
    }, { status: 500 });
  }
}
