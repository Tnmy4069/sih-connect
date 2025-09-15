import connectDB from '@/lib/db';
import User from '@/models/User';
import Team from '@/models/Team';

// GET single user
export async function GET(request, { params }) {
  try {
    await connectDB();
    const { userId } = await params;

    const user = await User.findById(userId)
      .populate('teamId', 'name')
      .select('-password');

    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    return Response.json(user);

  } catch (error) {
    console.error('Admin get user error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// PUT update user
export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { userId } = await params;
    const { name, email, phone, year, branch, gender, skills, lookingForTeam } = await request.json();

    // Validate required fields
    if (!name || !email || !phone || !year || !branch || !gender) {
      return Response.json({ message: 'All required fields must be provided' }, { status: 400 });
    }

    // Check if email is already taken by another user
    const existingUser = await User.findOne({ email, _id: { $ne: userId } });
    if (existingUser) {
      return Response.json({ message: 'Email is already taken by another user' }, { status: 400 });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        name,
        email,
        phone,
        year,
        branch,
        gender,
        skills: skills || [],
        lookingForTeam: lookingForTeam || false
      },
      { new: true }
    ).populate('teamId', 'name').select('-password');

    if (!updatedUser) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    return Response.json({
      message: 'User updated successfully',
      user: updatedUser
    });

  } catch (error) {
    console.error('Admin update user error:', error);
    return Response.json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'User update failed'
    }, { status: 500 });
  }
}

// DELETE user
export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { userId } = await params;

    const user = await User.findById(userId);
    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    // If user is in a team, remove them from the team
    if (user.teamId) {
      await Team.findByIdAndUpdate(user.teamId, {
        $pull: { members: userId }
      });

      // Update team's required members count
      const team = await Team.findById(user.teamId);
      if (team) {
        team.requiredMembers = Math.min(6 - team.members.length, 6);
        await team.save();
      }
    }

    // Delete the user
    await User.findByIdAndDelete(userId);

    return Response.json({ message: 'User deleted successfully' });

  } catch (error) {
    console.error('Admin delete user error:', error);
    return Response.json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'User deletion failed'
    }, { status: 500 });
  }
}
