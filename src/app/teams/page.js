'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function Teams() {
  const { user } = useAuth();
  const router = useRouter();
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [joinLoading, setJoinLoading] = useState({});

  useEffect(() => {
    fetchTeams();
  }, []);

  const fetchTeams = async () => {
    try {
      const response = await fetch('/api/teams');
      const data = await response.json();

      if (response.ok) {
        setTeams(data);
      } else {
        setError('Failed to fetch teams');
      }
    } catch (error) {
      setError('Network error occurred');
    }
    setLoading(false);
  };

  const handleJoinRequest = async (teamId) => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (user.teamId) {
      setError('You are already in a team');
      return;
    }

    setJoinLoading(prev => ({ ...prev, [teamId]: true }));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/teams/${teamId}/join`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          message: `Hi! I'd like to join your team. My skills: ${user.skills?.join(', ') || 'Not specified'}`
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Join request sent successfully!');
        fetchTeams(); // Refresh teams
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Network error occurred');
    }

    setJoinLoading(prev => ({ ...prev, [teamId]: false }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600">Available Teams</h1>
            <div className="space-x-4">
              {user ? (
                <>
                  <button
                    onClick={() => router.push('/dashboard')}
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={() => router.push('/create-team')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Create Team
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => router.push('/login')}
                    className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Login
                  </button>
                  <button
                    onClick={() => router.push('/register')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                  >
                    Register
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        <div className="mb-8">
          <h2 className="text-lg font-medium text-gray-900 mb-2">
            Teams Looking for Members ({teams.length})
          </h2>
          <p className="text-gray-600">
            Find teams that need members and send join requests
          </p>
        </div>

        {teams.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No teams available</h3>
            <p className="mt-1 text-sm text-gray-500">
              Be the first to create a team!
            </p>
            <div className="mt-6">
              <button
                onClick={() => router.push('/create-team')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Create Team
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teams.map((team) => (
              <div key={team._id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">{team.name}</h3>
                  <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    Need {team.requiredMembers}
                  </span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {team.description}
                </p>

                <div className="space-y-3 mb-4">
                  <div>
                    <span className="text-xs font-medium text-gray-500">LEADER</span>
                    <p className="text-sm text-gray-900">{team.leader.name}</p>
                    <p className="text-xs text-gray-500">{team.leader.college}</p>
                  </div>

                  <div>
                    <span className="text-xs font-medium text-gray-500">CURRENT MEMBERS</span>
                    <p className="text-sm text-gray-900">{team.members.length}/6</p>
                    {team.hasFemale && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Has female member
                      </span>
                    )}
                  </div>

                  {team.techStack && team.techStack.length > 0 && (
                    <div>
                      <span className="text-xs font-medium text-gray-500">TECH STACK</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {team.techStack.slice(0, 3).map((tech, index) => (
                          <span key={index} className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">
                            {tech}
                          </span>
                        ))}
                        {team.techStack.length > 3 && (
                          <span className="text-xs text-gray-500">+{team.techStack.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <button
                  onClick={() => handleJoinRequest(team._id)}
                  disabled={!user || user.teamId || joinLoading[team._id]}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-2 px-4 rounded-md text-sm font-medium transition-colors"
                >
                  {joinLoading[team._id] ? 'Sending...' : 
                   !user ? 'Login to Join' :
                   user.teamId ? 'Already in Team' : 
                   'Send Join Request'}
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
