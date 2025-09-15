import connectDB from '@/lib/db';
import User from '@/models/User';
import { hashPassword } from '@/lib/auth';

// GET all users
export async function GET(request) {
  try {
    await connectDB();

    const users = await User.find({})
      .populate('teamId', 'name')
      .sort({ createdAt: -1 })
      .select('-password'); // Exclude password from response

    return Response.json(users);

  } catch (error) {
    console.error('Admin fetch users error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST create new user
export async function POST(request) {
  try {
    const { name, email, password, phone, year, branch, gender, skills, lookingForTeam } = await request.json();

    // Validate required fields
    if (!name || !email || !password || !phone || !year || !branch || !gender) {
      return Response.json({ message: 'All required fields must be provided' }, { status: 400 });
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ message: 'User with this email already exists' }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = new User({
      name,
      email,
      password: hashedPassword,
      phone,
      year,
      branch,
      gender,
      skills: skills || [],
      lookingForTeam: lookingForTeam || false
    });

    await user.save();

    // Return user without password
    const userResponse = {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      year: user.year,
      branch: user.branch,
      gender: user.gender,
      skills: user.skills,
      lookingForTeam: user.lookingForTeam,
      teamId: user.teamId,
      createdAt: user.createdAt
    };

    return Response.json({
      message: 'User created successfully',
      user: userResponse
    }, { status: 201 });

  } catch (error) {
    console.error('Admin create user error:', error);
    return Response.json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'User creation failed'
    }, { status: 500 });
  }
}
