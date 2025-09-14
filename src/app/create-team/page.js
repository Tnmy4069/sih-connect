'use client';

import { useState, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../../context/AuthContext';

export default function CreateTeam() {
  const { user, token } = useContext(AuthContext);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    problemStatement: '',
    techStack: '',
    initialMembers: [{ name: '', phone: '' }] // Start with one empty member with name and phone
  });

  const addMemberField = () => {
    if (formData.initialMembers.length < 5) { // Max 5 initial members + team leader = 6 total
      setFormData(prev => ({
        ...prev,
        initialMembers: [...prev.initialMembers, { name: '', phone: '' }]
      }));
    }
  };

  const removeMemberField = (index) => {
    if (formData.initialMembers.length > 1) {
      setFormData(prev => ({
        ...prev,
        initialMembers: prev.initialMembers.filter((_, i) => i !== index)
      }));
    }
  };

  const updateMemberName = (index, name) => {
    setFormData(prev => ({
      ...prev,
      initialMembers: prev.initialMembers.map((member, i) => 
        i === index ? { ...member, name } : member
      )
    }));
  };

  const updateMemberPhone = (index, phone) => {
    setFormData(prev => ({
      ...prev,
      initialMembers: prev.initialMembers.map((member, i) => 
        i === index ? { ...member, phone } : member
      )
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    console.log('Token before request:', token);

    try {
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          initialMembers: formData.initialMembers.filter(member => member.name.trim() && member.phone.trim())
        })
      });

      const data = await response.json();
      console.log('Response:', response.status, data);

      if (response.ok) {
        alert('Team created successfully!');
        router.push('/dashboard');
      } else {
        setError(data.message || 'Failed to create team');
      }
    } catch (error) {
      console.error('Create team error:', error);
      setError('Network error occurred');
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h1>
          <button 
            onClick={() => router.push('/login')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">Create Your Team</h1>
          
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Team Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Problem Statement
              </label>
              <textarea
                name="problemStatement"
                value={formData.problemStatement}
                onChange={handleChange}
                rows="3"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tech Stack
              </label>
              <input
                type="text"
                name="techStack"
                value={formData.techStack}
                onChange={handleChange}
                placeholder="e.g., React, Node.js, MongoDB"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Initial Team Members (Names & Phone Numbers)
              </label>
              <p className="text-sm text-gray-600 mb-4">
                Add the names and phone numbers of team members you already have. They&apos;ll be invited later.
              </p>
              
              {formData.initialMembers.map((member, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 mb-4">
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={member.name}
                        onChange={(e) => updateMemberName(index, e.target.value)}
                        placeholder="Enter member name"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <input
                        type="tel"
                        value={member.phone}
                        onChange={(e) => updateMemberPhone(index, e.target.value)}
                        placeholder="Enter phone number"
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      {formData.initialMembers.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMemberField(index)}
                          className="px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {formData.initialMembers.length < 5 && (
                <button
                  type="button"
                  onClick={addMemberField}
                  className="mt-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  Add Member
                </button>
                )}
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Creating Team...' : 'Create Team'}
              </button>
            </div>
          </form>

          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-semibold text-blue-800 mb-2">SIH Rules Reminder:</h3>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Teams must have exactly 6 members</li>
              <li>• Maximum 2 members from same institution</li>
              <li>• All members must be students</li>
              <li>• Leader must be from an Indian institution</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
