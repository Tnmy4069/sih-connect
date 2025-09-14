# SIH Connect - Team Formation Platform

A comprehensive platform for Smart India Hackathon (SIH) team formation that helps students create compliant teams and find teammates.

## 🎯 Problem Statement

Smart India Hackathon has strict rules:
- Each team must have exactly 6 members
- At least one member must be female
- There must be a team leader

But in reality:
- Some teams have only 1-5 members but want to participate
- Some students don't have any team but still want to join
- Organizers need a way to ensure teams are complete before final submission

## 🚀 Solution

SIH Connect provides:
- **Team Creation**: Leaders can create teams with 0-5 initial members
- **Individual Registration**: Students can register as individuals looking for teams
- **Smart Matching**: Browse teams with available slots and send join requests
- **SIH Compliance**: Automatic validation of team requirements
- **Team Management**: Dashboard for leaders to manage members and requests

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens
- **Styling**: TailwindCSS

## 📦 Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd sihconnect
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```
MONGODB_URI=mongodb+srv://tnmyweb:tnmyweb@cluster0.lzf50.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=your-super-secret-jwt-key-change-in-production
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🎯 Features

### For Team Leaders
- ✅ Create teams with initial members
- ✅ Manage join requests (approve/reject)
- ✅ View team member details and skills
- ✅ Finalize team when requirements are met
- ✅ Real-time validation of SIH requirements

### For Individual Students
- ✅ Register with skills and preferences
- ✅ Browse available teams with open slots
- ✅ Send join requests with personal message
- ✅ View team details before joining

### For Everyone
- ✅ User authentication and profiles
- ✅ Responsive design for all devices
- ✅ Real-time team status updates
- ✅ SIH compliance checking

## 📄 Pages Structure

- `/` - Landing page with features overview
- `/register` - User registration
- `/login` - User authentication
- `/register-choice` - Choose to create team or join team
- `/create-team` - Team creation form
- `/teams` - Browse available teams
- `/dashboard` - Team management dashboard

## 🔒 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user

### Teams
- `GET /api/teams` - Get all available teams
- `POST /api/teams` - Create new team
- `GET /api/teams/[id]` - Get team details (leader only)
- `PUT /api/teams/[id]` - Update team (approve/reject requests)
- `POST /api/teams/[id]/join` - Send join request
- `POST /api/teams/[id]/finalize` - Finalize team

## 🎨 Design Principles

- **User-Centric**: Intuitive interface for both team leaders and individuals
- **SIH Compliant**: Built-in validation for all SIH requirements
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Accessible**: Follows web accessibility best practices
- **Modern**: Clean, professional design with smooth interactions

## 🚦 Validation Rules

### Team Requirements
- ✅ Exactly 6 members required for finalization
- ✅ At least 1 female member mandatory
- ✅ Only team leader can manage the team
- ✅ Members cannot be in multiple teams

### User Requirements
- ✅ Valid email and contact information
- ✅ College and academic details
- ✅ Skills and preferences (optional)

## 🔄 User Flow

### Team Leader Flow
1. Register → Create Team → Add initial members → Manage join requests → Finalize team

### Individual Flow
1. Register → Browse teams → Send join requests → Get accepted → Team ready

## 📱 Screenshots

The application features:
- Modern landing page with feature highlights
- Clean registration and login forms
- Intuitive team browsing interface
- Comprehensive team management dashboard
- Mobile-responsive design throughout

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For support and questions:
- Email: support@sihconnect.com
- GitHub Issues: [Create an issue](repository-url/issues)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Built with ❤️ for Smart India Hackathon participants**
