import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronRight, Lock, CheckCircle, Send, Star, MessageCircle } from 'lucide-react';
import axios from 'axios';

interface Session {
  _id: string;
  sessionNumber: number;
  title: string;
  videoUrl: string;
  duration: number;
  isWatched: boolean;
  isCompleted: boolean;
  unlockRules: {
    requiresPreviousCompletion: boolean;
    timeGapAfterPreviousHours: number;
    requiresAssignment: boolean;
    requiresRating: boolean;
  };
}

interface Progress {
  _id: string;
  enrollmentId: string;
  workshopId: string;
  sessionsCompleted: any[];
  currentSessionNumber: number;
  completionPercentage: number;
  unlockedSessions: number[];
  ratingSubmitted: boolean;
  testimonySubmitted: boolean;
}

export default function CoursePlayerPage() {
  const { enrollmentId } = useParams();
  const navigate = useNavigate();
  const [progress, setProgress] = useState<Progress | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'sessions' | 'assignment' | 'chat'>('sessions');
  const [rating, setRating] = useState(0);
  const [testimony, setTestimony] = useState('');

  useEffect(() => {
    fetchProgressAndSessions();
  }, [enrollmentId]);

  const fetchProgressAndSessions = async () => {
    try {
      setLoading(true);
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        navigate('/signin');
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user.id || user._id;

      // Fetch progress
      const progressRes = await axios.get(
        `/api/student-progress/enrollment/${enrollmentId}`,
        { headers: { 'X-User-ID': userId } }
      );

      const progressData = progressRes.data.data || progressRes.data;
      setProgress(progressData);

      // Fetch sessions for this workshop
      if (progressData.workshopId) {
        const sessionsRes = await axios.get(
          `/api/workshops/${progressData.workshopId}`,
          { headers: { 'X-User-ID': userId } }
        );

        const workshop = sessionsRes.data.data || sessionsRes.data;
        const workshopSessions = (workshop.sessions || []).map(
          (session: any, idx: number) => ({
            ...session,
            sessionNumber: idx + 1,
            isWatched: progressData.sessionsCompleted[idx]?.isWatched || false,
            isCompleted: progressData.sessionsCompleted[idx]?.isCompleted || false
          })
        );

        setSessions(workshopSessions);

        // Set current session
        const currentIdx = Math.min(
          progressData.currentSessionNumber - 1,
          workshopSessions.length - 1
        );
        setCurrentSession(workshopSessions[currentIdx]);
      }
    } catch (error) {
      console.error('Error fetching course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSessionClick = async (session: Session) => {
    if (progress?.unlockedSessions.includes(session.sessionNumber)) {
      setCurrentSession(session);

      // Record watch
      try {
        const userStr = localStorage.getItem('user');
        if (userStr) {
          const user = JSON.parse(userStr);
          const userId = user.id || user._id;

          await axios.post(
            `/api/student-progress/${progress._id}/session-watch`,
            {
              sessionNumber: session.sessionNumber,
              watchTime: 0
            },
            { headers: { 'X-User-ID': userId } }
          );
        }
      } catch (error) {
        console.error('Error recording watch:', error);
      }
    }
  };

  const handleSubmitRating = async () => {
    if (!progress || rating === 0) return;

    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const userId = user.id || user._id;

      await axios.post(
        `/api/student-progress/${progress._id}/rating`,
        { rating },
        { headers: { 'X-User-ID': userId } }
      );

      setRating(0);
      fetchProgressAndSessions();
    } catch (error) {
      console.error('Error submitting rating:', error);
    }
  };

  const handleSubmitTestimony = async () => {
    if (!progress || !testimony.trim()) return;

    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const userId = user.id || user._id;

      await axios.post(
        `/api/student-progress/${progress._id}/testimony`,
        { testimony },
        { headers: { 'X-User-ID': userId } }
      );

      setTestimony('');
      fetchProgressAndSessions();
    } catch (error) {
      console.error('Error submitting testimony:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p>Loading course...</p>
        </div>
      </div>
    );
  }

  if (!currentSession || !progress) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-white text-center">
          <p className="text-lg mb-4">Course not found</p>
          <button
            onClick={() => navigate('/my-courses')}
            className="px-6 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700"
          >
            Back to Courses
          </button>
        </div>
      </div>
    );
  }

  const isSessionUnlocked = progress.unlockedSessions.includes(
    currentSession.sessionNumber
  );

  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Video Player */}
        <div className="bg-black aspect-video flex items-center justify-center mb-6">
          {isSessionUnlocked ? (
            <video
              src={currentSession.videoUrl}
              controls
              className="w-full h-full"
            />
          ) : (
            <div className="text-center">
              <Lock className="w-16 h-16 mx-auto mb-4 text-gray-500" />
              <p className="text-gray-400">This session is locked</p>
            </div>
          )}
        </div>

        {/* Session Title & Progress */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold mb-2">
            {currentSession.title}
          </h1>
          <div className="flex items-center gap-4 text-gray-400">
            <span>Session {currentSession.sessionNumber}</span>
            <span>•</span>
            <span>{Math.floor(currentSession.duration / 60)} min</span>
            <span>•</span>
            <span>Progress: {progress.completionPercentage}%</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-400 mb-2">
            <span>Course Progress</span>
            <span>{progress.completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${progress.completionPercentage}%` }}
            ></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-700">
              {(['sessions', 'assignment', 'chat'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-2 font-medium transition-colors border-b-2 ${
                    selectedTab === tab
                      ? 'text-indigo-400 border-indigo-600'
                      : 'text-gray-400 border-transparent hover:text-white'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {selectedTab === 'sessions' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Course Sessions</h3>
                <div className="space-y-2">
                  {sessions.map((session) => (
                    <button
                      key={session._id}
                      onClick={() => handleSessionClick(session)}
                      disabled={!progress.unlockedSessions.includes(session.sessionNumber)}
                      className={`w-full p-4 rounded-lg text-left flex items-center gap-4 transition-colors ${
                        currentSession._id === session._id
                          ? 'bg-indigo-600'
                          : progress.unlockedSessions.includes(session.sessionNumber)
                          ? 'bg-gray-700 hover:bg-gray-600'
                          : 'bg-gray-900 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex-1">
                        <p className="font-medium">{session.title}</p>
                        <p className="text-sm text-gray-300">
                          {Math.floor(session.duration / 60)} min
                        </p>
                      </div>
                      {session.isCompleted ? (
                        <CheckCircle className="w-5 h-5 text-green-400" />
                      ) : !progress.unlockedSessions.includes(session.sessionNumber) ? (
                        <Lock className="w-5 h-5 text-gray-500" />
                      ) : (
                        <ChevronRight className="w-5 h-5" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {selectedTab === 'assignment' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4">Assignment</h3>
                <p className="text-gray-300 mb-4">Assignment content will appear here</p>
                {/* Assignment form would go here */}
              </div>
            )}

            {selectedTab === 'chat' && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  Chat
                </h3>
                <p className="text-gray-300">Chat with instructors and peers here</p>
                {/* Chat interface would go here */}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Rating */}
            {!progress.ratingSubmitted && (
              <div className="bg-gray-800 rounded-lg p-6 mb-6">
                <h4 className="font-bold mb-4">Rate this course</h4>
                <div className="flex gap-2 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      className="transition-colors"
                    >
                      <Star
                        className={`w-8 h-8 ${
                          star <= rating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-500'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <button
                  onClick={handleSubmitRating}
                  disabled={rating === 0}
                  className="w-full px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  Submit Rating
                </button>
              </div>
            )}

            {/* Testimony */}
            {!progress.testimonySubmitted && (
              <div className="bg-gray-800 rounded-lg p-6">
                <h4 className="font-bold mb-4">Share your experience</h4>
                <textarea
                  value={testimony}
                  onChange={(e) => setTestimony(e.target.value)}
                  placeholder="What did you learn from this course?"
                  className="w-full p-3 bg-gray-700 rounded-lg text-white placeholder-gray-400 mb-4 resize-none h-24"
                />
                <button
                  onClick={handleSubmitTestimony}
                  disabled={!testimony.trim()}
                  className="w-full px-4 py-2 bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Submit
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
