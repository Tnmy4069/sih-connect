import connectDB from '@/lib/db';
import User from '@/models/User';
import { hashPassword, generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { name, email, password, phone, year, branch, gender, skills, lookingForTeam } = await request.json();

    console.log('Registration request data:', { name, email, phone, year, branch, gender, skills: skills?.length, lookingForTeam });

    // Validate required fields
    if (!name || !email || !password || !phone || !year || !branch || !gender) {
      return Response.json({ message: 'All fields are required' }, { status: 400 });
    }

    await connectDB();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return Response.json({ message: 'User already exists' }, { status: 400 });
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

    // Generate token
    const token = generateToken(user._id);

    // Remove password from response
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
      teamId: user.teamId
    };

    return Response.json({
      message: 'User created successfully',
      token,
      user: userResponse
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return Response.json({ 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Registration failed'
    }, { status: 500 });
  }
}
