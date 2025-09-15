'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

export default function AdminDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [feedback, setFeedback] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editingTeam, setEditingTeam] = useState(null);
  const [showCreateUser, setShowCreateUser] = useState(false);
  const [showCreateTeam, setShowCreateTeam] = useState(false);

  // Form states
  const [userForm, setUserForm] = useState({
    name: '',
    email: '',
    phone: '',
    year: '',
    branch: '',
    gender: '',
    skills: '',
    lookingForTeam: false
  });

  const [teamForm, setTeamForm] = useState({
    name: '',
    description: '',
    problemStatement: '',
    techStack: '',
    isFinalized: false
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, teamsRes, feedbackRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/teams'),
        fetch('/api/feedback')
      ]);

      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }

      if (teamsRes.ok) {
        const teamsData = await teamsRes.json();
        setTeams(teamsData);
      }

      if (feedbackRes.ok) {
        const feedbackData = await feedbackRes.json();
        setFeedback(feedbackData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  // User CRUD operations
  const handleCreateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userForm,
          skills: userForm.skills.split(',').map(s => s.trim()).filter(s => s),
          password: 'defaultpassword123' // Default password for admin-created users
        })
      });

      if (response.ok) {
        await fetchData();
        setShowCreateUser(false);
        resetUserForm();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create user');
      }
    } catch (error) {
      setError('Error creating user');
    }
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/admin/users/${editingUser._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...userForm,
          skills: userForm.skills.split(',').map(s => s.trim()).filter(s => s)
        })
      });

      if (response.ok) {
        await fetchData();
        setEditingUser(null);
        resetUserForm();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update user');
      }
    } catch (error) {
      setError('Error updating user');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchData();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete user');
      }
    } catch (error) {
      setError('Error deleting user');
    }
  };

  // Team CRUD operations
  const handleCreateTeam = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...teamForm,
          techStack: teamForm.techStack.split(',').map(s => s.trim()).filter(s => s)
        })
      });

      if (response.ok) {
        await fetchData();
        setShowCreateTeam(false);
        resetTeamForm();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to create team');
      }
    } catch (error) {
      setError('Error creating team');
    }
  };

  const handleUpdateTeam = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/admin/teams/${editingTeam._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...teamForm,
          techStack: teamForm.techStack.split(',').map(s => s.trim()).filter(s => s)
        })
      });

      if (response.ok) {
        await fetchData();
        setEditingTeam(null);
        resetTeamForm();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to update team');
      }
    } catch (error) {
      setError('Error updating team');
    }
  };

  const handleDeleteTeam = async (teamId) => {
    if (!confirm('Are you sure you want to delete this team?')) return;

    try {
      const response = await fetch(`/api/admin/teams/${teamId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchData();
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to delete team');
      }
    } catch (error) {
      setError('Error deleting team');
    }
  };

  const resetUserForm = () => {
    setUserForm({
      name: '',
      email: '',
      phone: '',
      year: '',
      branch: '',
      gender: '',
      skills: '',
      lookingForTeam: false
    });
  };

  const resetTeamForm = () => {
    setTeamForm({
      name: '',
      description: '',
      problemStatement: '',
      techStack: '',
      isFinalized: false
    });
  };

  const startEditUser = (user) => {
    setEditingUser(user);
    setUserForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      year: user.year,
      branch: user.branch,
      gender: user.gender,
      skills: user.skills.join(', '),
      lookingForTeam: user.lookingForTeam
    });
  };

  const startEditTeam = (team) => {
    setEditingTeam(team);
    setTeamForm({
      name: team.name,
      description: team.description,
      problemStatement: team.problemStatement || '',
      techStack: team.techStack.join(', '),
      isFinalized: team.isFinalized
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-red-600 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-white">SIH Connect - Admin Dashboard</h1>
            <button 
              onClick={() => router.push('/')}
              className="bg-red-700 hover:bg-red-800 text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Back to Site
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
            {error}
            <button onClick={() => setError('')} className="ml-4 text-red-800 hover:text-red-900">✕</button>
          </div>
        )}

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-blue-600">{users.length}</div>
            <div className="text-gray-600">Total Users</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-green-600">{teams.length}</div>
            <div className="text-gray-600">Total Teams</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-purple-600">{teams.filter(t => t.isFinalized).length}</div>
            <div className="text-gray-600">Finalized Teams</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-3xl font-bold text-orange-600">{feedback.length}</div>
            <div className="text-gray-600">Feedback Items</div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'users'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Users Management
              </button>
              <button
                onClick={() => setActiveTab('teams')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'teams'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Teams Management
              </button>
              <button
                onClick={() => setActiveTab('feedback')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'feedback'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Feedback & Issues
              </button>
            </nav>
          </div>

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Users Management</h2>
                <button
                  onClick={() => setShowCreateUser(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Create New User
                </button>
              </div>

              {/* Users Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Academic</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Team</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.gender}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.email}</div>
                          <div className="text-sm text-gray-500">{user.phone}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{user.year}</div>
                          <div className="text-sm text-gray-500">{user.branch}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {user.teamId ? 'In Team' : user.lookingForTeam ? 'Looking' : 'No Team'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => startEditUser(user)}
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Teams Tab */}
          {activeTab === 'teams' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Teams Management</h2>
                <button
                  onClick={() => setShowCreateTeam(true)}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                >
                  Create New Team
                </button>
              </div>

              {/* Teams Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {teams.map((team) => (
                  <div key={team._id} className="bg-white border rounded-lg p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg font-semibold">{team.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        team.isFinalized ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {team.isFinalized ? 'Finalized' : 'Open'}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-4 line-clamp-3">{team.description}</p>
                    <div className="text-sm text-gray-500 mb-4">
                      <div>Members: {team.members?.length || 0}/6</div>
                      <div>Leader: {team.leader?.name}</div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditTeam(team)}
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteTeam(team._id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Feedback Tab */}
          {activeTab === 'feedback' && (
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Feedback & Issues</h2>
                <div className="text-sm text-gray-500">
                  {feedback.length} total submissions
                </div>
              </div>

              {/* Feedback List */}
              <div className="space-y-4">
                {feedback.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    No feedback submitted yet
                  </div>
                ) : (
                  feedback.map((item) => (
                    <div key={item._id || item.id} className="bg-white border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center space-x-3">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.type === 'bug' ? 'bg-red-100 text-red-800' :
                            item.type === 'feature' ? 'bg-green-100 text-green-800' :
                            item.type === 'feedback' ? 'bg-blue-100 text-blue-800' :
                            item.type === 'suggestion' ? 'bg-purple-100 text-purple-800' :
                            'bg-orange-100 text-orange-800'
                          }`}>
                            {item.type.toUpperCase()}
                          </span>
                          {item.type === 'bug' && item.priority && (
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              item.priority === 'critical' ? 'bg-red-200 text-red-900' :
                              item.priority === 'high' ? 'bg-orange-200 text-orange-900' :
                              item.priority === 'medium' ? 'bg-yellow-200 text-yellow-900' :
                              'bg-gray-200 text-gray-900'
                            }`}>
                              {item.priority.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(item.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <h4 className="font-medium text-gray-900 mb-2">{item.subject}</h4>
                      <p className="text-gray-600 text-sm mb-3">{item.message}</p>
                      
                      <div className="flex justify-between items-center text-xs text-gray-500">
                        <span>From: {item.name || 'Anonymous'} ({item.email || 'not provided'})</span>
                        <span>{new Date(item.createdAt).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User Create/Edit Modal */}
        {(showCreateUser || editingUser) && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                {editingUser ? 'Edit User' : 'Create New User'}
              </h3>
              <form onSubmit={editingUser ? handleUpdateUser : handleCreateUser} className="space-y-4">
                <input
                  type="text"
                  placeholder="Name"
                  value={userForm.name}
                  onChange={(e) => setUserForm({...userForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={userForm.email}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <input
                  type="tel"
                  placeholder="Phone"
                  value={userForm.phone}
                  onChange={(e) => setUserForm({...userForm, phone: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <select
                  value={userForm.year}
                  onChange={(e) => setUserForm({...userForm, year: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Year</option>
                  <option value="1st">1st Year</option>
                  <option value="2nd">2nd Year</option>
                  <option value="3rd">3rd Year</option>
                  <option value="4th">4th Year</option>
                  <option value="Graduate">Graduate</option>
                </select>
                <input
                  type="text"
                  placeholder="Branch"
                  value={userForm.branch}
                  onChange={(e) => setUserForm({...userForm, branch: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <select
                  value={userForm.gender}
                  onChange={(e) => setUserForm({...userForm, gender: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                <input
                  type="text"
                  placeholder="Skills (comma separated)"
                  value={userForm.skills}
                  onChange={(e) => setUserForm({...userForm, skills: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={userForm.lookingForTeam}
                    onChange={(e) => setUserForm({...userForm, lookingForTeam: e.target.checked})}
                    className="mr-2"
                  />
                  Looking for team
                </label>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    {editingUser ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateUser(false);
                      setEditingUser(null);
                      resetUserForm();
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Team Create/Edit Modal */}
        {(showCreateTeam || editingTeam) && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">
                {editingTeam ? 'Edit Team' : 'Create New Team'}
              </h3>
              <form onSubmit={editingTeam ? handleUpdateTeam : handleCreateTeam} className="space-y-4">
                <input
                  type="text"
                  placeholder="Team Name"
                  value={teamForm.name}
                  onChange={(e) => setTeamForm({...teamForm, name: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
                <textarea
                  placeholder="Description"
                  value={teamForm.description}
                  onChange={(e) => setTeamForm({...teamForm, description: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                  required
                />
                <textarea
                  placeholder="Problem Statement"
                  value={teamForm.problemStatement}
                  onChange={(e) => setTeamForm({...teamForm, problemStatement: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  rows={3}
                />
                <input
                  type="text"
                  placeholder="Tech Stack (comma separated)"
                  value={teamForm.techStack}
                  onChange={(e) => setTeamForm({...teamForm, techStack: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={teamForm.isFinalized}
                    onChange={(e) => setTeamForm({...teamForm, isFinalized: e.target.checked})}
                    className="mr-2"
                  />
                  Team is finalized
                </label>
                <div className="flex space-x-4">
                  <button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md"
                  >
                    {editingTeam ? 'Update' : 'Create'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowCreateTeam(false);
                      setEditingTeam(null);
                      resetTeamForm();
                    }}
                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 px-4 py-2 rounded-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
