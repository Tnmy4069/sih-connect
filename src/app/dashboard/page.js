'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Footer from '@/components/Footer';

export default function Dashboard() {
  const { user, logout, loading: authLoading } = useAuth();
  const router = useRouter();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState({});

  // Redirect to login if user is not authenticated
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [authLoading, user, router]);

  const fetchTeamDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      // Check if user.teamId is valid and not an object
      if (!user.teamId || typeof user.teamId !== 'string') {
        console.log('Invalid teamId in fetchTeamDetails:', user.teamId);
        setError('Invalid team ID');
        setLoading(false);
        return;
      }

      const response = await fetch(`/api/teams/${user.teamId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        setTeam(data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error('fetchTeamDetails error:', error);
      setError('Failed to fetch team details');
    }
    setLoading(false);
  };

  useEffect(() => {
    const fetchTeamDetailsEffect = async () => {
      try {
        const token = localStorage.getItem('token');
        // Check if user.teamId is valid and not an object
        if (!user.teamId || typeof user.teamId !== 'string') {
          console.log('No valid teamId found:', user.teamId);
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/teams/${user.teamId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        const data = await response.json();

        if (response.ok) {
          setTeam(data);
        } else {
          setError(data.message);
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error);
        setError('Failed to fetch team details');
      }
      setLoading(false);
    };

    // Only run when auth is done loading
    if (!authLoading && user) {
      if (user.teamId && typeof user.teamId === 'string') {
        fetchTeamDetailsEffect();
      } else {
        setLoading(false);
      }
    } else if (!authLoading && !user) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const handleJoinRequest = async (requestId, action) => {
    setActionLoading(prev => ({ ...prev, [requestId]: true }));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/teams/${team._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action,
          requestId
        })
      });

      const data = await response.json();

      if (response.ok) {
        setTeam(data);
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Network error occurred');
    }

    setActionLoading(prev => ({ ...prev, [requestId]: false }));
  };

  const handleFinalizeTeam = async () => {
    if (!confirm('Are you sure you want to finalize your team? This action cannot be undone.')) {
      return;
    }

    setActionLoading(prev => ({ ...prev, finalize: true }));

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/teams/${team._id}/finalize`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (response.ok) {
        alert('Team finalized successfully! Your team is now ready for SIH submission.');
        fetchTeamDetails();
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError('Network error occurred');
    }

    setActionLoading(prev => ({ ...prev, finalize: false }));
  };

  // Show loading if auth is loading OR if we're loading team details
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Don't render anything if user is not authenticated
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-indigo-600">Dashboard</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <button
                onClick={() => router.push('/teams')}
                className="text-gray-700 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium"
              >
                Browse Teams
              </button>
              <button
                onClick={logout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Logout
              </button>
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

        {!user.teamId ? (
          // No team state
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No Team Yet</h3>
            <p className="mt-1 text-gray-500">
              You&apos;re not part of any team. Create one or join an existing team.
            </p>
            <div className="mt-6 space-x-4">
              <button
                onClick={() => router.push('/create-team')}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-md text-sm font-medium"
              >
                Create Team
              </button>
              <button
                onClick={() => router.push('/teams')}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-md text-sm font-medium"
              >
                Browse Teams
              </button>
            </div>
          </div>
        ) : !team ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading team details...</p>
          </div>
        ) : (
          // Team dashboard
          <div className="space-y-8">
            {/* Team Header */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">{team.name}</h2>
                  <p className="text-gray-600 mb-4">{team.description}</p>
                  {team.problemStatement && (
                    <div className="mb-4">
                      <span className="text-sm font-medium text-gray-500">PROBLEM STATEMENT</span>
                      <p className="text-gray-900">{team.problemStatement}</p>
                    </div>
                  )}
                  {team.techStack && team.techStack.length > 0 && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">TECH STACK</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {team.techStack.map((tech, index) => (
                          <span key={index} className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded-full">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {team.isFinalized ? (
                  <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                    ✓ Finalized
                  </span>
                ) : (
                  <span className="bg-yellow-100 text-yellow-800 text-sm font-medium px-3 py-1 rounded-full">
                    In Progress
                  </span>
                )}
              </div>
            </div>

            {/* Team Status */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">{team.members.length}/6</div>
                <div className="text-gray-600">Members</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">{team.requiredMembers}</div>
                <div className="text-gray-600">Slots Remaining</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <div className={`text-3xl font-bold mb-2 ${team.hasFemale ? 'text-green-600' : 'text-red-600'}`}>
                  {team.hasFemale ? '✓' : '✗'}
                </div>
                <div className="text-gray-600">Female Member</div>
              </div>
            </div>

            {/* Team Members */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {team.members.map((member) => (
                  <div key={member._id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium text-gray-900">{member.name}</h4>
                        {team.leader._id === member._id && (
                          <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full">Leader</span>
                        )}
                        <p className="text-sm text-gray-600">{member.email}</p>
                        <p className="text-sm text-gray-500">{member.email}</p>
                        <p className="text-sm text-gray-500">{member.year} - {member.branch}</p>
                        <p className="text-sm text-gray-500">Gender: {member.gender}</p>
                      </div>
                    </div>
                    {member.skills && member.skills.length > 0 && (
                      <div className="mt-2">
                        <div className="flex flex-wrap gap-1">
                          {member.skills.map((skill, index) => (
                            <span key={index} className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Join Requests (Only for team leader) */}
            {team.leader._id === user._id && team.joinRequests && team.joinRequests.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Join Requests</h3>
                <div className="space-y-4">
                  {team.joinRequests
                    .filter(request => request.status === 'pending')
                    .map((request) => (
                    <div key={request._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{request.user.name}</h4>
                          <p className="text-sm text-gray-600">{request.user.email}</p>
                          <p className="text-sm text-gray-500">{request.user.email}</p>
                          <p className="text-sm text-gray-500">{request.user.year} - {request.user.branch}</p>
                          <p className="text-sm text-gray-500">Gender: {request.user.gender}</p>
                          {request.message && (
                            <p className="text-sm text-gray-700 mt-2 italic">&quot;{request.message}&quot;</p>
                          )}
                          {request.user.skills && request.user.skills.length > 0 && (
                            <div className="mt-2">
                              <span className="text-xs font-medium text-gray-500">SKILLS</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {request.user.skills.map((skill, index) => (
                                  <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                    {skill}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                          <button
                            onClick={() => handleJoinRequest(request._id, 'approve')}
                            disabled={actionLoading[request._id] || team.requiredMembers <= 0}
                            className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white px-3 py-1 rounded text-sm"
                          >
                            {actionLoading[request._id] ? 'Processing...' : 'Approve'}
                          </button>
                          <button
                            onClick={() => handleJoinRequest(request._id, 'reject')}
                            disabled={actionLoading[request._id]}
                            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white px-3 py-1 rounded text-sm"
                          >
                            {actionLoading[request._id] ? 'Processing...' : 'Reject'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Finalize Team Button (Only for team leader) */}
            {team.leader._id === user._id && !team.isFinalized && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Finalize Team</h3>
                <p className="text-gray-600 mb-4">
                  Once you finalize your team, no more changes can be made. Make sure you have exactly 6 members and at least one female member.
                </p>
                
                <div className="mb-4">
                  <div className="flex items-center space-x-4">
                    <div className={`flex items-center space-x-2 ${team.members.length === 6 ? 'text-green-600' : 'text-red-600'}`}>
                      <span>{team.members.length === 6 ? '✓' : '✗'}</span>
                      <span>6 members ({team.members.length}/6)</span>
                    </div>
                    <div className={`flex items-center space-x-2 ${team.hasFemale ? 'text-green-600' : 'text-red-600'}`}>
                      <span>{team.hasFemale ? '✓' : '✗'}</span>
                      <span>Female member</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleFinalizeTeam}
                  disabled={team.members.length !== 6 || !team.hasFemale || actionLoading.finalize}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md font-medium"
                >
                  {actionLoading.finalize ? 'Finalizing...' : 'Finalize Team'}
                </button>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
