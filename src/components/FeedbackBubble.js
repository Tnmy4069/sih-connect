'use client';

import { useState } from 'react';

export default function FeedbackBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('feedback');
  const [formData, setFormData] = useState({
    type: 'feedback',
    name: '',
    subject: '',
    message: '',
    email: '',
    priority: 'medium'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const feedbackTypes = {
    feedback: {
      title: 'Share Feedback',
      icon: '💬',
      placeholder: 'Tell us what you think about SIH Connect...',
      color: 'bg-blue-500'
    },
    bug: {
      title: 'Report Bug',
      icon: '🐛',
      placeholder: 'Describe the issue you encountered...',
      color: 'bg-red-500'
    },
    feature: {
      title: 'Feature Request',
      icon: '💡',
      placeholder: 'What feature would you like to see...',
      color: 'bg-green-500'
    },
    suggestion: {
      title: 'Suggestion',
      icon: '✨',
      placeholder: 'Share your suggestions for improvement...',
      color: 'bg-purple-500'
    },
    help: {
      title: 'Need Help',
      icon: '❓',
      placeholder: 'What do you need help with...',
      color: 'bg-orange-500'
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setIsSubmitted(true);
        setTimeout(() => {
          setIsSubmitted(false);
          setIsOpen(false);
          setFormData({
            type: 'feedback',
            name: '',
            subject: '',
            message: '',
            email: '',
            priority: 'medium'
          });
        }, 2000);
      } else {
        console.error('Failed to submit feedback');
      }
    } catch (error) {
      console.error('Error submitting feedback:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const selectFeedbackType = (type) => {
    setFormData(prev => ({
      ...prev,
      type: type
    }));
    setActiveTab('form');
  };

  if (isSubmitted) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <div className="bg-green-500 text-white p-4 rounded-full shadow-lg animate-bounce">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">✅</span>
            <span className="font-medium">Thank you!</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Feedback Modal */}
      {isOpen && (
        <div className="mb-4 bg-white rounded-2xl shadow-2xl border border-gray-200 w-80 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">
                {activeTab === 'feedback' ? 'How can we help?' : feedbackTypes[formData.type]?.title}
              </h3>
              <button
                onClick={() => {
                  setIsOpen(false);
                  setActiveTab('feedback');
                }}
                className="text-white hover:text-gray-200 text-xl"
              >
                ×
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-4 max-h-80 overflow-y-auto">
            {activeTab === 'feedback' ? (
              /* Feedback Type Selection */
              <div className="space-y-3">
                <p className="text-gray-600 text-sm mb-4">Choose what you&apos;d like to share:</p>
                {Object.entries(feedbackTypes).map(([key, type]) => (
                  <button
                    key={key}
                    onClick={() => selectFeedbackType(key)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 border border-gray-200 transition-colors"
                  >
                    <span className="text-2xl">{type.icon}</span>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{type.title}</div>
                      <div className="text-xs text-gray-500">
                        {key === 'feedback' && 'Share your thoughts'}
                        {key === 'bug' && 'Report technical issues'}
                        {key === 'feature' && 'Request new features'}
                        {key === 'suggestion' && 'General suggestions'}
                        {key === 'help' && 'Get assistance'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              /* Feedback Form */
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter your name..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    placeholder="Brief summary..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder={feedbackTypes[formData.type]?.placeholder}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email (optional)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="your@email.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                  />
                </div>

                {formData.type === 'bug' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="critical">Critical</option>
                    </select>
                  </div>
                )}

                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveTab('feedback')}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 text-sm"
                  >
                    {isSubmitting ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Floating Bubble */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 ${
          isOpen ? 'rotate-45' : ''
        }`}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-3.582 8-8 8a8.013 8.013 0 01-7-4.165c0-.08.002-.16.007-.239A7.984 7.984 0 011.255 12C1.255 7.582 4.837 4 9.255 4s8 3.582 8 8z" />
          </svg>
        )}
        
        {/* Tooltip */}
        {!isOpen && (
          <div className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            Share feedback
            <div className="absolute left-full top-1/2 transform -translate-y-1/2 border-4 border-transparent border-l-gray-800"></div>
          </div>
        )}

        {/* Pulse animation */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 animate-ping opacity-20"></div>
      </button>
    </div>
  );
}
