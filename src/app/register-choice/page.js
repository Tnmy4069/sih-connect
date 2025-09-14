'use client';

import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function RegisterChoice() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user && user.teamId) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleCreateTeam = () => {
    router.push('/create-team');
  };

  const handleJoinTeam = () => {
    router.push('/teams');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to SIH Connect!
          </h1>
          <p className="text-xl text-gray-600">
            What would you like to do?
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Create Team Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="text-center">
              <div className="bg-indigo-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Create a Team</h2>
              <p className="text-gray-600 mb-6">
                Start your own team and invite friends or find new members to complete your SIH team.
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-8">
                <li>• Add 0-5 initial members</li>
                <li>• Find remaining members</li>
                <li>• Lead your team to victory</li>
              </ul>
              <button
                onClick={handleCreateTeam}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Create Team
              </button>
            </div>
          </div>

          {/* Join Team Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 hover:shadow-2xl transition-shadow">
            <div className="text-center">
              <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6">
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Join a Team</h2>
              <p className="text-gray-600 mb-6">
                Browse existing teams that need members and find the perfect match for your skills.
              </p>
              <ul className="text-sm text-gray-500 space-y-2 mb-8">
                <li>• Browse available teams</li>
                <li>• Send join requests</li>
                <li>• Get matched instantly</li>
              </ul>
              <button
                onClick={handleJoinTeam}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors"
              >
                Browse Teams
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
            SIH Team Requirements
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-2xl font-bold text-indigo-600 mb-2">6</div>
              <div className="text-sm text-gray-600">Members exactly</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-pink-600 mb-2">1+</div>
              <div className="text-sm text-gray-600">Female member required</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-600 mb-2">1</div>
              <div className="text-sm text-gray-600">Team leader</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
