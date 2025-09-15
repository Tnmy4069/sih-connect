import connectDB from '@/lib/db';
import Team from '@/models/Team';
import User from '@/models/User';

// GET single team
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { teamId } = await params;

    const team = await Team.findById(teamId)
      .populate('leader', 'name email')
      .populate('members', 'name email gender phone year branch skills')
      .populate('joinRequests.user', 'name email gender phone year branch skills');

    if (!team) {
      return Response.json({ message: 'Team not found' }, { status: 404 });
    }

    return Response.json(team);

  } catch (error) {
    console.error('Admin get team error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT update team
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { teamId } = await params;
    const { name, description, problemStatement, techStack, isFinalized } = await request.json();

    // Validate required fields
    if (!name || !description) {
      return Response.json({ message: 'Team name and description are required' }, { status: 400 });
    }

    const updatedTeam = await Team.findByIdAndUpdate(
      teamId,
      {
        name,
        description,
        problemStatement: problemStatement || '',
        techStack: techStack || [],
        isFinalized: isFinalized || false
      },
      { new: true }
    )
    .populate('leader', 'name email')
    .populate('members', 'name email gender')
    .populate('joinRequests.user', 'name email');

    if (!updatedTeam) {
      return Response.json({ message: 'Team not found' }, { status: 404 });
    }

    return Response.json({
      message: 'Team updated successfully',
      team: updatedTeam
    });

  } catch (error) {
    console.error('Admin update team error:', error);
    return Response.json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Team update failed'
    }, { status: 500 });
  }
}

// DELETE team
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { teamId } = await params;

    const team = await Team.findById(teamId);
    if (!team) {
      return Response.json({ message: 'Team not found' }, { status: 404 });
    }

    // Remove teamId from all members
    await User.updateMany(
      { teamId: teamId },
      { 
        $unset: { teamId: 1 },
        lookingForTeam: true 
      }
    );

    // Delete the team
    await Team.findByIdAndDelete(teamId);

    return Response.json({ message: 'Team deleted successfully' });

  } catch (error) {
    console.error('Admin delete team error:', error);
    return Response.json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Team deletion failed'
    }, { status: 500 });
  }
}
